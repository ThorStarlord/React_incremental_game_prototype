import React, { useContext, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  LinearProgress,
  IconButton,
  Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import { useGameState, useGameDispatch } from '../../../../context/index';
import Panel from '../../../../shared/components/layout/Panel';

// TraitCard component with NPC source support
const TraitCard = ({ id, trait, onAcquire, essence, isAcquired, npcs }) => {
  // Add safety check before calling find() on npcs
  const sourceNpc = trait.sourceNpc && Array.isArray(npcs) 
    ? npcs.find(n => n && n.id === trait.sourceNpc) 
    : null;
  
  // Calculate adjusted cost based on NPC power level
  const adjustedCost = Math.round(trait.essenceCost * (sourceNpc?.powerLevel || 1));
  
  // Check if trait is available based on relationship requirement
  const isAvailable = !isAcquired && (!trait.sourceNpc || 
    (sourceNpc?.relationship || 0) >= (trait.requiredRelationship || 0));
  
  // Calculate relationship progress percentage if there's a source NPC
  const relationshipProgress = sourceNpc ? 
    (sourceNpc.relationship || 0) / (trait.requiredRelationship || 1) * 100 : 0;

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      opacity: isAvailable ? 1 : 0.7
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">{trait.name}</Typography>
          <Chip 
            label={trait.type || 'Basic'} 
            size="small" 
            color={trait.type === 'Social' ? 'secondary' : 'primary'}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {trait.description}
        </Typography>
        
        {sourceNpc && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Source: {sourceNpc.name}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Relationship Required: {trait.requiredRelationship}
              </Typography>
              <Typography variant="caption" color={isAvailable ? 'success.main' : 'error.main'}>
                Current: {sourceNpc.relationship || 0}
              </Typography>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={Math.min(100, relationshipProgress)} 
              sx={{ height: 4, borderRadius: 2 }} 
              color={isAvailable ? "success" : "warning"}
            />
          </Box>
        )}
        
        <Divider sx={{ my: 1 }} />
        
        <Typography variant="body2" sx={{ mt: 1 }}>
          Cost: <strong>{adjustedCost}</strong> Essence
          {sourceNpc?.powerLevel > 1 && (
            <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
              (Base: {trait.essenceCost} × Power Level: {sourceNpc.powerLevel})
            </Typography>
          )}
        </Typography>
      </CardContent>
      
      <CardActions>
        <Button
          variant={isAcquired ? "contained" : "outlined"}
          color={isAcquired ? "success" : "primary"}
          fullWidth
          disabled={!isAvailable || essence < adjustedCost || isAcquired}
          onClick={() => onAcquire(id, adjustedCost)}
        >
          {isAcquired ? "Acquired" : isAvailable ? "Acquire" : "Locked"}
        </Button>
      </CardActions>
    </Card>
  );
};

// Main TraitList component
const TraitList = () => {
  // Ensure we have default values for all state
  const { player = {}, traits = {}, essence = 0, npcs = [] } = useGameState();
  const dispatch = useGameDispatch();
  const [filter, setFilter] = useState('all');
  
  // Make sure we have an array for player.acquiredTraits
  const acquiredTraits = player?.acquiredTraits || [];
  
  // Handle acquiring a trait
  const handleAcquireTrait = (traitId, essenceCost) => {
    dispatch({
      type: 'COPY_TRAIT',
      payload: {
        traitId,
        essenceCost
      }
    });
    
    // Show notification if you have notification system
    dispatch({
      type: 'SHOW_NOTIFICATION',
      payload: {
        message: `Acquired trait: ${traits.copyableTraits[traitId]?.name || 'New trait'}`,
        severity: 'success',
        duration: 3000
      }
    });
  };
  
  // Get traits data safely
  const copyableTraits = traits?.copyableTraits || {};
  
  // Group traits by type for filtering
  const groupedTraits = Object.entries(copyableTraits).reduce(
    (acc, [id, trait]) => {
      const type = trait.type || 'Other';
      if (!acc[type]) acc[type] = [];
      acc[type].push({ id, ...trait });
      return acc;
    },
    {}
  );
  
  // Get trait types for filter options
  const traitTypes = Object.keys(groupedTraits);
  
  // Check if there are any traits to display
  const hasTraits = Object.keys(copyableTraits).length > 0;
  
  return (
    <Panel title="Available Traits">
      {!hasTraits ? (
        <Alert severity="info">
          No traits are currently available. Continue exploring to discover new traits.
        </Alert>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', mb: 2, gap: 1, flexWrap: 'wrap' }}>
            <Button 
              variant={filter === 'all' ? 'contained' : 'outlined'} 
              size="small" 
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            {traitTypes.map(type => (
              <Button 
                key={type}
                variant={filter === type ? 'contained' : 'outlined'} 
                size="small" 
                color={type === 'Social' ? 'secondary' : 'primary'}
                onClick={() => setFilter(type)}
              >
                {type}
              </Button>
            ))}
          </Box>
          
          <Grid container spacing={2}>
            {Object.entries(copyableTraits).map(([id, trait]) => {
              // Skip if filtered by type
              if (filter !== 'all' && trait.type !== filter) return null;
              
              const isAcquired = acquiredTraits.includes(id);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={id}>
                  <TraitCard
                    id={id}
                    trait={trait}
                    onAcquire={handleAcquireTrait}
                    essence={essence}
                    isAcquired={isAcquired}
                    npcs={Array.isArray(npcs) ? npcs : []} // Ensure npcs is always an array
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Panel>
  );
};

export default TraitList;