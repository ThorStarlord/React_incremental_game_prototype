import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
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
import './GameContainer.css';

const GameContainer = () => {
  const [selectedSection, setSelectedSection] = useState('stats');

  const menuItems = [
    { id: 'stats', label: 'Character Stats', icon: <PersonIcon /> },
    { id: 'traits', label: 'Character Traits', icon: <GroupIcon /> },
    { id: 'faction', label: 'Faction', icon: <BusinessIcon /> },
    { id: 'battle', label: 'Battle', icon: <SportsKabaddiIcon /> },
    { id: 'npcs', label: 'NPCs', icon: <AccountBalanceIcon /> },
    { id: 'shop', label: 'Shop', icon: <StorefrontIcon /> }
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case 'stats':
        return <PlayerStats />;
      case 'traits':
        return <PlayerTraits />;
      case 'faction':
        return <FactionContainer />;
      case 'battle':
        return <Battle />;
      case 'npcs':
        // For now, show first NPC. Later we'll implement NPC selection
        return <NPCEncounter npcId={1} />;
      case 'shop':
        return <div>Shop Coming Soon</div>;
      default:
        return <PlayerStats />;
    }
  };

  return (
    <Box className="game-container">
      <Drawer
        variant="permanent"
        className="sidebar"
        classes={{
          paper: 'sidebar-paper'
        }}
      >
        <Box className="sidebar-header">
          <Typography variant="h6" component="h1">
            Incremental RPG
          </Typography>
        </Box>
        <List>
          {menuItems.map(item => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={selectedSection === item.id}
                onClick={() => setSelectedSection(item.id)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box className="content">
        {renderContent()}
      </Box>
    </Box>
  );
};

export default GameContainer;