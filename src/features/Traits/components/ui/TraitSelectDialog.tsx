import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Card, CardContent, Typography } from '@mui/material';
import { Trait } from '../../state/TraitsTypes';

export interface TraitSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  traits: Trait[];
  selectedTraitId: string | null;
  setSelectedTraitId: (id: string) => void;
}

/**
 * Presentational dialog for selecting a trait to assign to a slot.
 */
const TraitSelectDialog: React.FC<TraitSelectDialogProps> = ({
  open,
  onClose,
  onConfirm,
  traits,
  selectedTraitId,
  setSelectedTraitId
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth aria-labelledby="trait-select-dialog-title">
      <DialogTitle id="trait-select-dialog-title">Select a Trait</DialogTitle>
      <DialogContent>
        {traits.length === 0 ? (
          <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
            No eligible traits available for this slot.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {traits.map(trait => (
              <Grid item xs={12} sm={6} key={trait.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedTraitId === trait.id ? '2px solid' : '1px solid',
                    borderColor: selectedTraitId === trait.id ? 'primary.main' : 'divider'
                  }}
                  onClick={() => setSelectedTraitId(trait.id)}
                  aria-selected={selectedTraitId === trait.id}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedTraitId(trait.id);
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{trait.name}</Typography>
                    <Typography variant="body2">{trait.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} disabled={!selectedTraitId} variant="contained" color="primary">
          Equip Trait
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(TraitSelectDialog);
