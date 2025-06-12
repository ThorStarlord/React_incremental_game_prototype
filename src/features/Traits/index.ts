/**
 * Traits Feature Barrel Export (Corrected)
 */
export { default as traitsSlice } from './state/TraitsSlice';
// FIXED: Exporting only the selectors that now live in TraitsSelectors.ts
export {
  selectTraitsState,
  selectTraits,
  selectAllTraits,
  selectAcquiredTraits,
  selectDiscoveredTraits,
  selectTraitPresets,
  selectTraitLoading,
  selectTraitError,
  selectTraitById,
  selectAcquiredTraitObjects,
  selectDiscoveredTraitObjects,
  selectTraitPresetById
} from './state/TraitsSelectors';
export * from './state/TraitsTypes';
export * from './state/TraitThunks';
export { default as TraitSlotsContainer } from './components/containers/TraitSlotsContainer';
export { default as TraitSystemUI } from './components/ui/TraitSystemTabs';
export { default as TraitCard } from './components/ui/TraitCard';
export { default as TraitSlots } from './components/ui/TraitSlots';
export { default as TraitManagement } from './components/ui/TraitManagement';
export { default as TraitCodex } from './components/ui/TraitCodex';