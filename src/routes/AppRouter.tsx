import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate, Navigate, Outlet } from 'react-router-dom';
import GameContainer from '../layout/components/GameContainer';
import TownArea from '../features/World/components/containers/TownArea';
import NPCEncounter from '../features/NPCs/components/NPCEncounter';
import MainMenu from '../pages/MainMenu';
import Settings from '../pages/MainMenu';
import NPCPanel from '../features/NPCs/components/container/NPCPanel';
import PlayerStats from '../features/Player/components/containers/PlayerStats';
import WorldMap from '../features/World/components/containers/WorldMap';
import InventoryList from '../features/Inventory/components/containers/InventoryList';
import EssenceDisplay from '../features/Essence/components/ui/EssenceDisplay';
import TraitSystemWrapper from '../features/Traits/components/containers/TraitSystemWrapper';
import Panel from '../shared/components/layout/Panel';
import BreadcrumbNav from '../shared/components/ui/BreadcrumbNav';
import useEssenceGeneration from '../features/Essence/hooks/useEssenceGeneration';
import RelationshipNotification from '../features/NPCs/components/RelationshipNotification';
import TraitEffectNotification from '../features/Traits/components/containers/TraitEffectNotification';
import useTraitNotifications from '../features/Traits/hooks/useTraitNotifications';
import CharacterTabBar from '../shared/components/ui/CharacterTabBar';
import CharacterManagementDrawer from '../shared/components/ui/CharacterManagementDrawer';
import CompactTraitPanel from '../features/Traits/components/containers/CompactTraitPanel';
import CompactCharacterPanel from '../features/Minions/components/ui/CompactCharacterPanel';
import useMinionSimulation from '../features/Minions/hooks/useMinionSimulation';
import { useGameState } from '../context/GameStateContext';

/**
 * Interface for town route parameters
 */
interface TownParams {
  townId: string;
}

/**
 * Interface for NPC route parameters
 */
interface NPCParams {
  npcId: string;
}

/**
 * Interface for NPC data
 */
interface NPC {
  id: string;
  [key: string]: any; // Additional NPC properties
}

/**
 * Interface for Location data
 */
interface Location {
  name?: string;
  npcs?: NPC[];
  [key: string]: any; // Additional location properties
}

/**
 * Interface for Game State
 */
interface GameState {
  npcs?: NPC[];
  game?: {
    currentLocation?: Location;
    [key: string]: any; // Additional game properties
  };
  [key: string]: any; // Additional state properties
}

/**
 * Wrapper component for TownArea that extracts townId from URL parameters
 * @returns {JSX.Element} TownArea component with townId prop
 */
const TownAreaWrapper: React.FC = (): JSX.Element => {
  const { townId } = useParams<TownParams>();
  return <TownArea townId={townId} />;
};

/**
 * Wrapper component for NPCEncounter that extracts npcId from URL parameters
 * @returns {JSX.Element} NPCEncounter component with npcId prop
 */
const NPCEncounterWrapper: React.FC = (): JSX.Element => {
  const { npcId } = useParams<NPCParams>();
  return <NPCEncounter npcId={npcId} />;
};

/**
 * Wrapper for NPCPanel that uses React Router hooks to get params and navigation
 * @returns {JSX.Element} NPCPanel with proper props
 */
const NPCPanelWrapper: React.FC = (): JSX.Element => {
  const { npcId } = useParams<NPCParams>();
  const navigate = useNavigate();
  const { npcs = [], game = {} } = useGameState() as GameState;
  
  // Add safety checks to ensure arrays before using .find()
  const npcFromList = Array.isArray(npcs) ? npcs.find(n => n && n.id === npcId) : undefined;
  const npcFromLocation = game?.currentLocation?.npcs && Array.isArray(game.currentLocation.npcs) ? 
    game.currentLocation.npcs.find(n => n && n.id === npcId) : 
    undefined;
    
  // Use nullish coalescing to handle undefined/null values
  const npc = npcFromList ?? npcFromLocation;
  const locationName = game?.currentLocation?.name;
  
  return (
    <NPCPanel 
      npc={npc} 
      onClose={() => navigate(-1)}
      locationName={locationName}
    />
  );
};

/**
 * Game layout component that wraps game-related routes with common UI elements
 * @returns {JSX.Element} Layout with common game UI and outlet for nested routes
 */
const GameLayout: React.FC = (): JSX.Element => {
  // Initialize hooks for game systems
  useEssenceGeneration();
  useTraitNotifications();
  useMinionSimulation();
  
  return (
    <GameContainer>
      <BreadcrumbNav />
      <EssenceDisplay position="top-right" />
      <RelationshipNotification />
      <TraitEffectNotification />
      <Outlet /> {/* Nested routes will render here */}
    </GameContainer>
  );
};

/**
 * Character management layout with character tab bar
 * @returns {JSX.Element} Layout with character UI elements
 */
const CharacterLayout: React.FC = (): JSX.Element => {
  return (
    <>
      <CharacterTabBar />
      <CharacterManagementDrawer />
      <Outlet />
    </>
  );
};

/**
 * Main application router that defines all routes in the application
 * @returns {JSX.Element} Router component tree
 */
const AppRouter: React.FC = (): JSX.Element => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainMenu />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Game routes with common layout */}
      <Route path="/game" element={<GameLayout />}>
        <Route index element={<WorldMap />} />
        <Route path="town/:townId" element={<TownAreaWrapper />} />
        <Route path="npc/:npcId" element={<NPCPanelWrapper />} />
        <Route path="encounter/:npcId" element={<NPCEncounterWrapper />} />
        
        {/* Character management routes */}
        <Route path="character" element={<CharacterLayout />}>
          <Route index element={<PlayerStats />} />
          <Route path="inventory" element={<InventoryList />} />
          <Route path="traits" element={<TraitSystemWrapper />} />
          <Route path="minions" element={<CompactCharacterPanel />} />
        </Route>
      </Route>
      
      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRouter;
