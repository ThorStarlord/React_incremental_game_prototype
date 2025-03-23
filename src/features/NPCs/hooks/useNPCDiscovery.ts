import { useState, useEffect } from 'react';
import { ACTION_TYPES } from '../../../context/actions/actionTypes';

/**
 * Interface for dialogue option
 */
interface DialogueOption {
  /** Displayed text for this option */
  text: string;
  /** Action to take when selecting this option */
  action?: string;
  /** Additional data related to this option */
  data?: any;
  /** Next dialogue to show when this option is selected */
  next?: string;
  /** ID of trait associated with this option */
  traitId?: string;
  /** Essence cost associated with this option */
  essenceCost?: number;
  /** Relationship requirement for this option */
  relationshipRequirement?: number;
  // Allow any additional properties
  [key: string]: any;
}

/**
 * Interface for a dialogue entry
 */
interface Dialogue {
  /** Main text content of this dialogue */
  text: string;
  /** List of dialogue options to present to the player */
  options: DialogueOption[];
  /** Any additional metadata for this dialogue */
  [key: string]: any;
}

/**
 * Interface for an NPC's dialogue collection
 */
interface NPCDialogue {
  /** Dialogue shown when meeting an NPC for the first time */
  firstMeeting?: Dialogue;
  /** Standard initial greeting dialogue */
  initial: Dialogue;
  /** Additional dialogue entries keyed by ID */
  [key: string]: Dialogue | undefined;
}

/**
 * Interface for an NPC
 */
interface NPC {
  /** NPC's name */
  name?: string;
  /** Standard greeting text */
  greeting?: string;
  /** Collection of dialogues for this NPC */
  dialogue?: NPCDialogue;
}

/**
 * Interface for player state
 */
interface Player {
  /** List of NPC IDs the player has discovered */
  discoveredNPCs?: string[];
}

/**
 * Interface for action dispatch
 */
interface Dispatch {
  (action: { type: string; payload: any }): void;
}

/**
 * Interface for useNPCDiscovery hook parameters
 */
interface UseNPCDiscoveryParams {
  /** NPC data */
  npc: NPC | null | undefined;
  /** Unique identifier for the NPC */
  npcId: string | null | undefined;
  /** Player data */
  player: Player | null | undefined;
  /** Dispatch function for actions */
  dispatch: Dispatch | null | undefined;
}

/**
 * Interface for hook return value
 */
interface UseNPCDiscoveryReturn {
  /** Current dialogue to display */
  currentDialogue: Dialogue | null;
  /** Function to update current dialogue */
  setCurrentDialogue: React.Dispatch<React.SetStateAction<Dialogue | null>>;
}

/**
 * Hook to handle NPC discovery and initial dialogue setup
 * 
 * @param npc - NPC data object
 * @param npcId - Unique identifier for the NPC
 * @param player - Player data containing discovery information
 * @param dispatch - Action dispatch function
 * @returns Object containing current dialogue and setter function
 */
const useNPCDiscovery = ({ npc, npcId, player, dispatch }: UseNPCDiscoveryParams): UseNPCDiscoveryReturn => {
  const [currentDialogue, setCurrentDialogue] = useState<Dialogue | null>(null);

  useEffect(() => {
    // Guard against undefined or null values
    if (!npc || !npcId || !player || !dispatch) return;
    
    // Safely check if this is first meeting - ensure discoveredNPCs is an array
    const discoveredNPCs = Array.isArray(player.discoveredNPCs) ? player.discoveredNPCs : [];
    const isFirstMeeting = discoveredNPCs.includes ? !discoveredNPCs.includes(npcId) : true;
    
    // Handle discovery
    if (isFirstMeeting) {
      dispatch({ 
        type: ACTION_TYPES.DISCOVER_NPC, 
        payload: { 
          npcId,
          npcName: npc?.name || "Unknown NPC" // Safe fallback
        }
      });
      
      // Show first meeting dialogue if available
      const npcDialogue = npc?.dialogue || {};
      if (npcDialogue.firstMeeting) {
        setCurrentDialogue(npcDialogue.firstMeeting);
      } else if (!currentDialogue) {
        // Initial greeting with safe fallbacks
        setCurrentDialogue(npcDialogue.initial || { 
          text: npc?.greeting || "Hello there.", 
          options: [] 
        });
      }
    } else if (!currentDialogue) {
      // Regular dialogue for returning visits with safe fallbacks
      const npcDialogue = npc?.dialogue || {};
      setCurrentDialogue(npcDialogue.initial || { 
        text: npc?.greeting || "Hello there.", 
        options: [] 
      });
    }
  }, [npc, npcId, player, dispatch, currentDialogue]);

  return { currentDialogue, setCurrentDialogue };
};

export default useNPCDiscovery;
