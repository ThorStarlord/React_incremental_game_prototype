import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import Panel from './Panel';
import BreadcrumbNav from './BreadcrumbNav';

const NPCEncounter = ({ npcId }) => {
  const navigate = useNavigate();
  const { player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  const npcs = {
    merchant: {
      name: 'Town Merchant',
      greeting: 'Welcome to my shop! What would you like to buy?',
      options: [
        { label: 'Buy Health Potion (5 gold)', action: 'buyPotion' },
        { label: 'Buy Better Weapon (20 gold)', action: 'buyWeapon' },
        { label: 'Buy Better Armor (15 gold)', action: 'buyArmor' }
      ]
    },
    blacksmith: {
      name: 'Blacksmith',
      greeting: 'Looking to improve your equipment?',
      options: [
        { label: 'Upgrade Weapon (10 gold)', action: 'upgradeWeapon' },
        { label: 'Upgrade Armor (10 gold)', action: 'upgradeArmor' },
        { label: 'Repair Equipment (5 gold)', action: 'repair' }
      ]
    },
    elder: {
      name: 'Town Elder',
      greeting: 'Ah, a brave adventurer! Perhaps you can help us...',
      options: [
        { label: 'Accept Quest', action: 'acceptQuest' },
        { label: 'Ask for Advice', action: 'getAdvice' },
        { label: 'Report Quest Progress', action: 'reportQuest' }
      ]
    }
  };

  const npc = npcs[npcId];

  const handleAction = (action) => {
    switch(action) {
      case 'buyPotion':
        if (player.gold >= 5) {
          dispatch({
            type: 'UPDATE_PLAYER',
            payload: {
              ...player,
              gold: player.gold - 5,
              hp: Math.min(player.maxHp, player.hp + 20)
            }
          });
        }
        break;
      case 'buyWeapon':
        if (player.gold >= 20) {
          dispatch({
            type: 'UPDATE_PLAYER',
            payload: {
              ...player,
              gold: player.gold - 20,
              attack: player.attack + 2
            }
          });
        }
        break;
      case 'buyArmor':
        if (player.gold >= 15) {
          dispatch({
            type: 'UPDATE_PLAYER',
            payload: {
              ...player,
              gold: player.gold - 15,
              defense: player.defense + 2
            }
          });
        }
        break;
      // Add more actions as needed
    }
  };

  if (!npc) {
    return (
      <Box sx={{ p: 2 }}>
        <BreadcrumbNav />
        <Panel title="Error">
          <Typography>NPC not found</Typography>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Panel>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <BreadcrumbNav />
      <Panel title={npc.name}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate(-1)} size="large">
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Typography variant="h6" sx={{ mb: 3 }}>
          {npc.greeting}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {npc.options.map((option, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() => handleAction(option.action)}
              fullWidth
            >
              {option.label}
            </Button>
          ))}
        </Box>
      </Panel>
    </Box>
  );
};

export default NPCEncounter;