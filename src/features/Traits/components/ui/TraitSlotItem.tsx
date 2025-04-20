import React, { useState } from 'react';
import { Card, CardContent, CardActions, Box, Typography, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { Trait } from '../../state/TraitsTypes';
import { TRAIT_PERMANENT_ESSENCE_COST } from '../../../../constants/gameConstants';

export interface TraitSlotItemProps {
  traitId: string;
  trait: Trait | null;
  onRemove: (id: string) => void;
  onMakePermanent: (id: string) => void;
  essence: number;
}

/**
 * Presentational component for displaying a trait in a slot, with actions.
 */
const TraitSlotItem: React.FC<TraitSlotItemProps> = ({ traitId, trait, onRemove, onMakePermanent, essence }) => {
  const [showDetails, setShowDetails] = useState(false);
  const canMakePermanent = essence >= TRAIT_PERMANENT_ESSENCE_COST;

  if (!trait) return null;

  // Helper function to safely render effect values
  const renderEffectValue = (value: number | string | null | undefined | object): React.ReactNode => {
    if (typeof value === 'number') {
      return (value > 0 ? '+' : '') + (value < 1 && value > -1 ? `${value * 100}%` : value);
    } else if (typeof value === 'string') {
      return value;
    } else if (value === null || value === undefined) {
      return '';
    } else if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return '[Complex Object]';
      }
    }
    return String(value);
  };

  return (
    <>
      <Card
        sx={{
          mb: 2,
          p: 1,
          border: '1px solid',
          borderColor: 'primary.light',
          '&:hover': { boxShadow: 3 }
        }}
      >
        <CardContent sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{trait.name}</Typography>
            <Box>
              <IconButton size="small" onClick={() => setShowDetails(true)}>
                <InfoIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => onRemove(traitId)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {trait.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Tooltip 
            title={!canMakePermanent ? `Not enough essence (${TRAIT_PERMANENT_ESSENCE_COST} required)` : 'Make this trait permanent'} 
            arrow
          >
            <span style={{ width: '100%' }}>
              <Button 
                startIcon={<LockIcon />}
                variant="outlined" 
                color="secondary" 
                fullWidth 
                onClick={() => onMakePermanent(traitId)}
                disabled={!canMakePermanent}
                aria-label={`Make ${trait.name} permanent`}
              >
                Make Permanent ({TRAIT_PERMANENT_ESSENCE_COST} Essence)
              </Button>
            </span>
          </Tooltip>
        </CardActions>
      </Card>

      <Dialog open={showDetails} onClose={() => setShowDetails(false)}>
        <DialogTitle>{trait.name}</DialogTitle>
        <DialogContent>
          <Typography paragraph>{trait.description}</Typography>
          {trait.effects && (
            <Box>
              <Typography variant="subtitle1">Effects</Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {Array.isArray(trait.effects) ? (
                  trait.effects.map((effect, index) => (
                    <Typography component="li" key={`${effect.type}-${index}`} variant="body2">
                      {effect.type}: {renderEffectValue(effect.magnitude)}
                    </Typography>
                  ))
                ) : (
                  Object.entries(trait.effects).map(([key, value]) => (
                    <Typography component="li" key={key} variant="body2">
                      {key}: {renderEffectValue(value)}
                    </Typography>
                  ))
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(TraitSlotItem);
