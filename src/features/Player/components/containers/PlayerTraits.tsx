import React from 'react';
import { PlayerTraits as PlayerTraitsUI } from '../ui/PlayerTraitsUI';

/**
 * PlayerTraits container component
 * 
 * This container wraps the PlayerTraits UI component and provides
 * any additional logic or state management needed for the traits
 * interface within the Player feature context.
 * 
 * Currently acts as a passthrough to the UI component since
 * all logic is handled within the UI component itself.
 */
export const PlayerTraitsContainer: React.FC = React.memo(() => {
  return <PlayerTraitsUI />;
});

PlayerTraitsContainer.displayName = 'PlayerTraitsContainer';

export default PlayerTraitsContainer;