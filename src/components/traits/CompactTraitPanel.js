import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  Chip,
  Grid,
  Tooltip,
  IconButton,
  Paper
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import LockIcon from '@mui/icons-material/Lock';
import { GameStateContext } from '../../context/GameStateContext';
import Panel from '../ui/Panel';
import CompactTraitCard from './CompactTraitCard';

const CompactTraitPanel = ({ onExpandView }) => {
  const { player, traits: traitData } = useContext(GameStateContext);
  
  // Function to get trait object by ID
  const getTraitById = (traitId) => {
    if (!traitData?.copyableTraits || !traitId) return null;
    return { id: traitId, ...traitData.copyableTraits[traitId] };
  };
  
  // Get equipped traits
  const equippedTraits = (player?.equippedTraits || [])
    .map(id => getTraitById(id))
    .filter(Boolean)
    .slice(0, 4); // Limit display to first 4 for compact view
    
  // Get permanent traits
  const permanentTraits = (player?.permanentTraits || [])
    .map(id => getTraitById(id))
    .filter(Boolean)
    .slice(0, 2); // Limit display to first 2 for compact view
    
  // Calculate available slots
  const usedSlots = player?.equippedTraits?.length || 0;
  const totalSlots = player?.traitSlots || 0;
  
  return (
    <Panel 
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AutoFixHighIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
            <Typography variant="h6">Traits</Typography>
          </Box>
          <Chip 
            size="small"
            label={`${usedSlots}/${totalSlots}`}
            color="primary"
          />
        </Box>
      }
      action={
        <Tooltip title="Manage Traits">
          <IconButton size="small" onClick={onExpandView} edge="end">
            <OpenInFullIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      }
    >
      {/* Equipped traits section */}
      {equippedTraits.length > 0 ? (
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {equippedTraits.map((trait) => (
            <Grid item xs={6} key={trait.id}>
              <CompactTraitCard trait={trait} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No traits equipped
        </Typography>
      )}
      
      {/* Show total if there are more than shown */}
      {player?.equippedTraits?.length > 4 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          +{player.equippedTraits.length - 4} more equipped traits
        </Typography>
      )}
      
      {/* Permanent traits indicator */}
      {permanentTraits.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LockIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
          <Typography variant="body2">
            {player?.permanentTraits?.length} permanent traits active
          </Typography>
        </Box>
      )}
      
      <Button 
        variant="outlined" 
        color="secondary"
        startIcon={<AutoFixHighIcon />}
        fullWidth
        onClick={onExpandView}
        size="small"
        sx={{ mt: 1 }}
      >
        Manage Traits
      </Button>
    </Panel>
  );
};

export default CompactTraitPanel;