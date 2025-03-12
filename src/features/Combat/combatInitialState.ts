import { 
  CombatState, 
  Enemy, 
  CombatLogEntry 
} from '../../context/types/GameStateTypes';

/**
 * Initial state for the combat system
 */
const CombatInitialState: CombatState = {
  inCombat: false,
  playerTurn: true,
  round: 1,
  currentEnemy: null,
  autoAttack: false,
  lastCombatResult: null,
  combatLog: [],
  turnCounter: 0,
  playerInitiative: 0,
  enemyInitiative: 0,
  activeEffects: {
    player: [],
    enemy: []
  }
};

export default CombatInitialState;
