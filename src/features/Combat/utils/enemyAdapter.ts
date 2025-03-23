import { DamageType } from '../../../context/types/combat/basic';
import { Enemy as CompleteEnemy } from '../../../context/types/gameStates/CombatGameStateTypes';
import { Effect } from '../../../context/types/combat';
import { 
  EnemyBase, 
  CombatEnemy, 
  DungeonEnemy, 
  Ability, 
  LootDrop 
} from '../../../context/types/combat/EnemyTypes';

// Map of enemy traits to resistances
const TRAIT_RESISTANCE_MAP: Record<string, Partial<Record<DamageType, number>>> = {
  'fireResistant': { fire: 0.5 },
  'freezeResistant': { ice: 0.5 },
  'poisonResistant': { poison: 0.5 },
  'armored': { physical: 0.3 },
  'magical': { magical: 0.2 },
};

/**
 * Enum of enemy types for better type safety
 */
export enum EnemyType {
  DUNGEON = 'dungeon',
  SIMPLE = 'simple',
  UNKNOWN = 'unknown'
}

/**
 * Main adapter function that detects enemy type and routes to the appropriate adapter
 * 
 * @param enemy Any enemy object with appropriate properties
 * @returns A combat-ready enemy object
 */
export function adaptToCombatEnemy(enemy: Record<string, any>): CombatEnemy {
  // Guard against null or non-object inputs
  if (!enemy || typeof enemy !== 'object') {
    throw new Error('Invalid enemy object provided to adaptToCombatEnemy');
  }
  
  // Detect enemy type and route to appropriate adapter
  const enemyType = detectEnemyType(enemy);
  
  switch (enemyType) {
    case EnemyType.DUNGEON:
      return adaptDungeonTypeEnemy(enemy as DungeonEnemy);
    case EnemyType.SIMPLE:
      return adaptSimpleEnemy(enemy as EnemyBase) as CombatEnemy;
    default:
      // Create a minimal valid enemy from the input
      return createMinimalEnemy(enemy as EnemyBase);
  }
}

/**
 * Create a minimal valid enemy from base properties
 */
function createMinimalEnemy(baseEnemy: EnemyBase): CombatEnemy {
  return {
    id: baseEnemy.id,
    name: baseEnemy.name,
    level: baseEnemy.level || 1,
    maxHealth: baseEnemy.maxHealth || baseEnemy.currentHealth || 100,
    currentHealth: baseEnemy.currentHealth || baseEnemy.maxHealth || 100,
    type: 'enemy',
    enemyType: 'unknown',
    attack: baseEnemy.attack,
    defense: baseEnemy.defense,
    speed: 5,
    critChance: 0.05,
    critMultiplier: 1.5,
    lootTable: [],
    abilities: [],
    experienceValue: 10,
    goldValue: 5,
    essenceValue: 1,
    statusEffects: [],
    skills: [],
    dodgeChance: 0.05,
    resistances: {} as Record<DamageType, number>,
    immunities: [],
    weaknesses: [],
    baseHealth: baseEnemy.maxHealth || 100,
    baseAttack: baseEnemy.attack,
    baseDefense: baseEnemy.defense
  };
}

/**
 * Adapts a dungeon-type enemy to the combat system's enemy format
 */
function adaptDungeonTypeEnemy(enemy: DungeonEnemy): CombatEnemy {
  const traits = enemy.traits || [];
  const resistances = createResistancesFromTraits(traits);
  const lootItems = transformToLootItems(createTraitDrops(traits));

  return {
    id: enemy.id,
    name: enemy.name,
    level: enemy.level || 1,
    maxHealth: enemy.maxHealth,
    currentHealth: enemy.currentHealth,
    type: 'enemy',
    enemyType: 'monster',
    attack: enemy.attack,
    defense: enemy.defense,
    speed: 5, 
    critChance: 0.05,
    critMultiplier: 1.5,
    lootTable: lootItems,
    abilities: [],
    experienceValue: enemy.experienceValue || 10,
    goldValue: enemy.goldValue || 5,
    essenceValue: enemy.essenceValue || 1,
    statusEffects: [],
    skills: [],
    dodgeChance: 0.05,
    resistances,
    immunities: [],
    weaknesses: [],
    baseHealth: enemy.maxHealth,
    baseAttack: enemy.attack,
    baseDefense: enemy.defense,
    imageUrl: enemy.portrait ? `/assets/enemies/${enemy.portrait}.png` : undefined
  };
}

/**
 * Adapts a simple enemy to the complete combat state format
 */
export function adaptSimpleEnemy(enemy: EnemyBase): CompleteEnemy {
  // Apply defaults for required properties
  const baseEnemy = {
    ...enemy,
    maxHealth: enemy.maxHealth || 100,
    currentHealth: enemy.currentHealth || enemy.maxHealth || 100
  };
  
  // Extract or generate default abilities and loot if they exist
  const lootTable = 'lootTable' in baseEnemy ? baseEnemy.lootTable as any[] : [];
  const abilities = 'abilities' in baseEnemy ? baseEnemy.abilities as any[] : [];
  
  const lootItems = Array.isArray(lootTable) ? 
    transformToLootItems(lootTable) : [];
  
  const abilityItems = Array.isArray(abilities) ? 
    transformToAbilities(abilities) : [];

  return {
    ...baseEnemy,
    type: 'enemy',
    enemyType: (baseEnemy as any).enemyType || 'monster',
    lootTable: lootItems,
    abilities: abilityItems,
    defense: baseEnemy.defense || 0,
    attack: baseEnemy.attack || 0,
    speed: (baseEnemy as any).speed || 1,
    critChance: (baseEnemy as any).critChance || (baseEnemy as any).criticalChance || 0.05,
    critMultiplier: (baseEnemy as any).critMultiplier || (baseEnemy as any).criticalDamage || 1.5,
    essenceValue: (baseEnemy as any).essenceValue || 0,
    experienceValue: (baseEnemy as any).experienceValue || 10,
    goldValue: (baseEnemy as any).goldValue || 5,
    health: baseEnemy.currentHealth,
    experience: (baseEnemy as any).experienceValue || 10,
    gold: (baseEnemy as any).goldValue || 5
  };
}

/**
 * Detects enemy type based on its properties
 */
function detectEnemyType(enemy: Record<string, any>): EnemyType {
  // Check for dungeon-type enemy (has traits array)
  if (enemy.traits && Array.isArray(enemy.traits)) {
    return EnemyType.DUNGEON;
  } 
  
  // Check for simple enemy type (has basic required properties)
  if (enemy.id && enemy.name && 
      (enemy.maxHealth !== undefined || enemy.currentHealth !== undefined)) {
    return EnemyType.SIMPLE;
  }
  
  return EnemyType.UNKNOWN;
}

// Helper functions

/**
 * Calculate consistent health values based on available data
 */
function normalizeHealthValues(enemy: Record<string, any>): { maxHealth: number, currentHealth: number } {
  const maxHealth = enemy.maxHealth || enemy.health || 100;
  const currentHealth = enemy.currentHealth || enemy.health || maxHealth;
  return { maxHealth, currentHealth };
}

/**
 * Creates drops from enemy traits
 */
function createTraitDrops(traits: string[]): LootDrop[] {
  return traits.map(trait => ({
    id: `${trait}-essence`,
    name: `${trait.charAt(0).toUpperCase() + trait.slice(1)} Essence`,
    quantity: 1,
    dropChance: 0.3
  }));
}

/**
 * Creates a resistance record based on enemy traits
 */
function createResistancesFromTraits(traits: string[]): Record<DamageType, number> {
  const resistances: Partial<Record<DamageType, number>> = {};
  
  traits.forEach(trait => {
    if (TRAIT_RESISTANCE_MAP[trait]) {
      Object.entries(TRAIT_RESISTANCE_MAP[trait]).forEach(([damageType, value]) => {
        const damageTypeKey = damageType as DamageType;
        resistances[damageTypeKey] = Math.max(
          resistances[damageTypeKey] || 0,
          value
        );
      });
    }
  });
  
  return resistances as Record<DamageType, number>;
}

/**
 * Transforms LootDrop[] to LootItem[]
 */
function transformToLootItems(drops: LootDrop[] = []): any[] {
  return drops.map(drop => ({
    id: drop.id,
    name: drop.name,
    quantity: drop.quantity,
    dropChance: drop.dropChance || 0.1,
    quality: drop.quality || 'common',
    type: drop.type || 'material',
    value: drop.value || 1
  }));
}

/**
 * Transforms any ability array to Ability[]
 */
function transformToAbilities(abilities: any[] = []): Ability[] {
  return abilities.map(ability => ({
    id: ability.id || 'unknown-ability',
    name: ability.name || 'Unknown Ability',
    description: ability.description || '',
    cooldown: ability.cooldown || 0,
    effect: ability.effect || {
      id: `${ability.id || 'unknown'}_effect`,
      name: `${ability.name || 'Unknown'} Effect`,
      type: 'damage',
      value: ability.damageMultiplier || 1.0,
      duration: 1,
      strength: ability.damageMultiplier || 1.0
    },
    isAoE: ability.isAoE || false,
    manaCost: ability.manaCost || 0,
    level: ability.level || 1
  }));
}

/**
 * @deprecated Use adaptToCombatEnemy instead
 */
export function adaptEnemy(enemy: unknown): CombatEnemy | CompleteEnemy {
  console.warn('adaptEnemy is deprecated, use adaptToCombatEnemy instead');
  return adaptToCombatEnemy(enemy as Record<string, any>);
}
