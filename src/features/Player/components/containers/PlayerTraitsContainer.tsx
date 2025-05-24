import React from 'react';
import { PlayerTraits as PlayerTraitsUI } from '../ui/PlayerTraitsUI';

/**
 * PlayerTraitsContainer component provides a wrapper around the PlayerTraits UI
 * component, handling any additional logic, state management, or side effects
 * needed for trait management within the character context.
 */
export const PlayerTraitsContainer: React.FC = React.memo(() => {
  // Additional container logic can be added here if needed
  // For now, this serves as a clean separation between UI and container logic
  
  return <PlayerTraitsUI />;
});

PlayerTraitsContainer.displayName = 'PlayerTraitsContainer';
