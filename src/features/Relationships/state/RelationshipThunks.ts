import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { updateEssenceGenerationRateThunk } from '../../Essence';
import {
  formRelationshipMemory,
  recordRelationshipExperience,
} from './RelationshipSlice';
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
    ).then(mergeBundles);
  }

  return definitionBundlePromise;
};

export const recordAuthoredRelationshipExperienceThunk = createAsyncThunk<
  { experienceId: string; recorded: boolean; memoryId?: string },
  { experienceId: string; timestamp?: number },
  { state: RootState; rejectValue: string }
>(
  'relationships/recordAuthoredExperience',
  async ({ experienceId, timestamp }, { dispatch, getState, rejectWithValue }) => {
    try {
      const definitions = await loadRelationshipDefinitions();
      const definition = definitions.experiences[experienceId];

      if (!definition) {
        return rejectWithValue(`Unknown authored relationship experience: ${experienceId}`);
      }

      const relationships = (getState() as RootState & {
        relationships?: RootState['relationships'];
      }).relationships;

      if (
        relationships?.experiencesById[definition.id] ||
        (definition.uniqueKey && relationships?.appliedUniqueKeys[definition.uniqueKey])
      ) {
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
      }

      // During shadow mode the existing Essence formula still reads legacy connectionDepth.
      // Recalculate anyway so this hook remains correct when Essence inputs cut over later.
      await dispatch(updateEssenceGenerationRateThunk());

      return { experienceId: experience.id, recorded: true, memoryId };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return rejectWithValue(message);
    }
  }
);
