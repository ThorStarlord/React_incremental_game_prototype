import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TaskIcon from '@mui/icons-material/Task';
import StarIcon from '@mui/icons-material/Star';

/**
 * RelationshipBenefits - Displays the benefits available at each relationship tier
 * 
 * @param {Object} props
 * @param {string} props.relationshipTier - The current relationship tier with the NPC
 * @returns {JSX.Element} Component showing relationship benefits
 */
const RelationshipBenefits = ({ relationshipTier }) => {
  // Define the relationship tiers and their benefits
  const tiers = [
    {
      name: 'Stranger',
      minValue: 0,
      icon: <ChatIcon fontSize="small" />,
      benefit: 'Basic dialogue'
    },
    {
      name: 'Acquaintance',
      minValue: 25,
      icon: <FavoriteIcon fontSize="small" />,
      benefit: 'Relationship activities'
    },
    {
      name: 'Friend',
      minValue: 50,
      icon: <ShoppingCartIcon fontSize="small" />,
      benefit: 'Trading'
    },
    {
      name: 'Close Friend',
      minValue: 75,
      icon: <TaskIcon fontSize="small" />,
      benefit: 'Quests'
    },
    {
      name: 'Trusted Ally',
      minValue: 100,
      icon: <StarIcon fontSize="small" />,
      benefit: 'Special interactions'
    }
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.7 }}>
        Relationship Tier Benefits
      </Typography>
      
      <Grid container spacing={1}>
        {tiers.map((tier) => {
          const isCurrentTier = relationshipTier === tier.name;
          const isUnlocked = tiers.findIndex(t => t.name === relationshipTier) >= 
                             tiers.findIndex(t => t.name === tier.name);
          
          return (
            <Grid item xs={2.4} key={tier.name}>
              <Paper 
                elevation={isCurrentTier ? 2 : 0}
                sx={{
                  p: 1,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCurrentTier ? 'primary.light' : 'background.paper',
                  border: 1,
                  borderColor: isCurrentTier ? 'primary.main' : 'divider',
                  opacity: isUnlocked ? 1 : 0.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: isCurrentTier ? 'primary.light' : 'background.default',
                  }
                }}
              >
                <Box sx={{ mb: 0.5 }}>
                  {tier.icon}
                </Box>
                <Typography variant="caption" sx={{ fontWeight: isCurrentTier ? 'bold' : 'normal' }}>
                  {tier.name}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block' }}>
                  {tier.benefit}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default RelationshipBenefits;
