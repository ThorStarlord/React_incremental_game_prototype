import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TownArea from '../../features/World/components/containers/TownArea';
import NPCEncounter from '../../features/NPCs/components/NPCEncounter';
import NPCPanel from '../../features/NPCs/components/container/NPCPanel';
import { useGameState } from '../../context/GameStateContext';

// Define interface for GameState with proper type safety
interface GameState {
  npcs?: Array<{
    id: string;
    [key: string]: any;
  }>;
  game?: {
    currentLocation?: {
      name?: string;
      npcs?: Array<{
        id: string;
        [key: string]: any;
      }>;
    };
  };
}

/**
 * Wrapper component for TownArea that extracts townId from URL parameters
 * @returns TownArea component with townId prop
 */
export const TownAreaWrapper: React.FC = () => {
  // Fix: Use the correct React Router v6 useParams pattern
  const params = useParams();
  const townId = params.townId || '';
  
  return <TownArea townId={townId} />;
};

/**
 * Wrapper component for NPCEncounter that extracts npcId from URL parameters
 * @returns NPCEncounter component with npcId prop
 */
export const NPCEncounterWrapper: React.FC = () => {
  // Fix: Use the correct React Router v6 useParams pattern
  const params = useParams();
  const npcId = params.npcId || '';
  
  return <NPCEncounter npcId={npcId} />;
};

/**
 * Wrapper for NPCPanel that uses React Router hooks to get params and navigation
 * @returns NPCPanel with proper props
 */
export const NPCPanelWrapper: React.FC = () => {
  // Fix: Use the correct React Router v6 useParams pattern
  const params = useParams();
  const npcId = params.npcId || '';
  const navigate = useNavigate();
  const gameState = useGameState() as GameState;
  
  // Safely access nested properties with optional chaining and defaults
  const npcs = gameState?.npcs || [];
  const currentLocation = gameState?.game?.currentLocation;
  
  // Add safety checks to ensure arrays before using .find()
  const npcFromList = Array.isArray(npcs) 
    ? npcs.find(n => n && n.id === npcId) 
    : undefined;
    
  const locationNpcs = currentLocation?.npcs || [];
  const npcFromLocation = Array.isArray(locationNpcs) 
    ? locationNpcs.find(n => n && n.id === npcId) 
    : undefined;
    
  // Use nullish coalescing to handle undefined/null values
  const npc = npcFromList ?? npcFromLocation;
  
  // Return only the NPCPanel with the npcId prop
  return <NPCPanel npcId={npcId} />;
};
