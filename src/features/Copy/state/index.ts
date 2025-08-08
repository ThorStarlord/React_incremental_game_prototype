/**
 * @file index.ts
 * @description Public API for the Copy feature.
 */

// State
export { default as copyReducer } from '../state/CopySlice';
export * from '../state/CopySlice';

// Types
export * from '../state/CopyTypes';

// Thunks
export * from '../state/CopyThunks';

// Selectors (will be created later)
export * from './CopySelectors';

// Components (will be created later)
// export * from './components/ui/CopyList';