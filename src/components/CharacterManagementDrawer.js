import React, { useState, useContext } from 'react';
import { 
  Box, 
  Drawer, 
  Tabs, 
  Tab, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip,
  IconButton, 
  Divider,
  Button,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/system';
import PersonIcon from '@mui/icons-material/Person';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloseIcon from '@mui/icons-material/Close';
import { GameStateContext } from '../context/GameStateContext';
import { RELATIONSHIP_TIERS } from '../config/gameConstants';
import { useNavigate } from 'react-router-dom';

// Style for controlled NPCs with gradient background
const ControlledNPCItem = styled(ListItem)(({ theme, controlLevel }) => ({
  background: `linear-gradient(90deg, ${theme.palette.background.paper} ${100 - controlLevel}%, ${theme.palette.success.light} ${controlLevel}%)`,
  transition: 'background 0.3s ease',
  '&:hover': {
    background: `linear-gradient(90deg, ${theme.palette.background.paper} ${100 - controlLevel - 5}%, ${theme.palette.success.light} ${controlLevel + 5}%)`,
  }
}));

// Style for player-controlled characters
const PlayerCharacterItem = styled(ListItem)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  background: theme.palette.background.paper,
  '&:hover': {
    background: theme.palette.action.hover,
  }
}));

// Get relationship tier based on relationship value
const getRelationshipTier = (value) => {
  return Object.values(RELATIONSHIP_TIERS).find(tier =>
    value >= tier.threshold
  ) || RELATIONSHIP_TIERS.NEMESIS;
};

const CharacterManagementDrawer = ({ open, onClose, initialTab = 0 }) => {
  const [tabValue, setTabValue] = useState(initialTab);
  const { npcs, characters, traits } = useContext(GameStateContext);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNPCClick = (npcId) => {
    navigate(`/npc/${npcId}`);
    onClose();
  };

  const handleCharacterClick = (characterId) => {
    // Navigate to character details page (to be implemented)
    navigate(`/character/${characterId}`);
    onClose();
  };

  const handleTraitClick = (traitId) => {
    // Navigate to trait details or highlight in traits panel
    navigate(`/traits?highlight=${traitId}`);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Box sx={{ width: 320, p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Character Management
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab icon={<SportsKabaddiIcon />} label="Characters" />
          <Tab icon={<PersonIcon />} label="NPCs" />
          <Tab icon={<AutoFixHighIcon />} label="Traits" />
        </Tabs>
        
        <Box sx={{ mt: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
          {/* Characters Tab */}
          {tabValue === 0 && (
            <List>
              {characters && characters.length > 0 ? (
                characters.map((character) => (
                  <PlayerCharacterItem 
                    button 
                    key={character.id}
                    onClick={() => handleCharacterClick(character.id)}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        src={character.avatar || `https://api.dicebear.com/6.x/personas/svg?seed=${character.id}`}
                        sx={{ bgcolor: 'primary.main' }}
                      >
                        <SportsKabaddiIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={character.name} 
                      secondary={`Level ${character.level || 1} ${character.type || 'Character'}`} 
                    />
                    <Chip 
                      size="small"
                      label="Controlled" 
                      color="primary"
                    />
                  </PlayerCharacterItem>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary" gutterBottom>
                    No characters yet
                  </Typography>
                  <Button variant="outlined" sx={{ mt: 1 }}>
                    Create Character
                  </Button>
                </Box>
              )}
            </List>
          )}

          {/* NPCs Tab */}
          {tabValue === 1 && (
            <List>
              {npcs && npcs.map((npc) => {
                const relationship = npc.relationship || 0;
                const relationshipTier = getRelationshipTier(relationship);
                const controlLevel = Math.max(0, relationship); // Level of control based on relationship
                
                // Determine if fully controlled based on relationship level
                const isFullyControlled = relationship >= 75;
                const isInfluenced = relationship > 0 && relationship < 75;
                
                const ListItemComponent = isInfluenced || isFullyControlled 
                  ? ControlledNPCItem 
                  : ListItem;
                
                return (
                  <React.Fragment key={npc.id}>
                    <ListItemComponent 
                      button
                      controlLevel={controlLevel}
                      onClick={() => handleNPCClick(npc.id)}
                      sx={{ 
                        position: 'relative',
                        ...(isFullyControlled && {
                          bgcolor: 'success.light',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'success.main',
                          }
                        })
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          src={npc.avatar || `https://api.dicebear.com/6.x/personas/svg?seed=${npc.id}`}
                          sx={{
                            ...(isFullyControlled && {
                              bgcolor: 'success.dark',
                              border: '2px solid white'
                            })
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={npc.name} 
                        secondary={
                          <Box component="span" sx={{ 
                            color: isFullyControlled ? 'white' : 'text.secondary'
                          }}>
                            {npc.type} - Power Level: {npc.powerLevel || 1}
                          </Box>
                        } 
                      />
                      <Chip 
                        size="small"
                        label={relationshipTier.name} 
                        sx={{
                          bgcolor: relationshipTier.color,
                          color: '#fff',
                          fontWeight: 'bold'
                        }}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={(relationship + 100) / 2}
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          bgcolor: 'transparent',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: relationshipTier.color
                          }
                        }}
                      />
                    </ListItemComponent>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                );
              })}
            </List>
          )}
          
          {/* Traits Tab */}
          {tabValue === 2 && (
            <List>
              {traits && Object.entries(traits).map(([id, trait]) => (
                <ListItem 
                  button 
                  key={id}
                  onClick={() => handleTraitClick(id)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: trait.sourceNpc ? 'secondary.main' : 'primary.main' }}>
                      <AutoFixHighIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={trait.name} 
                    secondary={
                      trait.sourceNpc 
                        ? `From NPC - Requires ${trait.requiredRelationship || 0} relationship` 
                        : `Cost: ${trait.essenceCost || 0} essence`
                    } 
                  />
                  {trait.acquired && (
                    <Chip 
                      size="small"
                      label="Acquired" 
                      color="success"
                    />
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default CharacterManagementDrawer;