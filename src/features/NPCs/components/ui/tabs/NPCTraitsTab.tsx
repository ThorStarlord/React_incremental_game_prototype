/**
 * @file NPCTraitsTab.tsx
 * @description Trait sharing and acquisition tab for NPC interactions
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Paper,
  ListItemButton,
  Stack,
} from '@mui/material';
import {
  Share as ShareIcon,
  Lock as LockIcon,
  Add as AddIcon,
  AutoAwesome as ResonateIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import {
  selectNPCById,
  shareTraitWithNPCThunk,
} from '../../../';
import {
  selectPermanentTraits,
  selectEquippedTraits,
} from '../../../../Player/state/PlayerSelectors';
import { selectTraits, selectDiscoveredTraits } from '../../../../Traits/state/TraitsSelectors';
import { selectCurrentEssence } from '../../../../Essence/state/EssenceSelectors';
import { acquireTraitWithEssenceThunk } from '../../../../Traits/state/TraitThunks';
import { TRAIT_RESONANCE } from '../../../../../constants/gameConstants';
import type { Trait } from '../../../../Traits/state/TraitsTypes';
import {
  selectBondProfileByNpcId,
  selectRelationshipMemoriesByNpcId,
  selectTraitAssimilationState,
  selectUsesRelationshipConnectionAuthority,
} from '../../../../Relationships/state/RelationshipSelectors';
import TraitSlotItem from '../../../../Traits/components/ui/TraitSlotItem';
import LockedSlotCard from '../../../../Traits/components/ui/LockedSlotCard';

interface NPCTraitsTabProps {
  npcId: string;
}

const NPCTraitsTab: React.FC<NPCTraitsTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const currentNPC = useAppSelector(state => selectNPCById(state, npcId));
  const allTraits = useAppSelector(selectTraits);
  const playerDiscoveredTraitIds = useAppSelector(selectDiscoveredTraits);
  const playerPermanentTraitIds = useAppSelector(selectPermanentTraits);
  const playerEquippedTraits = useAppSelector(selectEquippedTraits);
  const currentEssence = useAppSelector(selectCurrentEssence);
  const usesRelationshipAuthority = useAppSelector(state =>
    selectUsesRelationshipConnectionAuthority(state, npcId)
  );
  const bondProfile = useAppSelector(state => selectBondProfileByNpcId(state, npcId));
  const relationshipMemories = useAppSelector(state =>
    selectRelationshipMemoriesByNpcId(state, npcId)
  );
  const relationshipTraitStates = useAppSelector(state => {
    const result: Record<string, ReturnType<typeof selectTraitAssimilationState>> = {};
    for (const traitId of currentNPC?.availableTraits ?? []) {
      result[traitId] = selectTraitAssimilationState(state, npcId, traitId);
    }
    return result;
  });

  const [resonateDialogOpen, setResonateDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedTraitForDialog, setSelectedTraitForDialog] = useState<Trait | null>(null);
  const [targetSlotForShare, setTargetSlotForShare] = useState<number | null>(null);

  const availableTraitsForResonance = useMemo(() => {
    if (!currentNPC?.availableTraits || !allTraits) return [];
    return currentNPC.availableTraits
      .map(traitId => allTraits[traitId])
      .filter((trait): trait is Trait =>
        !!trait && !playerPermanentTraitIds.includes(trait.id)
      );
  }, [currentNPC?.availableTraits, allTraits, playerPermanentTraitIds]);

  const shareablePlayerTraits = useMemo(() => {
    const npcSharedIds = currentNPC?.sharedTraitSlots?.map(s => s.traitId).filter(Boolean) || [];
    return playerEquippedTraits.filter(t => !npcSharedIds.includes(t.id));
  }, [playerEquippedTraits, currentNPC?.sharedTraitSlots]);

  const handleOpenResonateDialog = useCallback((trait: Trait) => {
    if (!playerDiscoveredTraitIds.includes(trait.id)) return;
    setSelectedTraitForDialog(trait);
    setResonateDialogOpen(true);
  }, [playerDiscoveredTraitIds]);

  const handleConfirmResonance = useCallback(async () => {
    if (selectedTraitForDialog) {
      await dispatch(acquireTraitWithEssenceThunk({
        traitId: selectedTraitForDialog.id,
        essenceCost: selectedTraitForDialog.essenceCost || 0,
      }));
    }
    setResonateDialogOpen(false);
    setSelectedTraitForDialog(null);
  }, [dispatch, selectedTraitForDialog]);

  const handleShareClick = useCallback((slotIndex: number) => {
    setTargetSlotForShare(slotIndex);
    setShareDialogOpen(true);
  }, []);

  const handleConfirmShare = useCallback(async (traitId: string) => {
    if (targetSlotForShare !== null) {
      await dispatch(shareTraitWithNPCThunk({ npcId, traitId, slotIndex: targetSlotForShare }));
    }
    setShareDialogOpen(false);
    setTargetSlotForShare(null);
  }, [dispatch, npcId, targetSlotForShare]);

  const handleUnshare = useCallback(async (slotIndex: number) => {
    await dispatch(shareTraitWithNPCThunk({ npcId, traitId: '', slotIndex }));
  }, [dispatch, npcId]);

  if (!currentNPC) {
    return <Alert severity="warning">NPC data not available.</Alert>;
  }

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ResonateIcon sx={{ mr: 1, color: 'primary.main' }} />
              Traits for Resonance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Relationship-mediated patterns must first be discovered, then understood and assimilated before Essence can make them permanent.
            </Typography>
            <List dense>
              {availableTraitsForResonance.length > 0 ? availableTraitsForResonance.map(trait => {
                const discovered = playerDiscoveredTraitIds.includes(trait.id);

                // Discovery is a real information boundary. Before the player has
                // recognized the pattern, do not leak its identity, cost, Memory
                // requirements, or assimilation state through the Resonance UI.
                if (!discovered) {
                  return (
                    <ListItem
                      key={trait.id}
                      divider
                      secondaryAction={
                        <Button size="small" variant="outlined" disabled>
                          Undiscovered
                        </Button>
                      }
                    >
                      <ListItemText
                        primary="Undiscovered Pattern"
                        secondary="Meaningful relationship evidence may reveal a Trait pattern here."
                      />
                    </ListItem>
                  );
                }

                const canAfford = (trait.essenceCost || 0) <= currentEssence;
                const sourceNpcId = trait.sourceNpc || trait.source;
                const isRelationshipMediated =
                  usesRelationshipAuthority && sourceNpcId === npcId;

                const requiredConnection =
                  trait.minimumConnectionLevel ?? TRAIT_RESONANCE.MIN_CONNECTION_DEPTH;
                const connectionOk = isRelationshipMediated
                  ? bondProfile.connectionLevel >= requiredConnection
                  : !sourceNpcId || (currentNPC.connectionDepth ?? 0) >= TRAIT_RESONANCE.MIN_CONNECTION_DEPTH;

                const assimilation = relationshipTraitStates[trait.id];
                const requiredAssimilation = trait.assimilationThreshold ?? 100;
                const assimilationOk = !isRelationshipMediated ||
                  (assimilation?.progress ?? 0) >= requiredAssimilation;
                const requiredCompatibility = trait.minimumCompatibility ?? 0;
                const compatibilityOk = !isRelationshipMediated ||
                  (assimilation?.compatibility ?? 0) >= requiredCompatibility;
                const missingMemoryTags = isRelationshipMediated
                  ? (trait.requiredMemoryTags ?? []).filter(tag =>
                      !relationshipMemories.some(memory => memory.resonanceTags.includes(tag))
                    )
                  : [];
                const memoryOk = missingMemoryTags.length === 0;

                const canResonate =
                  canAfford &&
                  connectionOk &&
                  assimilationOk &&
                  compatibilityOk &&
                  memoryOk;

                const blockers = [
                  !connectionOk ? `Connection ${requiredConnection} required` : null,
                  !assimilationOk ? `Assimilation ${Math.floor(assimilation?.progress ?? 0)}% / ${requiredAssimilation}%` : null,
                  !compatibilityOk ? `Compatibility ${Math.floor(assimilation?.compatibility ?? 0)} / ${requiredCompatibility}` : null,
                  !memoryOk ? `Missing Memory evidence: ${missingMemoryTags.join(', ')}` : null,
                  !canAfford ? `Requires ${trait.essenceCost || 0} Essence` : null,
                ].filter(Boolean) as string[];

                return (
                  <ListItem
                    key={trait.id}
                    divider
                    secondaryAction={
                      <Tooltip title={canResonate ? 'Ready to Resonate' : blockers.join(' · ')}>
                        <span>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleOpenResonateDialog(trait)}
                            disabled={!canResonate}
                          >
                            Resonate
                          </Button>
                        </span>
                      </Tooltip>
                    }
                  >
                    <ListItemText
                      primary={trait.name}
                      secondary={
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5, pr: 2 }}>
                          <Chip size="small" label={`${trait.essenceCost || 0} Essence`} variant="outlined" />
                          {isRelationshipMediated ? (
                            <>
                              <Chip
                                size="small"
                                color={connectionOk ? 'success' : 'default'}
                                icon={connectionOk ? undefined : <LockIcon fontSize="small" />}
                                label={`Connection ${bondProfile.connectionLevel}/${requiredConnection}`}
                                variant="outlined"
                              />
                              <Chip
                                size="small"
                                color={assimilationOk ? 'success' : 'default'}
                                label={`Assimilation ${Math.floor(assimilation?.progress ?? 0)}%/${requiredAssimilation}%`}
                                variant="outlined"
                              />
                              <Chip
                                size="small"
                                color={compatibilityOk ? 'success' : 'default'}
                                label={`Compatibility ${Math.floor(assimilation?.compatibility ?? 0)}/${requiredCompatibility}`}
                                variant="outlined"
                              />
                              {(trait.requiredMemoryTags ?? []).map(tag => {
                                const satisfied = !missingMemoryTags.includes(tag);
                                return (
                                  <Chip
                                    key={tag}
                                    size="small"
                                    color={satisfied ? 'success' : 'default'}
                                    label={`Memory: ${tag}`}
                                    variant="outlined"
                                  />
                                );
                              })}
                            </>
                          ) : sourceNpcId && !connectionOk ? (
                            <Chip
                              size="small"
                              icon={<LockIcon fontSize="small" />}
                              label={`Requires depth ${TRAIT_RESONANCE.MIN_CONNECTION_DEPTH} (you: ${currentNPC.connectionDepth ?? 0})`}
                              variant="outlined"
                            />
                          ) : null}
                        </Stack>
                      }
                    />
                  </ListItem>
                );
              }) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  You have resonated with all of {currentNPC.name}'s available traits.
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ShareIcon sx={{ mr: 1, color: 'secondary.main' }} />
              Shared Trait Slots
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Share your equipped traits to empower {currentNPC.name}. Unlock more slots by increasing your relationship.
            </Typography>
            <Grid container spacing={2}>
              {currentNPC.sharedTraitSlots?.map(slot => (
                <Grid item xs={12} sm={6} key={slot.id}>
                  {slot.isUnlocked ? (
                    slot.traitId ? (
                      <TraitSlotItem
                        traitId={slot.traitId}
                        trait={allTraits[slot.traitId]}
                        onRemove={() => handleUnshare(slot.index)}
                        onMakePermanent={() => {}}
                        essence={0}
                      />
                    ) : (
                      <Button fullWidth sx={{ minHeight: 120, borderStyle: 'dashed' }} onClick={() => handleShareClick(slot.index)}>
                        <AddIcon /> Empty Slot
                      </Button>
                    )
                  ) : (
                    <LockedSlotCard slotIndex={slot.index} unlockRequirement={`Affinity: ${slot.unlockRequirement}`} />
                  )}
                </Grid>
              ))}
              {(!currentNPC.sharedTraitSlots || currentNPC.sharedTraitSlots.length === 0) && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                    {currentNPC.name} has no slots for shared traits.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={resonateDialogOpen} onClose={() => setResonateDialogOpen(false)}>
        <DialogTitle>Confirm Trait Resonance</DialogTitle>
        <DialogContent>
          <Typography>
            Spend {selectedTraitForDialog?.essenceCost || 0} Essence to stabilize the already-assimilated pattern "{selectedTraitForDialog?.name}" as a permanent Trait?
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Essence is the final stabilization cost; it does not replace the relationship, Memory, and assimilation evidence shown in the Trait card.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResonateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmResonance} variant="contained" color="primary">Confirm & Resonate</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>Share a Trait</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>Select a trait to share with {currentNPC.name}.</Typography>
          <List>
            {shareablePlayerTraits.length > 0 ? shareablePlayerTraits.map(trait => (
              <ListItem key={trait.id} disablePadding>
                <ListItemButton onClick={() => handleConfirmShare(trait.id)}>
                  <ListItemText primary={trait.name} secondary={trait.description} />
                </ListItemButton>
              </ListItem>
            )) : (
              <Typography color="text.secondary">No available traits to share.</Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default React.memo(NPCTraitsTab);
