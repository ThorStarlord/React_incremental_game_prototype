// Traits feature public API

// State
export { default as traitsReducer,
  setTraits,
  discoverTrait,
  acquireTrait,
  // makePermanent, // Removed, deprecated
  saveTraitPreset,
  loadTraitPreset,
  deleteTraitPreset,
  // setLoading, // Not exported by TraitsSlice.actions
  // setError,   // Not exported by TraitsSlice.actions
  // addTraitDefinition // Not exported by TraitsSlice.actions
} from './state/TraitsSlice';
export * from './state/TraitsSelectors';
export * from './state/TraitThunks';
export * from './state/TraitsTypes';

// Hooks
export * from './hooks/useTraitNotifications';

// Components
export { default as TraitCodexDrawer } from './components/containers/TraitCodexDrawer';
export { default as TraitSlotsContainer } from './components/containers/TraitSlotsContainer';
export { default as TraitListContainer } from './components/containers/TraitListContainer';
export { default as TraitAcquisitionPanel } from './components/containers/TraitAcquisitionPanel';
export { default as TraitSystemErrorBoundary } from './components/containers/TraitSystemErrorBoundary';
export { TraitSystemWrapper } from './components/containers/TraitSystemWrapper';

// UI Components
export { default as TraitList } from './components/ui/TraitList';
export { default as TraitSlots } from './components/ui/TraitSlots';
export { TraitCodex } from './components/ui/TraitCodex';
export { TraitManagement } from './components/ui/TraitManagement';
