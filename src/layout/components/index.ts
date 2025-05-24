// Modern layout components (Active)
export { GameLayout } from './GameLayout';
export { MainContentArea } from './MainContentArea';
export { VerticalNavBar } from './VerticalNavBar/VerticalNavBar';

// Legacy layout components (Deprecated)
/**
 * @deprecated GameContainer and column components are deprecated
 * Please migrate to GameLayout for new layout architecture
 */
export { GameContainer } from './GameContainer';

/**
 * @deprecated Column components are deprecated as part of legacy 3-column layout
 * Use GameLayout with VerticalNavBar and MainContentArea instead
 */
export { LeftColumn, MiddleColumn, RightColumn } from './columns';

// Console warning for deprecated component usage
if (process.env.NODE_ENV === 'development') {
  console.info(
    'Layout Architecture Update: ' +
    'GameContainer and column components are deprecated. ' +
    'Please use GameLayout for new implementations.'
  );
}
