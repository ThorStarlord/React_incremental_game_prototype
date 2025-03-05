export interface CombatLogEntry {
  timestamp: string;
  message: string;
  type: string;
  importance: 'normal' | 'high';
}

export interface CombatActor {
  currentHealth: number;
  maxHealth: number;
  currentMana: number;
  maxMana: number;
  attack: number;
  defense: number;
}

export interface CombatEnemy extends CombatActor {
  name: string;
  level: number;
  imageUrl: string;
  experience: number;
  gold: number;
}

export interface CombatRewards {
  experience: number;
  gold: number;
  items: any[]; // Replace with proper item type
}

export interface CombatState {
  active: boolean;
  playerTurn: boolean;
  round: number;
  player: CombatActor;
  enemy: CombatEnemy;
  rewards: CombatRewards;
  log: CombatLogEntry[];
}

const combatInitialState: CombatState = {
  active: false,
  playerTurn: true,
  round: 1,
  player: {
    currentHealth: 100,
    maxHealth: 100,
    currentMana: 50,
    maxMana: 50,
    attack: 10,
    defense: 5
  },
  enemy: {
    name: 'Enemy',
    level: 1,
    currentHealth: 50,
    maxHealth: 50,
    currentMana: 30,
    maxMana: 30,
    attack: 8,
    defense: 3,
    imageUrl: '/assets/enemies/default.png',
    experience: 10,
    gold: 5
  },
  rewards: {
    experience: 0,
    gold: 0,
    items: []
  },
  log: []
};

export default combatInitialState;
