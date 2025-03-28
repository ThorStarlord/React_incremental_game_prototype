import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Avatar, 
  Chip,
  Box,
  Button,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getRelationshipTier } from '../../../config/relationshipConstants';

/**
 * Interface for an NPC object
 */
interface NPC {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Optional portrait/image URL */
  image?: string;
  /** NPC type/profession */
  type?: string;
  /** Description of the NPC */
  description?: string;
  /** Current relationship value with player */
  relationship?: number;
  /** Location where the NPC can be found */
  location?: string;
  /** Whether this NPC has quests */
  hasQuests?: boolean;
  /** Whether this NPC can trade */
  canTrade?: boolean;
  /** Other NPC properties */
  [key: string]: any;
}

/**
 * Interface for NPCCard component props
 */
interface NPCCardProps {
  /** NPC data object */
  npc: NPC;
}

/**
 * Card component that displays information about an NPC
 * 
 * @param props - Component props
 * @returns NPC card component
 */
const NPCCard: React.FC<NPCCardProps> = ({ npc }) => {
  // Get relationship info
  const relationshipValue = npc.relationship || 0;
  const relationshipTier = getRelationshipTier(relationshipValue);

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            src={npc.image}
            alt={npc.name}
            sx={{ 
              width: 56, 
              height: 56, 
              mr: 2,
              bgcolor: relationshipTier.color
            }}
          >
            {npc.name.charAt(0)}
          </Avatar>
          
          <Box>
            <Typography variant="h6" component="h2">
              {npc.name}
            </Typography>
            
            {npc.type && (
              <Typography variant="body2" color="text.secondary">
                {npc.type}
              </Typography>
            )}
            
            <Chip 
              label={relationshipTier.name} 
              size="small" 
              sx={{ 
                mt: 0.5,
                bgcolor: relationshipTier.color,
                color: 'white'
              }}
            />
          </Box>
        </Box>
        
        {npc.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {npc.description}
          </Typography>
        )}
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {npc.location && (
            <Chip 
              label={`Location: ${npc.location}`} 
              size="small" 
              variant="outlined"
            />
          )}
          
          {npc.hasQuests && (
            <Chip 
              label="Has Quests" 
              size="small" 
              color="primary"
              variant="outlined"
            />
          )}
          
          {npc.canTrade && (
            <Chip 
              label="Trader" 
              size="small" 
              color="success"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          component={Link} 
          to={`/npc/${npc.id}`}
          fullWidth
        >
          Interact
        </Button>
      </CardActions>
    </Card>
  );
};

export default NPCCard;
