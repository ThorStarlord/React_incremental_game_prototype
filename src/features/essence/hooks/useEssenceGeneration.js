import { useContext, useMemo, useEffect, useCallback } from 'react';
import { useGameState, useGameDispatch, ACTION_TYPES } from '../../../context/index';

/**
 * @function useEssenceGeneration
 * @description Custom hook that calculates and manages essence generation from various sources.
 * This hook determines the total generation rate and provides detailed information about
 * each contributing source.
 * 
 * @returns {Object} Object containing:
 *   - totalRate: The sum of all essence generation rates
 *   - npcContributions: Array of objects with information about each contributing source
 *   - baseRate: Base rate of essence generation (without modifiers)
 *   - modifiers: Applied modifiers to essence generation
 */
const useEssenceGeneration = () => {
  // Access the game state through context
  const { npcs, research, playerStats, buildings } = useGameState();
  
  // Calculate all essence generation data with memoization for performance
  const essenceGenerationData = useMemo(() => {
    // Initialize data structure
    let baseRate = 0;
    const npcContributions = [];
    const modifiers = {
      global: 1.0, // Global multiplier
      research: 1.0, // Research-based multipliers
      buildings: 1.0, // Building-based multipliers
      skills: 1.0, // Player skills multipliers
    };
    
    // Calculate NPC contributions
    if (npcs) {
      npcs.forEach(npc => {
        // Skip NPCs that don't generate essence
        if (!npc.essenceGeneration || npc.essenceGeneration <= 0) return;
        
        // Calculate the actual contribution based on NPC level and stats
        const baseContribution = npc.essenceGeneration * (1 + (npc.level * 0.1));
        
        // Add this NPC's contribution to the list
        npcContributions.push({
          id: npc.id,
          name: npc.name,
          rate: baseContribution,
          level: npc.level,
        });
        
        // Add to base rate
        baseRate += baseContribution;
      });
    }
    
    // Apply research modifiers if any
    if (research) {
      // Example: Research that improves essence generation
      const essenceResearch = research.filter(r => 
        r.active && r.effects && r.effects.essenceGenerationMultiplier
      );
      
      if (essenceResearch.length > 0) {
        const researchMultiplier = essenceResearch.reduce(
          (total, research) => total + (research.effects.essenceGenerationMultiplier || 0), 
          1
        );
        modifiers.research = researchMultiplier;
      }
    }
    
    // Apply building modifiers
    if (buildings) {
      // Example: Buildings that improve essence generation
      const essenceBuildings = buildings.filter(b => 
        b.built && b.effects && b.effects.essenceGenerationMultiplier
      );
      
      if (essenceBuildings.length > 0) {
        const buildingMultiplier = essenceBuildings.reduce(
          (total, building) => total + (building.effects.essenceGenerationMultiplier || 0), 
          1
        );
        modifiers.buildings = buildingMultiplier;
      }
    }
    
    // Apply player skill modifiers
    if (playerStats && playerStats.skills) {
      // Example: Skills that improve essence generation
      const essenceSkills = playerStats.skills.filter(s => 
        s.level > 0 && s.effects && s.effects.essenceGenerationMultiplier
      );
      
      if (essenceSkills.length > 0) {
        const skillsMultiplier = essenceSkills.reduce(
          (total, skill) => total + (skill.level * (skill.effects.essenceGenerationMultiplier || 0)), 
          1
        );
        modifiers.skills = skillsMultiplier;
      }
    }
    
    // Calculate the global modifier (product of all modifiers)
    modifiers.global = modifiers.research * modifiers.buildings * modifiers.skills;
    
    // Calculate the final total rate
    const totalRate = baseRate * modifiers.global;
    
    // Apply the global modifier to each NPC contribution
    const modifiedContributions = npcContributions.map(contribution => ({
      ...contribution,
      rate: contribution.rate * modifiers.global,
    }));
    
    return {
      baseRate,
      totalRate,
      npcContributions: modifiedContributions,
      modifiers,
    };
  }, [npcs, research, playerStats, buildings]);
  
  return essenceGenerationData;
};

export default useEssenceGeneration;