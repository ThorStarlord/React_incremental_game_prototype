import { useMemo } from 'react';
import { useGameState, useGameDispatch } from '../../context/GameContext';

/**
 * Interface for NPC object
 */
interface NPC {
  id: string;
  relationship?: number;
  [key: string]: any; // Additional NPC properties
}

/**
 * Interface for relationship level object
 */
interface RelationshipLevel {
  name: string;
  color: string;
  tier: number;
}

/**
 * Interface for hook return value
 */
interface UseNPCRelationsReturn {
  npc: NPC | null;
  relationshipLevel: RelationshipLevel | null;
  updateRelationship: (amount: number) => void;
}

// Define interface for dialogue options
interface DialogueOption {
  id: string;
  text: string;
  outcome?: string;
  nextId?: string;
  requires?: {
    relationship?: number;
    playerLevel?: number;
    questCompleted?: string;
    trait?: string;
    [key: string]: any;
  };
  effects?: {
    relationshipChange?: number;
    giveQuest?: string;
    giveItem?: string;
    [key: string]: any;
  };
}

/**
 * Hook to manage NPC relationship data and interactions
 * 
 * @param npcId - The ID of the NPC to manage relationship with
 * @returns Object containing NPC data, relationship level and update function
 */
const useNPCRelations = (npcId: string): UseNPCRelationsReturn => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();

  // Use type assertion to access npcs property that might not be in EnhancedGameState interface
  const npcs: NPC[] = (gameState as any).npcs || [];

  const npc = useMemo(() => {
    // Explicitly return null instead of undefined when no NPC is found
    if (!Array.isArray(npcs)) return null;
    const foundNpc = npcs.find(n => n && n.id === npcId);
    return foundNpc || null; // Ensure we return null when no NPC is found
  }, [npcs, npcId]);

  const relationshipLevel = useMemo((): RelationshipLevel | null => {
    if (!npc) return null;
    const value = npc.relationship || 0;
    
    if (value >= 80) return { name: 'Devoted', color: '#9C27B0', tier: 5 };
    if (value >= 60) return { name: 'Trusted', color: '#4CAF50', tier: 4 };
    if (value >= 40) return { name: 'Friendly', color: '#2196F3', tier: 3 };
    if (value >= 20) return { name: 'Warm', color: '#8BC34A', tier: 2 };
    // Add default return for values below 20
    return { name: 'Neutral', color: '#9E9E9E', tier: 1 };
  }, [npc]);

  // Update NPC relationship with specified amount
  const updateRelationship = (amount: number): void => {
    if (!npcId) return;
    
    dispatch({
      type: 'UPDATE_NPC_RELATIONSHIP',
      payload: {
        npcId,
        changeAmount: amount
      }
    });
  };

  // Return useful values from the hook
  return {
    npc,
    relationshipLevel,
    updateRelationship
  };
};

const getAvailableOptions = (options: DialogueOption[], relationshipValue: number): DialogueOption[] => {
  return options.filter((option: DialogueOption) => {
    if (!option.requires) return true;
    
    // For now just check relationship requirements
    if (option.requires.relationship && relationshipValue < option.requires.relationship) {
      return false;
    }
    
    return true;
  });
};

export default useNPCRelations;
