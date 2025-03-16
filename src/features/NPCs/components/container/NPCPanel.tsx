import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Avatar, 
  Chip, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  useTheme 
} from '@mui/material';
import { useGameState } from '../../../../context/GameStateExports';

/**
 * Interface for NPCPanel props
 */
interface NPCPanelProps {
  /** ID of the NPC to display */
  npcId: string;
}

/**
 * Interface for an NPC object
 */
interface NPC {
  id: string;
  name: string;
  title?: string;
  description?: string;
  image?: string;
  faction?: string;
  location?: string;
  level?: number;
  relationship?: number;
  services?: string[];
  tags?: string[];
  [key: string]: any;
}

/**
 * NPCPanel Component
 * 
 * Displays detailed information about an NPC
 * 
 * @param props - Component props
 * @returns Rendered NPCPanel component
 */
const NPCPanel: React.FC<NPCPanelProps> = ({ npcId }) => {
  const theme = useTheme();
  const gameState = useGameState();
  
  // Get NPCs array from game state with type safety
  const npcs = Array.isArray((gameState as any).npcs) 
    ? (gameState as any).npcs as NPC[] 
    : [];
  
  // Find the current NPC
  const npc = npcs.find(npc => npc && npc.id === npcId);
  
  // Handle case when NPC is not found
  if (!npc) {
    return (
      <Paper sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
        <Typography color="error">NPC not found (ID: {npcId})</Typography>
      </Paper>
    );
  }
  
  // Calculate relationship status text and color
  const relationshipData = (() => {
    const relationship = npc.relationship || 0;
    
    if (relationship >= 75) return { text: 'Trusted', color: 'success' };
    if (relationship >= 50) return { text: 'Friendly', color: 'success' };
    if (relationship >= 25) return { text: 'Cordial', color: 'info' };
    if (relationship >= 0) return { text: 'Neutral', color: 'default' };
    if (relationship >= -25) return { text: 'Wary', color: 'warning' };
    if (relationship >= -50) return { text: 'Unfriendly', color: 'warning' };
    return { text: 'Hostile', color: 'error' };
  })();

  return (
    <Paper sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
      {/* NPC Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          alt={npc.name}
          src={npc.image}
          sx={{ 
            width: 64, 
            height: 64, 
            mr: 2,
            bgcolor: theme.palette.primary.main 
          }}
        >
          {npc.name.charAt(0)}
        </Avatar>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h2">
            {npc.name}
          </Typography>
          
          {npc.title && (
            <Typography variant="subtitle1" color="text.secondary">
              {npc.title}
            </Typography>
          )}
          
          {/* Relationship status */}
          <Chip 
            label={relationshipData.text} 
            size="small"
            color={relationshipData.color as any}
            sx={{ mt: 0.5 }}
          />
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* NPC Description */}
      {npc.description && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {npc.description}
        </Typography>
      )}
      
      {/* NPC Details */}
      <List dense>
        {npc.faction && (
          <ListItem>
            <ListItemText 
              primary="Faction"
              secondary={npc.faction}
            />
          </ListItem>
        )}
        
        {npc.location && (
          <ListItem>
            <ListItemText 
              primary="Location"
              secondary={npc.location}
            />
          </ListItem>
        )}
        
        {npc.level && (
          <ListItem>
            <ListItemText 
              primary="Level"
              secondary={npc.level}
            />
          </ListItem>
        )}
      </List>
      
      {/* Services */}
      {npc.services && npc.services.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" gutterBottom>
            Services Offered
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {npc.services.map((service, index) => (
              <Chip key={index} label={service} size="small" />
            ))}
          </Box>
        </>
      )}
      
      {/* Tags */}
      {npc.tags && npc.tags.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {npc.tags.map((tag, index) => (
            <Chip 
              key={index} 
              label={tag} 
              size="small"
              variant="outlined" 
              sx={{ fontSize: '0.7rem' }}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default NPCPanel;
