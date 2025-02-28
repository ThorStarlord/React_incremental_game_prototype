import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import PersonIcon from '@mui/icons-material/Person';
import { GameStateContext } from '../../../../context/GameStateContext';
import Panel from '../panel/Panel';

const CompactCharacterPanel = ({ onExpandView }) => {
  const { npcs, player } = useContext(GameStateContext);
  
  // Get controlled characters
  const controlledCharacterIds = player?.controlledCharacters || [];
  const controlledCharacters = npcs
    .filter(npc => controlledCharacterIds.includes(npc.id) || npc.playerControlled)
    .slice(0, 3); // Show only first 3 in compact view
  
  const totalControlled = npcs.filter(npc => 
    controlledCharacterIds.includes(npc.id) || npc.playerControlled
  ).length;
  
  return (
    <Panel 
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SportsKabaddiIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
            <Typography variant="h6">Characters</Typography>
          </Box>
          <Tooltip title="View All Characters">
            <IconButton size="small" onClick={onExpandView}>
              <OpenInFullIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      {controlledCharacters.length > 0 ? (
        <List disablePadding sx={{ mb: 1 }}>
          {controlledCharacters.map((character) => (
            <React.Fragment key={character.id}>
              <ListItem dense disableGutters>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: character.playerCreated ? 'success.main' : 'primary.main'
                    }}
                  >
                    <PersonIcon sx={{ fontSize: '1.2rem' }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={character.name}
                  secondary={character.role}
                  primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                  secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No characters under your control yet
        </Typography>
      )}
      
      {/* Show a message if there are more characters than shown */}
      {totalControlled > 3 && (
        <Typography variant="caption" color="text.secondary">
          +{totalControlled - 3} more characters
        </Typography>
      )}
      
      <Button 
        variant="outlined" 
        color="primary"
        startIcon={<SportsKabaddiIcon />}
        fullWidth
        onClick={onExpandView}
        size="small"
        sx={{ mt: 1 }}
      >
        Manage Characters
      </Button>
    </Panel>
  );
};

export default CompactCharacterPanel;