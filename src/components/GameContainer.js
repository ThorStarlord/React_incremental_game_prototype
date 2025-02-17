import React from 'react';
import { Box } from '@mui/material';
import FactionContainer from './FactionUI/FactionContainer';
import Battle from './Battle';
import NPCEncounter from './NPCEncounter';
import PlayerStats from './PlayerStats';
import PlayerTraits from './PlayerTraits';
import Header from './Header';
import Footer from './Footer';
import './GameContainer.css';

const GameContainer = () => {
  return (
    <Box className="game-container">
      <Box id="header" className="game-area">
        <Header />
      </Box>
      <Box id="player-stats" className="game-area">
        <PlayerStats />
      </Box>
      <Box id="battle" className="game-area">
        <Battle />
      </Box>
      <Box id="traits" className="game-area">
        <PlayerTraits />
      </Box>
      <Box id="faction" className="game-area">
        <FactionContainer />
      </Box>
      <Box id="npcs" className="game-area">
        <NPCEncounter npcId={1} />
      </Box>
      <Box id="footer" className="game-area">
        <Footer />
      </Box>
    </Box>
  );
};

export default GameContainer;