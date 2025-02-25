import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import GameContainer from '../components/GameContainer';
import TownArea from '../components/areas/TownArea';
import NPCEncounter from '../components/NPCEncounter';
import MainMenu from '../components/MainMenu';
import Settings from '../components/Settings';

const TownAreaWrapper = () => {
  const { townId } = useParams();
  return <TownArea townId={townId} />;
};

const NPCEncounterWrapper = () => {
  const { npcId } = useParams();
  return <NPCEncounter npcId={npcId} />;
};

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/game" element={<GameContainer />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/town/:townId" element={<TownAreaWrapper />} />
      <Route path="/npc/:npcId" element={<NPCEncounterWrapper />} />
    </Routes>
  </Router>
);

export default AppRouter;