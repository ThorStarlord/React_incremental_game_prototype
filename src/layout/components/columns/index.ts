/**
 * @deprecated Column components are deprecated as part of legacy 3-column layout system
 * 
 * The entire columns directory and its components (LeftColumn, MiddleColumn, RightColumn)
 * are deprecated in favor of the GameLayout component with VerticalNavBar and MainContentArea.
 * 
 * Migration Guide:
 * - Replace column-based layout with GameLayout component
 * - Use VerticalNavBar for navigation (replaces LeftColumn)
 * - Use MainContentArea for dynamic content (replaces MiddleColumn)
 * - Integrate activity/logging into page components (replaces RightColumn)
 * 
 * @see src/layout/components/GameLayout.tsx
 * 
 * These exports will be removed in a future version.
 */

// Deprecated exports with console warnings
export { LeftColumn } from './LeftColumn';
export { MiddleColumn } from './MiddleColumn';
export { RightColumn } from './RightColumn';

// Console warning for any imports from this barrel
console.warn(
  'Layout columns are deprecated. Please migrate to GameLayout component. ' +
  'See src/layout/components/GameLayout.tsx for the replacement.'
);
