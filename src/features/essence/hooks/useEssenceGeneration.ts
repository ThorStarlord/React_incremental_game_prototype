import { useMemo } from 'react';
import { useGameState } from '../../../context/GameStateExports';

/**
 * Interface for an NPC object
 */
interface NPC {
  id: string;
  name: string;
  essenceGeneration?: number;
  level: number;
  [key: string]: any; // Allow additional NPC properties
}

/**
 * Interface for a research object
 */
interface Research {
  active: boolean;
  effects?: {
    essenceGenerationMultiplier?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Interface for a building object
 */
interface Building {
  built: boolean;
  effects?: {
    essenceGenerationMultiplier?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Interface for player skills
 */
interface Skill {
  level: number;
  effects?: {
    essenceGenerationMultiplier?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Interface for player stats
 */
interface PlayerStats {
  skills: Skill[]; // Changed from optional to required property
  health?: number;
  maxHealth?: number;
  mana?: number;
  maxMana?: number;
  [key: string]: any;
}

/**
 * Interface for NPC contribution to essence generation
 */
interface NPCContribution {
  id: string;
  name: string;
  rate: number;
  level: number;
}

/**
 * Interface for generation modifiers
 */
interface GenerationModifiers {
  global: number;
  research: number;
  buildings: number;
  skills: number;
}

/**
 * Interface for essence generation data returned by hook
 */
interface EssenceGenerationData {
  baseRate: number;
  totalRate: number;
  npcContributions: NPCContribution[];
  modifiers: GenerationModifiers;
}

/**
 * Interface for a settlement object with buildings
 */
interface Settlement {
  id: string;
  name?: string;
  buildings?: Building[];
  [key: string]: any;
}

/**
 * Type guard to check if an object is a valid Settlement
 */
function isSettlement(obj: any): obj is Settlement {
  return obj && typeof obj === 'object' && 'buildings' in obj && Array.isArray(obj.buildings);
}

/**
 * @function useEssenceGeneration
 * @description Custom hook that calculates and manages essence generation from various sources.
 * This hook determines the total generation rate and provides detailed information about
 * each contributing source.
 * 
 * @returns {EssenceGenerationData} Object containing:
 *   - totalRate: The sum of all essence generation rates
 *   - npcContributions: Array of objects with information about each contributing source
 *   - baseRate: Base rate of essence generation (without modifiers)
 *   - modifiers: Applied modifiers to essence generation
 */
const useEssenceGeneration = (): EssenceGenerationData => {
  // Access the game state through context with proper property paths
  const gameState = useGameState();
  
  // Access NPCs with proper property path and safe fallback
  const npcs = gameState.world?.npcs || [];
  
  // Access buildings with safer property access methods
  const buildings = (() => {
    // Check for buildings in different possible locations
    if (gameState.world && 'buildings' in gameState.world) {
      return (gameState.world as any).buildings || [];
    }
    
    // Check for buildings in settlements - with proper type handling
    const worldState = gameState.world as any;
    if (worldState && typeof worldState === 'object') {
      // Check if settlements property exists
      if ('settlements' in worldState && worldState.settlements) {
        // Type-safe approach to get buildings from settlements
        try {
          // Convert settlements object to array and extract buildings with proper typing
          return Object.values(worldState.settlements)
            // Use type guard to ensure we're working with valid settlement objects
            .filter(isSettlement)
            // Now TypeScript knows these are valid Settlement objects with buildings array
            .flatMap(settlement => settlement.buildings || []);
        } catch (error) {
          console.error('Error accessing buildings from settlements:', error);
          return [];
        }
      }
    }
    
    // Check for buildings in regions
    if (gameState.world?.regions) {
      // Try to collect buildings from all regions
      const buildingsFromRegions: Building[] = [];
      
      Object.values(gameState.world.regions).forEach(region => {
        if (region && typeof region === 'object' && 'buildings' in region) {
          const regionBuildings = (region as any).buildings;
          if (Array.isArray(regionBuildings)) {
            buildingsFromRegions.push(...regionBuildings);
          }
        }
      });
      
      if (buildingsFromRegions.length > 0) {
        return buildingsFromRegions;
      }
    }
    
    // Check for buildings in player property
    if (gameState.player && 'buildings' in gameState.player) {
      return (gameState.player as any).buildings || [];
    }
    
    // Default to empty array if buildings are not found
    return [];
  })();
  
  // Fix: Get research data using the correct path with proper type safety
  const research = (() => {
    // Use different approaches to find research data with proper type assertions
    
    // Try direct research access
    if ('research' in gameState && Array.isArray((gameState as any).research)) {
      return (gameState as any).research;
    }
    
    // Try player research with proper type assertion
    const player = gameState.player as any;
    if (player && 'research' in player && Array.isArray(player.research)) {
      return player.research;
    }
    
    // Try progression research
    const progression = gameState.progression as any;
    if (progression && 'research' in progression && Array.isArray(progression.research)) {
      return progression.research;
    }
    
    // Check traits for research-related ones
    if (gameState.traits?.copyableTraits) {
      const traits = gameState.traits.copyableTraits;
      const researchTraits = Object.values(traits)
        .filter(trait => 
          // Fix: Use correct trait category check with proper type handling
          trait.category === 'magic' || // Magic traits often affect essence
          trait.category === 'special' || // Special traits may affect essence
          (trait.effects && 
           typeof trait.effects === 'object' && 
           'essenceGenerationMultiplier' in trait.effects)
        );
      
      if (researchTraits.length > 0) {
        return researchTraits;
      }
    }
    
    // Default to empty array
    return [];
  })();
  
  // Use a safe type assertion to handle potentially missing skills property
  const playerStats = gameState.player?.stats || {};
  // Get skills safely with runtime checking
  const playerSkills = Array.isArray((playerStats as any).skills) 
    ? (playerStats as any).skills 
    : [];
  
  // Calculate all essence generation data with memoization for performance
  const essenceGenerationData = useMemo<EssenceGenerationData>(() => {
    // Initialize data structure
    let baseRate = 0;
    const npcContributions: NPCContribution[] = [];
    const modifiers: GenerationModifiers = {
      global: 1.0, // Global multiplier
      research: 1.0, // Research-based multipliers
      buildings: 1.0, // Building-based multipliers
      skills: 1.0, // Player skills multipliers
    };
    
    // Calculate NPC contributions
    if (Array.isArray(npcs)) {
      npcs.forEach((npc: NPC) => {
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
    if (Array.isArray(research)) {
      // Example: Research that improves essence generation
      const essenceResearch = research.filter((r: Research) => 
        r.active && r.effects && r.effects.essenceGenerationMultiplier
      );
      
      if (essenceResearch.length > 0) {
        const researchMultiplier = essenceResearch.reduce(
          (total: number, research: Research) => 
            total + (research.effects?.essenceGenerationMultiplier || 0), 
          1
        );
        modifiers.research = researchMultiplier;
      }
    }
    
    // Apply building modifiers with type safety
    if (Array.isArray(buildings) && buildings.length > 0) {
      // Example: Buildings that improve essence generation
      const essenceBuildings = buildings.filter((b: Building) => 
        b && b.built && b.effects && b.effects.essenceGenerationMultiplier
      );
      
      if (essenceBuildings.length > 0) {
        const buildingMultiplier = essenceBuildings.reduce(
          (total: number, building: Building) => 
            total + (building.effects?.essenceGenerationMultiplier || 0), 
          1
        );
        modifiers.buildings = buildingMultiplier;
      }
    }
    
    // Apply player skill modifiers with type safety for skills
    if (playerSkills.length > 0) {
      // Example: Skills that improve essence generation
      const essenceSkills = playerSkills.filter((s: Skill) => 
        s.level > 0 && s.effects && s.effects.essenceGenerationMultiplier
      );
      
      if (essenceSkills.length > 0) {
        const skillsMultiplier = essenceSkills.reduce(
          (total: number, skill: Skill) => 
            total + (skill.level * (skill.effects?.essenceGenerationMultiplier || 0)), 
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
  }, [npcs, research, playerStats, buildings, playerSkills]);
  
  return essenceGenerationData;
};

export default useEssenceGeneration;
