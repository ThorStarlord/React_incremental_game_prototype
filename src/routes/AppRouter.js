import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from '../store'; // Import your Redux store
import GameContainer from '../layout/components/GameContainer';
import TownArea from '../features/World/components/containers/TownArea';
import NPCEncounter from '../features/NPCs/components/NPCEncounter';
import MainMenu from '../pages/MainMenu';
import Settings from '../pages/Settings';
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

// New wrapper component for TownArea

const TownAreaWrapper = () => {
  const { townId } = useParams();
  return <TownArea townId={townId} />;
};

const NPCEncounterWrapper = () => {
  const { npcId } = useParams();
  return <NPCEncounter npcId={npcId} />;
};

// New wrapper component for NPCPanel that correctly uses hooks
const NPCPanelWrapper = () => {
  const { npcId } = useParams();
  const navigate = useNavigate();
  const npc = useSelector(state => 
    state.npcs.find(n => n.id === npcId) || 
    state.game.currentLocation?.npcs.find(n => n.id === npcId)
  );
  const locationName = useSelector(state => state.game.currentLocation?.name);
  
  return (
    <NPCPanel 
      npc={npc} 
      onClose={() => navigate(-1)}
      locationName={locationName}
    />
  );
};

const AppRouter = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game" element={<GameContainer />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/town/:townId" element={<TownAreaWrapper />} />
        <Route path="/npc/:npcId" element={<NPCPanelWrapper />} />
      </Routes>
    </Router>
  </Provider>
);

export default AppRouter;