import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { addNotification } from '../../../shared/state/NotificationSlice';
import { updateEssenceGenerationRateThunk } from '../../Essence/state/EssenceThunks';
import {
  formRelationshipMemory,
  initializeBondProfile,
  recordConnectionQualification,
  recordRelationshipExperience,
  registerRelationshipProgressionDefinitions,
} from './RelationshipSlice';
import {
  checkConnectionQualificationRule,
  selectBondProfileByNpcId,
  selectRelationshipProgressionDefinition,
} from './RelationshipSelectors';
import type {
  RelationshipDefinitionBundle,
  RelationshipExperience,
  RelationshipMemory,
} from './RelationshipTypes';

const AUTHORING_BUNDLE_URLS = ['/data/relationships/elder-willow.json'];
let definitionBundlePromise: Promise<RelationshipDefinitionBundle> | null = null;

const mergeBundles = (
  bundles: RelationshipDefinitionBundle[]
): RelationshipDefinitionBundle => ({
  experiences: Object.assign({}, ...bundles.map(bundle => bundle.experiences)),
  memories: Object.assign({}, ...bundles.map(bundle => bundle.memories)),
  progression: Object.assign({}, ...bundles.map(bundle => bundle.progression ?? {})),
});

const loadRelationshipDefinitions = async (): Promise<RelationshipDefinitionBundle> => {
  if (!definitionBundlePromise) {
    definitionBundlePromise = Promise.all(
      AUTHORING_BUNDLE_URLS.map(async url => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load relationship definitions: ${url}`);
        }
        return (await response.json()) as RelationshipDefinitionBundle;
      })
    )
      .then(mergeBundles)
      .catch(error => {
        // Allow a later interaction to retry after a transient asset-load failure.
        definitionBundlePromise = null;
        throw error;
      });
  }

  return definitionBundlePromise;
};

export const initializeRelationshipRuntimeThunk = createAsyncThunk<
  { registeredNpcIds: string[] },
  { seedProfiles?: boolean } | undefined,
  { state: RootState; rejectValue: string }
>(
  'relationships/initializeRuntime',
  async (options, { dispatch, rejectWithValue }) => {
    try {
      const definitions = await loadRelationshipDefinitions();
      const progression = definitions.progression ?? {};
      dispatch(registerRelationshipProgressionDefinitions(progression));

      if (options?.seedProfiles) {
        for (const config of Object.values(progression)) {
          if (!config.startingProfile) continue;
          dispatch(
            initializeBondProfile({
              npcId: config.npcId,
              ...config.startingProfile,
              tetherState:
                config.startingProfile.tetherState ??
                config.essence?.startingTetherState ??
                'present',
            })
          );
        }
      }

      await dispatch(updateEssenceGenerationRateThunk());
      return { registeredNpcIds: Object.keys(progression) };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return rejectWithValue(message);
    }
  }
);

export const evaluateConnectionQualificationThunk = createAsyncThunk<
  { npcId: string; previousLevel: number; newLevel: number },
  { npcId: string },
  { state: RootState; rejectValue: string }
>(
  'relationships/evaluateConnectionQualification',
  async ({ npcId }, { dispatch, getState, rejectWithValue }) => {
    try {
      const definitions = await loadRelationshipDefinitions();
      if (definitions.progression) {
        dispatch(registerRelationshipProgressionDefinitions(definitions.progression));
      }

      let state = getState() as RootState;
      const config = selectRelationshipProgressionDefinition(state, npcId);
      const initialProfile = selectBondProfileByNpcId(state, npcId);
      const previousLevel = initialProfile.connectionLevel;

      if (!config || config.connectionAuthority !== 'relationships') {
        return { npcId, previousLevel, newLevel: previousLevel };
      }

      const rules = [...(config.qualificationRules ?? [])].sort(
        (a, b) => a.level - b.level
      );
      let currentLevel = previousLevel;

      for (const rule of rules) {
        if (rule.level <= currentLevel) continue;
        if (rule.level !== currentLevel + 1) break;

        state = getState() as RootState;
        const check = checkConnectionQualificationRule(state, npcId, rule);
        if (!check.passed) break;

        dispatch(
          recordConnectionQualification({
            npcId,
            level: rule.level,
            evidenceIds: check.evidenceIds,
          })
        );

        // BondProfile is authoritative for migrated NPCs. Keep the legacy field as
        // a compatibility projection until all old consumers have migrated.
        dispatch({
          type: 'npcs/updateNpcConnectionDepth',
          payload: { npcId, newDepth: rule.level },
        });

        const npcName = (getState() as RootState).npcs.npcs[npcId]?.name ?? npcId;
        dispatch(
          addNotification({
            type: 'success',
            message: `Your Connection with ${npcName} deepened to Level ${rule.level}.`,
          })
        );
        currentLevel = rule.level;
      }

      if (currentLevel !== previousLevel) {
        await dispatch(updateEssenceGenerationRateThunk());
      }

      return { npcId, previousLevel, newLevel: currentLevel };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return rejectWithValue(message);
    }
  }
);

export const recordAuthoredRelationshipExperienceThunk = createAsyncThunk<
  { experienceId: string; recorded: boolean; memoryId?: string },
  { experienceId: string; timestamp?: number },
  { state: RootState; rejectValue: string }
>(
  'relationships/recordAuthoredExperience',
  async ({ experienceId, timestamp }, { dispatch, getState, rejectWithValue }) => {
    try {
      const definitions = await loadRelationshipDefinitions();
      if (definitions.progression) {
        dispatch(registerRelationshipProgressionDefinitions(definitions.progression));
      }

      const definition = definitions.experiences[experienceId];

      if (!definition) {
        return rejectWithValue(`Unknown authored relationship experience: ${experienceId}`);
      }

      const relationships = (getState() as Partial<RootState>).relationships;
      const existingExperience = relationships?.experiencesById?.[definition.id];
      const alreadyApplied = Boolean(
        existingExperience ||
        (definition.uniqueKey && relationships?.appliedUniqueKeys?.[definition.uniqueKey])
      );

      if (alreadyApplied) {
        // If a prior version recorded the Experience but failed before forming its
        // authored Memory, repair the projection without applying event deltas again.
        if (definition.memoryDefinitionId && existingExperience) {
          const memoryDefinition = definitions.memories[definition.memoryDefinitionId];
          const memoryExists = relationships?.memoriesById?.[definition.memoryDefinitionId];
          if (memoryDefinition && !memoryExists) {
            dispatch(
              formRelationshipMemory({
                ...memoryDefinition,
                timestamp: existingExperience.timestamp,
              })
            );
          }
        }

        await dispatch(
          evaluateConnectionQualificationThunk({ npcId: definition.primaryTargetId })
        );
        await dispatch(updateEssenceGenerationRateThunk());

        return {
          experienceId: definition.id,
          recorded: false,
          memoryId: definition.memoryDefinitionId,
        };
      }

      const occurredAt = timestamp ?? Date.now();
      const { memoryDefinitionId, ...runtimeDefinition } = definition;
      const experience: RelationshipExperience = {
        ...runtimeDefinition,
        timestamp: occurredAt,
      };

      dispatch(recordRelationshipExperience(experience));

      let memoryId: string | undefined;
      if (memoryDefinitionId) {
        const memoryDefinition = definitions.memories[memoryDefinitionId];
        if (!memoryDefinition) {
          throw new Error(
            `Experience ${experienceId} references missing Memory definition ${memoryDefinitionId}`
          );
        }

        const memory: RelationshipMemory = {
          ...memoryDefinition,
          timestamp: occurredAt,
        };
        dispatch(formRelationshipMemory(memory));
        memoryId = memory.id;

        if (memory.playerVisible) {
          dispatch(
            addNotification({
              type: 'success',
              message: `Memory formed: ${memory.title}`,
            })
          );
        }
      }

      await dispatch(
        evaluateConnectionQualificationThunk({ npcId: experience.primaryTargetId })
      );
      // M4 integration changes the future passive rate only; it never directly
      // grants Essence for recording a relationship Experience.
      await dispatch(updateEssenceGenerationRateThunk());

      return { experienceId: experience.id, recorded: true, memoryId };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return rejectWithValue(message);
    }
  }
);
