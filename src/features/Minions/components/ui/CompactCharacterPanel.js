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
import Panel from '../../../../shared/components/layout/Panel';

/**
 * @typedef {Object} Character
 * @property {string} id - Unique identifier for the character
 * @property {string} name - Character's name
 * @property {string} role - Character's role or class
 * @property {boolean} playerControlled - Whether the character is directly controlled by the player
 * @property {boolean} playerCreated - Whether the character was created by the player
 */

/**
 * @typedef {Object} Player
 * @property {string[]} controlledCharacters - Array of character IDs controlled by the player
 */

/**
 * CompactCharacterPanel Component
 * 
 * Displays a compact view of characters under player control in a panel format.
 * Shows up to 3 characters with a summary and provides a button to expand to a detailed view.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onExpandView - Callback function triggered when the expand button is clicked
 *                                       Opens the full character management view
 * 
 * @example
 * // Basic usage
 * <CompactCharacterPanel onExpandView={() => setView('detailed')} />
 * 
 * @example
 * // Inside a layout with other panels
 * <Grid container spacing={2}>
 *   <Grid item xs={12} sm={6}>
 *     <CompactCharacterPanel onExpandView={handleExpandCharacters} />
 *   </Grid>
 *   <Grid item xs={12} sm={6}>
 *     <OtherPanel />
 *   </Grid>
 * </Grid>
 * 
 * @returns {JSX.Element} Rendered CompactCharacterPanel component
 */
const CompactCharacterPanel = ({ onExpandView }) => {
  // Access game state from context with safe default fallback values
  const { npcs = [], player = {} } = useContext(GameStateContext);
  
  /**
   * Filters the list of NPCs to find characters controlled by the player
   * Includes characters that:
   * 1. Have their ID in player.controlledCharacters array
   * 2. Have the playerControlled flag set to true
   * 
   * @type {Character[]}
   */
  const controlledCharacterIds = Array.isArray(player?.controlledCharacters) 
    ? player.controlledCharacters
    : [];
    
  const controlledCharacters = Array.isArray(npcs) 
    ? npcs.filter(npc => 
        npc && (
          (Array.isArray(controlledCharacterIds) && controlledCharacterIds.includes(npc.id)) || 
          npc.playerControlled
        )
      ).slice(0, 3) // Show only first 3 in compact view
    : []; // Empty array fallback if npcs is not an array
  
  /**
   * Total count of all controlled characters (not just the visible ones)
   * Used to display a "+X more" message when there are more than 3 characters
   * 
   * @type {number}
   */
  const totalControlled = Array.isArray(npcs) 
    ? npcs.filter(npc => 
        npc && (
          (Array.isArray(controlledCharacterIds) && controlledCharacterIds.includes(npc.id)) || 
          npc.playerControlled
        )
      ).length
    : 0;
  
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