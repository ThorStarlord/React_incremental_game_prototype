import React from 'react';
import { Box, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FactionContainer from './FactionUI/FactionContainer';
import Battle from './Battle';
import NPCEncounter from './NPCEncounter';
import PlayerStats from './PlayerStats';
import PlayerTraits from './PlayerTraits';
// Removed Inventory, QuestLog, and Shop components
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