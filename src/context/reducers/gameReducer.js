/**
 * Re-exports the rootReducer as gameReducer for backward compatibility
 * This file exists to maintain compatibility with existing imports
 * that expect a gameReducer file.
 */
import { rootReducer } from './rootReducer';

// Simply re-export rootReducer as the default export
export default rootReducer;
