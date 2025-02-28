import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from '../store'; // Import your Redux store
import GameContainer from '../components/GameContainer';
import TownArea from '../components/areas/TownArea';
import NPCEncounter from '../components/NPCEncounter';
import MainMenu from '../components/MainMenu';
import Settings from '../components/Settings';
import NPCPanel from '../features/npc/NPCPanel';

const TownAreaWrapper = () => {
  const { townId } = useParams();
  return <TownArea townId={townId} />;
};

const NPCEncounterWrapper = () => {
  const { npcId } = useParams();
  return <NPCEncounter npcId={npcId} />;
};

// Add this component to your router file
const RouteWrapper = ({ children }) => {
  const navigate = useNavigate();
  return children({ navigate });
};

const AppRouter = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game" element={<GameContainer />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/town/:townId" element={<TownAreaWrapper />} />
        <Route 
          path="/npc/:npcId" 
          element={
            <RouteWrapper>
              {({ navigate }) => {
                const { npcId } = useParams();
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
              }}
            </RouteWrapper>
          } 
        />
      </Routes>
    </Router>
  </Provider>
);

export default AppRouter;