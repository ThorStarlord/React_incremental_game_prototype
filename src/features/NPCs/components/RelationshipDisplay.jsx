import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, LinearProgress, Tooltip, Paper, Avatar, Divider } from '@mui/material';
import { getRelationshipTier } from '../../../config/relationshipConstants';
import Icon from '@mui/material/Icon';

/**
 * RelationshipDisplay Component
 * 
 * Displays the relationship status between the player and an NPC
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.npc - NPC object containing information about the NPC
 * @param {string} props.npc.id - Unique identifier for the NPC
 * @param {string} props.npc.name - Name of the NPC
 * @param {number} props.npc.relationship - Relationship value with the player (-100 to 100)
 * @param {string} [props.npc.title] - Optional title of the NPC
 * @returns {React.Component} A component displaying the relationship with an NPC
 * 
 * @example
 * const npc = { id: 'merchant', name: 'Eliza', relationship: 75, title: 'Merchant' };
 * return <RelationshipDisplay npc={npc} />;
 */
const RelationshipDisplay = ({ npc }) => {
  const relationship = npc.relationship || 0;
  const tier = getRelationshipTier(relationship);
  
  return (
    <Paper elevation={1} sx={{ p: 1.5, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar 
        src={npc.avatar || `https://api.dicebear.com/6.x/personas/svg?seed=${npc.id}`} 
        sx={{ width: 40, height: 40 }} 
      />
      
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">{npc.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon sx={{ color: tier.color, fontSize: 18, mr: 0.5 }}>
              {tier.icon}
            </Icon>
            <Typography variant="body2" sx={{ color: tier.color }}>
              {tier.name}
            </Typography>
          </Box>
        </Box>
        
        <Tooltip 
          title={
            <React.Fragment>
              <Typography variant="body2">{relationship}/100</Typography>
              <Divider sx={{ my: 1 }} />
              {tier.benefits.map((benefit, i) => (
                <Typography key={i} variant="caption" display="block">• {benefit}</Typography>
              ))}
            </React.Fragment>
          }
        >
          <LinearProgress 
            variant="determinate" 
            value={Math.max(0, relationship + 100) / 2} // Scale from -100..100 to 0..100
            sx={{ 
              height: 6, 
              borderRadius: 1,
              mt: 0.5,
              bgcolor: relationship < 0 ? 'rgba(244, 67, 54, 0.2)' : 'rgba(76, 175, 80, 0.2)',
              '& .MuiLinearProgress-bar': {
                bgcolor: tier.color
              }
            }} 
          />
        </Tooltip>
      </Box>
    </Paper>
  );
};

RelationshipDisplay.propTypes = {
  /**
   * NPC object containing all necessary information
   */
  npc: PropTypes.shape({
    /** Unique identifier for the NPC */
    id: PropTypes.string.isRequired,
    /** Name of the NPC */
    name: PropTypes.string.isRequired,
    /** Relationship value between player and NPC (-100 to 100) */
    relationship: PropTypes.number,
    /** Optional title or role of the NPC */
    title: PropTypes.string
  }).isRequired,
};

export default RelationshipDisplay;