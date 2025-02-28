import { ACTION_TYPES } from '../context/GameStateContext';

/**
 * Discover a trait and add it to the player's discovered traits
 * @param {Function} dispatch - The game state dispatch function
 * @param {string} traitId - The ID of the trait to discover
 */
export const discoverTrait = (dispatch, traitId) => {
  dispatch({
    type: ACTION_TYPES.DISCOVER_TRAIT,
    payload: { traitId }
  });
};

/**
 * Register that the player has met an NPC
 * @param {Function} dispatch - The game state dispatch function
 * @param {string} npcId - The ID of the NPC
 */
export const meetNPC = (dispatch, npcId) => {
  dispatch({
    type: ACTION_TYPES.MEET_NPC,
    payload: { npcId }
  });
};

/**
 * Update relationship with an NPC
 * @param {Function} dispatch - The game state dispatch function
 * @param {string} npcId - The ID of the NPC
 * @param {number} amount - The amount to change the relationship (positive or negative)
 */
export const updateRelationship = (dispatch, npcId, amount) => {
  dispatch({
    type: ACTION_TYPES.UPDATE_RELATIONSHIP,
    payload: { npcId, amount }
  });
};

/**
 * Calculate discovery progress statistics for the UI
 * @param {Object} gameState - Current game state
 * @returns {Object} Discovery statistics
 */
export const getDiscoveryProgress = (gameState) => {
  const { player, traits, npcs } = gameState;

  // Count total traits
  const totalTraits = traits?.copyableTraits ? Object.keys(traits.copyableTraits).length : 0;
  
  // Count discovered traits
  const discoveredTraitCount = player?.discoveredTraits?.length || 0;
  
  // Count total NPCs
  const totalNPCs = npcs?.length || 0;
  
  // Count met NPCs
  const metNPCCount = player?.metNPCs?.length || 0;
  
  // Calculate completion percentages
  const traitCompletion = totalTraits > 0 ? (discoveredTraitCount / totalTraits) * 100 : 0;
  const npcCompletion = totalNPCs > 0 ? (metNPCCount / totalNPCs) * 100 : 0;
  
  // Get lists of discovered/undiscovered traits and met/unmet NPCs
  const discoveredTraits = player?.discoveredTraits || [];
  const metNPCs = player?.metNPCs || [];
  
  // Get unique trait types and NPC locations
  const traitTypes = getUniqueTraitTypes(traits?.copyableTraits || {});
  const npcLocations = getUniqueNPCLocations(npcs || []);
  
  return {
    totalTraits,
    discoveredTraitCount,
    totalNPCs,
    metNPCCount,
    traitCompletion,
    npcCompletion,
    discoveredTraits,
    metNPCs,
    traitTypes,
    npcLocations
  };
};

/**
 * Get all unique trait types from the traits collection
 * @param {Object} traits - Object containing all traits
 * @returns {string[]} Array of unique trait types
 */
export const getUniqueTraitTypes = (traits) => {
  const types = new Set();
  
  Object.values(traits).forEach(trait => {
    if (trait.type) {
      types.add(trait.type);
    }
  });
  
  return Array.from(types).sort();
};

/**
 * Get all unique NPC locations
 * @param {Array} npcs - Array of NPC objects
 * @returns {string[]} Array of unique locations
 */
export const getUniqueNPCLocations = (npcs) => {
  const locations = new Set();
  
  npcs.forEach(npc => {
    if (npc.location) {
      locations.add(npc.location);
    }
  });
  
  return Array.from(locations).sort();
};

/**
 * Format a location name to be more readable (e.g., "townSquare" to "Town Square")
 * @param {string} location - The location name to format
 * @returns {string} Formatted location name
 */
export const formatLocationName = (location) => {
  if (!location) return 'Unknown';
  
  // Convert camelCase to Title Case with spaces
  return location
    .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
};

/**
 * Get the trait cost adjusted for NPC power level if applicable
 * @param {Object} trait - The trait object
 * @param {Object} sourceNpc - The source NPC object (if any)
 * @returns {number} The adjusted cost
 */
export const getAdjustedTraitCost = (trait, sourceNpc) => {
  if (!trait) return 0;
  
  const baseCost = trait.essenceCost || 0;
  const powerMultiplier = sourceNpc?.powerLevel || 1;
  return baseCost * powerMultiplier;
};

// In a component that shows information about a topic related to a trait
import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { GameDispatchContext } from '../context/GameStateContext';
import { discoverTrait } from '../utils/discoveryUtils';

const KnowledgeSection = () => {
  const dispatch = useContext(GameDispatchContext);
  
  const handleReadLore = () => {
    // When player reads about a topic, they might discover a related trait
    discoverTrait(dispatch, 'QuickLearner');
    
    // Show the dialog content, etc.
  };
  
  return (
    <div>
      <h2>Ancient Knowledge</h2>
      <p>This dusty tome contains information about ancient techniques...</p>
      <Button onClick={handleReadLore}>Read More</Button>
    </div>
  );
};

// In a component that represents a location with NPCs
import React, { useContext } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import { meetNPC, updateRelationship } from '../utils/discoveryUtils';
import NPCCard from '../components/NPCCard';

const TownSquare = () => {
  const { npcs, player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  
  // NPCs in this location
  const locationNpcs = npcs.filter(npc => npc.location === 'TownSquare');
  
  const handleInteractWithNPC = (npc) => {
    // If first meeting, register the discovery
    if (!player.metNPCs.includes(npc.id)) {
      meetNPC(dispatch, npc.id, npc.name);
    }
    
    // Handle the interaction
    // ...
    
    // Potentially improve relationship
    updateRelationship(dispatch, npc.id, 2);
  };
  
  return (
    <Box>
      <Typography variant="h5">Town Square</Typography>
      <Typography variant="body1" paragraph>
        The busy town square is filled with people going about their business.
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">People Here:</Typography>
        {locationNpcs.map(npc => (
          <Box key={npc.id} sx={{ mb: 2 }}>
            <NPCCard npc={npc} />
            <Button 
              variant="outlined" 
              sx={{ mt: 1 }} 
              onClick={() => handleInteractWithNPC(npc)}
            >
              Talk to {player.metNPCs.includes(npc.id) ? npc.name : "Stranger"}
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// In your TraitList component where players acquire traits
const handleAcquireTrait = (traitId, essenceCost) => {
  // Dispatch normal acquisition action
  dispatch({
    type: 'COPY_TRAIT',
    payload: {
      traitId,
      essenceCost
    }
  });
  
  // Also mark as discovered if not already
  if (!player.discoveredTraits.includes(traitId)) {
    discoverTrait(dispatch, traitId);
  }
  
  // If trait has an NPC source, improve relationship with that NPC
  const trait = traits.copyableTraits[traitId];
  if (trait?.sourceNpc) {
    updateRelationship(dispatch, trait.sourceNpc, 3);
  }
};