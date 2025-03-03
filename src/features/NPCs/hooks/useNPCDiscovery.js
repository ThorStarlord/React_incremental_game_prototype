import { useState, useEffect } from 'react';
import { ACTION_TYPES } from '../../../context/actions/actionTypes';

/**
 * Hook to handle NPC discovery and initial dialogue setup
 */
const useNPCDiscovery = ({ npc, npcId, player, dispatch }) => {
  const [currentDialogue, setCurrentDialogue] = useState(null);

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
