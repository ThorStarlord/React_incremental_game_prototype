export type {
  RelationshipDimensionKey,
  RelationshipSignificance,
  RelationshipSourceType,
  RelationshipMemoryType,
  RelationshipMemoryPersistence,
  RelationshipStability,
  RelationshipDimensions,
  RelationshipTraitEffect,
  RelationshipExperience,
  RelationshipMemory,
  BondProfile,
  RelationshipState,
  InitializeBondProfilePayload,
  RelationshipDefinitionBundle,
} from './state/RelationshipTypes';

export {
  default as relationshipReducer,
  relationshipActions,
  resetRelationships,
  initializeBondProfile,
  recordRelationshipExperience,
  formRelationshipMemory,
  setShadowConnectionLevel,
} from './state/RelationshipSlice';

export { recordAuthoredRelationshipExperienceThunk } from './state/RelationshipThunks';

export * from './state/RelationshipSelectors';
