import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { Trait, TraitSlot } from '../../state/TraitsTypes';
import TraitSlotItem from './TraitSlotItem';
import TraitSelectDialog from './TraitSelectDialog';
import { TRAIT_PERMANENT_ESSENCE_COST } from '../../../../constants/gameConstants';
import Panel from '../../../../shared/components/layout/Panel';

export interface TraitSlotsProps {
  slots: TraitSlot[];
  traitsData: Record<string, Trait>;
  equippedTraitIds: string[];
  permanentTraitIds: string[];
  essence: number;
  eligibleTraits: Trait[];
  isLoading: boolean;
  error: string | null;
  showSelector: boolean;
  confirmPermanent: { open: boolean; traitId: string | null };
  notification: { show: boolean; message: string; severity: 'success' | 'error' | 'info' };
  onOpenSelector: (slotId: string) => void;
  onCloseSelector: () => void;
  onSelectTrait: (traitId: string) => void;
  onConfirmAssign: () => void;
  onRemove: (traitId: string) => void;
  onMakePermanent: (traitId: string) => void;
  onConfirmPermanent: () => void;
  onCancelPermanent: () => void; // handler to close confirm dialog
  onCloseNotification: () => void;
  selectedTraitId: string | null; // selected trait when assigning
}

const TraitSlots: React.FC<TraitSlotsProps> = ({
  slots,
  traitsData,
  equippedTraitIds,
  permanentTraitIds,
  essence,
  eligibleTraits,
  isLoading,
  error,
  showSelector,
  confirmPermanent,
  notification,
  onOpenSelector,
  onCloseSelector,
  onSelectTrait,
  onConfirmAssign,
  onRemove,
  onMakePermanent,
  onConfirmPermanent,
  onCancelPermanent,
  onCloseNotification,
  selectedTraitId
}) => {
  const unlocked = slots.filter(s => s.isUnlocked);
  const empty = unlocked.filter(s => !s.traitId);

  if (isLoading) {
    return (
      <Panel title="Trait Slots">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, height: 200 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }} color="text.secondary">Loading Trait Data...</Typography>
        </Box>
      </Panel>
    );
  }
  if (error) {
    return (
      <Panel title="Trait Slots">
        <Alert severity="error" sx={{ m: 1 }}>Error loading Trait Data: {error}</Alert>
      </Panel>
    );
  }

  return (
    <Panel title="Trait Slots">
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography>Available Slots: {empty.length}/{unlocked.length}</Typography>
          <Typography color="secondary">Permanent Traits: {permanentTraitIds.length}</Typography>
        </Box>

        {permanentTraitIds.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Permanent Traits</Typography>
            <Grid container spacing={2}>
              {permanentTraitIds.map(id => {
                const t = traitsData[id]; if (!t) return null;
                return (
                  <Grid item key={id} xs={12} sm={6} md={4}>
                    <Card sx={{ border: '2px solid', borderColor: 'secondary.main' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>{t.name}</Typography><LockIcon color="secondary" />
                        </Box>
                        <Typography variant="body2">{t.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        <Typography variant="h6" sx={{ mb: 1 }}>Equipped Traits</Typography>
        {equippedTraitIds.length > 0 ? (
          equippedTraitIds.map(id => (
            <TraitSlotItem
              key={id}
              traitId={id}
              trait={traitsData[id] ? { ...traitsData[id], id } : null}
              onRemove={onRemove}
              onMakePermanent={onMakePermanent}
              essence={essence}
            />
          ))
        ) : (
          <Typography color="text.secondary" align="center">No traits equipped.</Typography>
        )}

        {empty.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography>Empty Slots: {empty.length}</Typography>
            <Grid container spacing={1}>
              {empty.map(s => (
                <Grid item key={s.id} xs={12} sm={6} md={4}>
                  <Box
                    sx={{ p: 2, border: '1px dashed', borderColor: 'grey.400', borderRadius: 1, textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => onOpenSelector(s.id)}
                  >Assign Trait</Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      <TraitSelectDialog
        open={showSelector}
        onClose={onCloseSelector}
        onConfirm={onConfirmAssign}
        traits={eligibleTraits}
        selectedTraitId={selectedTraitId}
        setSelectedTraitId={onSelectTrait}
      />

      <Dialog open={confirmPermanent.open} onClose={onCancelPermanent}>
        <DialogTitle>Make Trait Permanent?</DialogTitle>
        <DialogContent><Typography>This will cost {TRAIT_PERMANENT_ESSENCE_COST} Essence.</Typography></DialogContent>
        <DialogActions>
          <Button onClick={onConfirmPermanent}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notification.show} autoHideDuration={3000} onClose={onCloseNotification}>
        <Alert severity={notification.severity} variant="filled" onClose={onCloseNotification}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Panel>
  );
};

export default React.memo(TraitSlots);
