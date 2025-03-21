import { useCallback, useState } from 'react';
import AREA_ENEMIES, { COMMON_LOOT, SPECIFIC_LOOT, COMBAT_CONSTANTS } from '../data/enemyData';
import { Enemy, LootItem, EnemyTemplate } from '../types/combatTypes';

/**
 * Hook for managing combat encounters
 */
export const useCombatEncounters = (
  player: { level: number },
  areaId: string,
  difficulty: number,
  isRandomEncounter: boolean
) => {
  // State for encounters
  const [loading, setLoading] = useState<boolean>(true);
  const [encounters, setEncounters] = useState<Enemy[]>([]);
  const [currentEncounter, setCurrentEncounter] = useState<number>(0);

  /**
   * Generate loot items for an enemy
   * @param enemyId - Enemy ID to generate loot for
   * @returns Array of loot items
   */
  const generateLoot = useCallback((enemyId: string): LootItem[] => {
    const specificEnemyLoot = SPECIFIC_LOOT[enemyId as keyof typeof SPECIFIC_LOOT] || [];
    return [...COMMON_LOOT, ...specificEnemyLoot];
  }, []);

  /**
   * Generate enemy encounters for the current area
   */
  const generateEncounters = useCallback(() => {
    setLoading(true);

    try {
      // Get enemy templates for this area or fall back to forest
      const enemiesForArea = AREA_ENEMIES[areaId] || AREA_ENEMIES.forest;
      
      if (!enemiesForArea) {
        console.error(`No enemy templates found for area: ${areaId}`);
        throw new Error(`Invalid area ID: ${areaId}`);
      }
      
      // Calculate number of encounters based on encounter type
      const numEncounters = isRandomEncounter 
        ? COMBAT_CONSTANTS.RANDOM_ENCOUNTER_COUNT
        : COMBAT_CONSTANTS.MIN_NORMAL_ENCOUNTERS + Math.floor(Math.random() * COMBAT_CONSTANTS.MAX_ADDITIONAL_ENCOUNTERS);
      
      const newEncounters: Enemy[] = [];
      
      for (let i = 0; i < numEncounters; i++) {
        // Pick a random enemy type for this area
        const randomIndex = Math.floor(Math.random() * enemiesForArea.length);
        const enemyTemplate = enemiesForArea[randomIndex];
        
        // Calculate level based on player's level with slight variation
        const enemyLevel = Math.max(1, player.level - 1 + Math.floor(Math.random() * 3));
        
        // Scale enemy stats based on level and difficulty
        const levelMultiplier = 1 + (enemyLevel - 1) * COMBAT_CONSTANTS.XP_SCALING_FACTOR;
        const difficultyMultiplier = difficulty;
        
        // Create enemy instance with scaled stats
        const enemy: Enemy = createEnemyFromTemplate(enemyTemplate, enemyLevel, levelMultiplier, difficultyMultiplier);
        
        newEncounters.push(enemy);
      }
      
      setEncounters(newEncounters);
      setCurrentEncounter(0);
      setLoading(false);
      
      return newEncounters;
    } catch (error) {
      console.error('Error generating encounters:', error);
      setLoading(false);
      return [];
    }
  }, [areaId, difficulty, player.level, isRandomEncounter, generateLoot]);

  /**
   * Create an enemy instance from a template with appropriate scaling
   */
  const createEnemyFromTemplate = useCallback((
    template: EnemyTemplate,
    level: number,
    levelMultiplier: number,
    difficultyMultiplier: number
  ): Enemy => {
    return {
      id: template.id,
      name: template.name,
      level: level,
      currentHealth: Math.floor(template.baseHealth * levelMultiplier * difficultyMultiplier),
      maxHealth: Math.floor(template.baseHealth * levelMultiplier * difficultyMultiplier),
      attack: Math.floor(template.baseAttack * levelMultiplier * difficultyMultiplier),
      defense: Math.floor(template.baseDefense * levelMultiplier * difficultyMultiplier),
      speed: Math.floor(COMBAT_CONSTANTS.MIN_ENEMY_SPEED + Math.random() * 
        (COMBAT_CONSTANTS.MAX_ENEMY_SPEED - COMBAT_CONSTANTS.MIN_ENEMY_SPEED)),
      experience: Math.floor(template.baseExperience * levelMultiplier * difficultyMultiplier),
      gold: Math.floor(template.baseGold * levelMultiplier * difficultyMultiplier),
      imageUrl: `/assets/enemies/${template.id}.png`,
      loot: generateLoot(template.id)
    };
  }, [generateLoot]);

  /**
   * Advance to the next encounter
   */
  const advanceToNextEncounter = useCallback(() => {
    if (currentEncounter < encounters.length - 1) {
      setCurrentEncounter(prev => prev + 1);
      return true;
    }
    return false;
  }, [encounters.length, currentEncounter]);

  /**
   * Reset encounters for a new combat
   */
  const resetEncounters = useCallback(() => {
    setEncounters([]);
    setCurrentEncounter(0);
    setLoading(true);
  }, []);

  return {
    loading,
    encounters,
    currentEncounter,
    currentEnemy: encounters[currentEncounter],
    totalEncounters: encounters.length,
    hasMoreEncounters: currentEncounter < encounters.length - 1,
    generateEncounters,
    advanceToNextEncounter,
    resetEncounters
  };
};
