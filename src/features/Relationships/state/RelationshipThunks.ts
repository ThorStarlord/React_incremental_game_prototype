import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { addNotification } from '../../../shared/state/NotificationSlice';
import { updateGenerationRate } from '../../Essence/state/EssenceSlice';
import { calculateEssenceGenerationRate } from '../../Essence/utils/essenceRate';
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

const AUTHORING_MANIFEST_URL = '/data/relationships/index.json';
let definitionBundlePromise: Promise<RelationshipDefinitionBundle> | null = null;

interface RelationshipDefinitionManifest {
  bundles: string[];
}

const isDefinitionBundle = (value: unknown): value is RelationshipDefinitionBundle => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<RelationshipDefinitionBundle>;
  return Boolean(candidate.experiences && candidate.memories);
};

const mergeBundles = (
  bundles: RelationshipDefinitionBundle[]
): RelationshipDefinitionBundle => ({
  experiences: Object.assign({}, ...bundles.map(bundle => bundle.experiences)),
  memories: Object.assign({}, ...bundles.map(bundle => bundle.memories)),
  progression: Object.assign({}, ...bundles.map(bundle => bundle.progression ?? {})),
});

const fetchDefinitionBundle = async (url: string): Promise<RelationshipDefinitionBundle> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load relationship definitions: ${url}`);
  }
  const payload = await response.json();
  if (!isDefinitionBundle(payload)) {
    throw new Error(`Invalid relationship definition bundle: ${url}`);
  }
  return payload;
};

const loadRelationshipDefinitions = async (): Promise<RelationshipDefinitionBundle> => {
  if (!definitionBundlePromise) {
    definitionBundlePromise = (async () => {
      const response = await fetch(AUTHORING_MANIFEST_URL);
      if (!response.ok) {
        throw new Error(`Failed to load relationship definition manifest: ${AUTHORING_MANIFEST_URL}`);
      }

      const payload = await response.json();

      // Migration compatibility: the original runtime loaded one Willow bundle
      // directly. Accepting that shape keeps old saves/tests and temporary hosts
      // functional while production authoring moves to the manifest registry.
      if (isDefinitionBundle(payload)) return payload;

      const manifest = payload as Partial<RelationshipDefinitionManifest>;
      if (!Array.isArray(manifest.bundles) || manifest.bundles.length === 0) {
        throw new Error(`Invalid relationship definition manifest: ${AUTHORING_MANIFEST_URL}`);
      }

      const urls = Array.from(new Set(manifest.bundles));
      const bundles = await Promise.all(urls.map(fetchDefinitionBundle));
      return mergeBundles(bundles);
    })().catch(error => {
      definitionBundlePromise = null;
      throw error;
    });
  }

  return definitionBundlePromise;
};

/**
 * Recalculate passive Essence without importing the Essence thunk module.
 * EssenceThunks itself depends on Relationship selectors, so importing that thunk
 * here would create a runtime TDZ cycle under Jest/CRA module evaluation.
 */
const refreshEssenceRate = (dispatch: any, getState: () => unknown) => {
  const calculation = calculateEssenceGenerationRate(getState() as RootState);
  dispatch(updateGenerationRate(calculation.newRate));
  return calculation;
};

export const initializeRelationshipRuntimeThunk = createAsyncThunk<
  { registeredNpcIds: string[] },
  { seedProfiles?: boolean } | undefined,
  { rejectValue: string }
>(
  'relationships/initializeRuntime',
  async (options, { dispatch, getState, rejectWithValue }) => {
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

      refreshEssenceRate(dispatch, getState);
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
  { rejectValue: string }
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
        // a compatibility projection until old consumers have migrated.
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
        refreshEssenceRate(dispatch, getState);
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
  { rejectValue: string }
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
        refreshEssenceRate(dispatch, getState);

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

      // Existing dialogue/service consumers still read NPC affinity. Project the
      // authored migrated-NPC Affinity there without invoking legacy rollover.
      const config = selectRelationshipProgressionDefinition(
        getState() as RootState,
        experience.primaryTargetId
      );
      const affinityDelta = experience.relationshipEffects.affinity;
      if (
        config?.connectionAuthority === 'relationships' &&
        typeof affinityDelta === 'number' &&
        affinityDelta !== 0
      ) {
        dispatch({
          type: 'npcs/updateNpcAffinity',
          payload: {
            npcId: experience.primaryTargetId,
            change: affinityDelta,
            reason: `Relationship Experience: ${experience.id}`,
          },
        });
      }

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
      // Relationship Experiences alter future passive production; they do not
      // directly mint current Essence.
      refreshEssenceRate(dispatch, getState);

      return { experienceId: experience.id, recorded: true, memoryId };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return rejectWithValue(message);
    }
  }
);