import { Enemy as SimpleEnemy } from '../../types/enemyTypes';
import { Enemy as CompleteEnemy } from '../../../context/types/gameStates/CombatGameStateTypes';

/**
 * Adapts a simple enemy object to the full enemy interface expected by the Battle component
 * 
 * @param enemy The simple enemy object
 * @returns A complete enemy object with all required properties
 */
export function adaptEnemy(enemy: SimpleEnemy): CompleteEnemy {
  return {
    ...enemy,
    // Add missing required properties with default values
    type: 'enemy', // Fixed: Always set type to 'enemy' as required by CompleteEnemy
    enemyType: enemy.enemyType || 'monster',
    lootTable: enemy.lootTable || [],
    abilities: enemy.abilities || [],
    stats: enemy.stats || {},
    defense: enemy.defense || 0,
    attack: enemy.attack || 0,
    speed: enemy.speed || 1,
    attackRate: enemy.attackRate || 1,
    criticalChance: enemy.criticalChance || 0.05,
    criticalMultiplier: enemy.criticalMultiplier || 1.5,
    drops: enemy.drops || [],
    essenceValue: enemy.essenceValue || 0,
    experienceValue: enemy.experienceValue || 0,
    goldValue: enemy.goldValue || 0,
    // Make sure health is provided (required by SimpleEnemy)
    health: enemy.health || enemy.currentHealth || enemy.maxHealth || 100,
    // Add any other required properties
    currentHealth: enemy.currentHealth || enemy.health || enemy.maxHealth || 100,
    maxHealth: enemy.maxHealth || enemy.health || 100
  };
}
