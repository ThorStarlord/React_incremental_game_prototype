import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Button
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TraitAndNPCListDrawer from './TraitAndNPCListDrawer';

const TraitCard = ({ id, trait, onAcquire, essence, isAcquired, npcs, ...otherProps }) => {
  const [openList, setOpenList] = useState(false);
  
  // Find the source NPC if trait has one
  const sourceNpc = trait.sourceNpc && npcs ? 
    npcs.find(n => n.id === trait.sourceNpc) : null;
  
  // Calculate adjusted cost based on NPC power level
  const adjustedCost = sourceNpc ? 
    Math.round(trait.essenceCost * (sourceNpc.powerLevel || 1)) : 
    trait.essenceCost;

  return (
    <Card sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', ...otherProps?.sx }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">{trait.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip 
              label={trait.type || 'Basic'} 
              size="small" 
              color={trait.type === 'Social' ? 'secondary' : 'primary'}
            />
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpenList(true);
              }}
              aria-label="Show related information"
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {trait.description}
        </Typography>
        
        {/* If the trait has a source NPC, show relationship info */}
        {sourceNpc && (
          <Box sx={{ mt: 1, mb: 1 }}>
            <Typography variant="body2">
              Source: <strong>{sourceNpc.name}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Required Relationship: {trait.requiredRelationship || 0} 
              (Current: {sourceNpc.relationship || 0})
            </Typography>
          </Box>
        )}
        
        <Typography variant="body2" sx={{ mt: 'auto' }}>
          Cost: <strong>{adjustedCost}</strong> Essence
        </Typography>
      </CardContent>
      
      {/* Only show actions if onAcquire is provided */}
      {onAcquire && (
        <CardActions>
          <Button
            variant={isAcquired ? "contained" : "outlined"}
            color={isAcquired ? "success" : "primary"}
            fullWidth
            disabled={isAcquired || (essence < adjustedCost)}
            onClick={() => onAcquire(id, adjustedCost)}
          >
            {isAcquired ? "Acquired" : "Acquire"}
          </Button>
        </CardActions>
      )}
      
      {/* The list drawer */}
      <TraitAndNPCListDrawer 
        open={openList} 
        onClose={() => setOpenList(false)} 
        focusedId={id}
        sourceType="trait"
      />
    </Card>
  );
};

export default TraitCard;