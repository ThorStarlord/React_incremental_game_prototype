/**
 * @fileoverview Defines the initial state for the skills system in the incremental RPG game.
 * This includes skill definitions, categories, and player progression.
 */

/**
 * Interface for skill requirements
 */
export interface SkillRequirement {
  /** Type of requirement (level, quest, item, etc.) */
  type: string;
  /** Value needed to meet the requirement */
  value: any;
  /** Human-readable description of the requirement */
  description?: string;
}

/**
 * Interface for skill effects - what a skill does when used or passive effect
 */
export interface SkillEffect {
  /** Type of effect (damage, heal, buff, etc.) */
  type: string;
  /** Target of the effect (self, enemy, allies, etc.) */
  target: string;
  /** Value or magnitude of the effect */
  value: number;
  /** Duration of effect if applicable (in seconds/turns) */
  duration?: number;
  /** Scaling factor for the effect based on attributes */
  scaling?: {
    /** Attribute that affects scaling */
    attribute: string;
    /** Scaling factor */
    factor: number;
  }[];
}

/**
 * Interface for individual skills
 */
export interface Skill {
  /** Unique identifier for the skill */
  id: string;
  /** Display name of the skill */
  name: string;
  /** Detailed description of what the skill does */
  description: string;
  /** Skill category/type (combat, crafting, gathering, etc.) */
  category: string;
  /** Skill level (1-based) */
  level: number;
  /** Maximum level the skill can reach */
  maxLevel: number;
  /** Energy cost to use the skill */
  energyCost: number;
  /** Cooldown time in seconds */
  cooldown: number;
  /** Whether this is a passive skill that's always active */
  isPassive: boolean;
  /** Requirements to unlock/learn this skill */
  requirements: SkillRequirement[];
  /** Effects this skill produces when used */
  effects: SkillEffect[];
  /** Path to icon image */
  icon?: string;
  /** Experience points towards next skill level */
  experience?: number;
  /** Experience needed for next level */
  experienceToNextLevel?: number;
}

/**
 * Interface for player's skill progression data
 */
export interface SkillProgression {
  /** Current experience points in the skill */
  experience: number;
  /** Current skill level */
  level: number;
  /** Date when the skill was learned */
  learnedAt: Date;
  /** Date of last level up */
  lastLevelUp?: Date;
  /** Number of times the skill has been used */
  timesUsed: number;
}

/**
 * Interface for the skills state
 */
export interface SkillsState {
  /** Available skills that can be learned */
  availableSkills: {
    [skillId: string]: Skill;
  };
  /** Skills the player has learned and can use */
  learnedSkills: {
    [skillId: string]: SkillProgression;
  };
  /** Skills currently equipped/active (for skills with limited slots) */
  equippedSkills: string[];
  /** Maximum number of skills that can be equipped at once */
  maxEquippedSkills: number;
  /** Skill points available to spend on new skills */
  availableSkillPoints: number;
}

/**
 * Initial state for the skills system
 */
const InitialState: SkillsState = {
  availableSkills: {
    'fireball': {
      id: 'fireball',
      name: 'Fireball',
      description: 'Launches a ball of fire at a target, dealing fire damage.',
      category: 'combat',
      level: 1,
      maxLevel: 5,
      energyCost: 15,
      cooldown: 5,
      isPassive: false,
      requirements: [
        {
          type: 'level',
          value: 3,
          description: 'Player level 3 required'
        }
      ],
      effects: [
        {
          type: 'damage',
          target: 'enemy',
          value: 20,
          scaling: [
            {
              attribute: 'intelligence',
              factor: 0.5
            }
          ]
        }
      ],
      icon: 'fireball.png'
    },
    'healing_touch': {
      id: 'healing_touch',
      name: 'Healing Touch',
      description: 'Restores health to the target.',
      category: 'support',
      level: 1,
      maxLevel: 5,
      energyCost: 20,
      cooldown: 10,
      isPassive: false,
      requirements: [
        {
          type: 'level',
          value: 2,
          description: 'Player level 2 required'
        }
      ],
      effects: [
        {
          type: 'heal',
          target: 'self',
          value: 30,
          scaling: [
            {
              attribute: 'wisdom',
              factor: 0.7
            }
          ]
        }
      ],
      icon: 'healing_touch.png'
    },
    'miners_strength': {
      id: 'miners_strength',
      name: 'Miner\'s Strength',
      description: 'Increases mining efficiency and chance to find rare materials.',
      category: 'gathering',
      level: 1,
      maxLevel: 3,
      energyCost: 0,
      cooldown: 0,
      isPassive: true,
      requirements: [],
      effects: [
        {
          type: 'mining_efficiency',
          target: 'self',
          value: 15
        },
        {
          type: 'rare_find_chance',
          target: 'self',
          value: 5
        }
      ],
      icon: 'miners_strength.png'
    },
    'gossip_network': {
      id: 'gossip_network',
      name: 'Gossip Network',
      description: 'Gain additional information from NPCs and occasionally receive rumors about hidden treasures.',
      category: 'social',
      level: 1,
      maxLevel: 2,
      energyCost: 0,
      cooldown: 0,
      isPassive: true,
      requirements: [],
      effects: [
        {
          type: 'npc_info',
          target: 'self',
          value: 1
        },
        {
          type: 'treasure_rumor_chance',
          target: 'self',
          value: 10
        }
      ],
      icon: 'gossip_network.png'
    }
  },
  learnedSkills: {},
  equippedSkills: [],
  maxEquippedSkills: 4,
  availableSkillPoints: 0
};

export default InitialState;
