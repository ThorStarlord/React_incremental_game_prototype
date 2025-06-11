import React from 'react';
import { Box, Typography, Grid, Paper, Alert } from '@mui/material';
import { Trait } from '../../state/TraitTypes';
import TraitCard from './TraitCard';

interface AvailableTraitsPanelProps {
  /** Array of available trait objects that can be equipped */
  availableTraits: Trait[];
  /** Callback function when a trait is selected for equipping */
  onTraitSelect?: (traitId: string) => void;
  /** Whether traits can currently be equipped (based on available slots) */
  canEquip?: boolean;
  /** Loading state for traits data */
  loading?: boolean;
  /** Error message if traits failed to load */
  error?: string | null;
}

/**
 * AvailableTraitsPanel - Right-side panel showing all acquired but unequipped traits
 * 
 * This component displays a collection of traits that the player has acquired
 * but are not currently equipped in active slots. Traits are rendered as
 * interactive cards that can be selected for equipping.
 */
const AvailableTraitsPanel: React.FC<AvailableTraitsPanelProps> = ({
  availableTraits,
  onTraitSelect,
  canEquip = true,
  loading = false,
  error = null
}) => {
  const handleTraitClick = (traitId: string) => {
    if (onTraitSelect && canEquip) {
      onTraitSelect(traitId);
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 2, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      elevation={2}
    >
      <Typography variant="h6" gutterBottom>
        Available Traits
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {availableTraits.length} trait{availableTraits.length !== 1 ? 's' : ''} ready to equip
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      )}

      {!canEquip && availableTraits.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            No available trait slots. Unequip a trait first.
          </Typography>
        </Alert>
      )}

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {loading ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="200px"
          >
            <Typography variant="body2" color="text.secondary">
              Loading traits...
            </Typography>
          </Box>
        ) : availableTraits.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            alignItems="center" 
            height="200px"
            textAlign="center"
          >
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No traits available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Acquire traits from NPCs to see them here
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={1.5}>
            {availableTraits.map((trait) => (
              <Grid item xs={12} key={trait.id}>
                <TraitCard
                  trait={trait}
                  onClick={() => handleTraitClick(trait.id)}
                  isSelectable={canEquip}
                  variant="compact"
                  showEquipButton={false}
                  sx={{
                    cursor: canEquip ? 'pointer' : 'default',
                    opacity: canEquip ? 1 : 0.6,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': canEquip ? {
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    } : {}
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Paper>
  );
};

export default React.memo(AvailableTraitsPanel);
