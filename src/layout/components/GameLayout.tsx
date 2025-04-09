import React, { ReactNode } from 'react';
import GameContainer from './GameContainer';

/**
 * @file GameLayout.tsx
 * @description Legacy wrapper for GameContainer maintained for backward compatibility.
 * 
 * This component is a simple pass-through to GameContainer. All functionalities
 * have been consolidated into GameContainer.
 * 
 * @deprecated Use GameContainer directly instead
 */

interface GameLayoutProps {
  /** Content to be rendered in place of default components (optional) */
  children?: ReactNode;
  /** Whether to show the left column */
  showLeftColumn?: boolean;
  /** Whether to show the right column */
  showRightColumn?: boolean;
}

/**
 * GameLayout Component - Legacy wrapper for backward compatibility
 * 
 * This component has been maintained for backward compatibility.
 * All functionality has been moved to GameContainer.
 * 
 * @component
 */
const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  showLeftColumn = true,
  showRightColumn = true
}) => {
  // Simply pass all props through to GameContainer
  return (
    <GameContainer
      showLeftColumn={showLeftColumn}
      showRightColumn={showRightColumn}
    >
      {children}
    </GameContainer>
  );
};

export default GameLayout;
