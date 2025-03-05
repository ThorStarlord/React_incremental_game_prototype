import React from 'react';

interface BattleProps {
  dungeonId?: string;
  onExplorationComplete?: () => void;
  difficulty?: number;
  enemyType?: string;
}

declare const Battle: React.FC<BattleProps>;

export default Battle;
