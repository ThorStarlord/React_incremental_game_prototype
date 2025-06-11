/**
 * Traits Feature Barrel Export
 * 
 * Public API exports for the Traits feature following Feature-Sliced Design principles.
 */

// State exports
export { default as traitsSlice } from './state/TraitsSlice';
export * from './state/TraitsSelectors';
export * from './state/TraitsTypes';
export * from './state/TraitThunks';

// Component exports
export { default as TraitSystemWrapper } from './components/containers/TraitSystemWrapper';
export { default as TraitSlotsContainer } from './components/containers/TraitSlotsContainer';
export { default as TraitSystemUI } from './components/ui/TraitSystemUI';
export { default as TraitCard } from './components/ui/TraitCard';

// UI exports for external usage
export { default as TraitSlots } from './components/ui/TraitSlots';
export { default as TraitManagement } from './components/ui/TraitManagement';
export { default as TraitCodex } from './components/ui/TraitCodex';
