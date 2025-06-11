/**
 * @file NPCOverviewTab.tsx
 * @description Overview tab showing basic NPC information and available interactions
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Tooltip,
  Alert,
  AlertTitle,
  Grid,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Assignment as QuestIcon,
  Extension as TraitIcon,
  Store as TradeIcon,
  Chat as DialogueIcon,
  Lock as LockedIcon,
  CheckCircle as CompletedIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Psychology as PsychologyIcon,
  Share as ShareIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import {
  selectTraits,
  selectTraitLoading,
} from '../../../../Traits/state/TraitsSelectors';
import { fetchTraitsThunk } from '../../../../Traits/state/TraitThunks';
import {
  selectPermanentTraits as selectPlayerPermanentTraitIds
} from '../../../../Player/state/PlayerSelectors';
import {
  selectSelectedNPCId,
  selectNPCById
} from '../../../state/NPCSelectors';
import { equipTrait } from '../../../../Traits/state/TraitsSlice'; // Updated import
import { recalculateStatsThunk } from '../../../../Player/state/PlayerThunks';
import type { NPCTraitInfo } from '../../../state/NPCTypes';

interface NPCOverviewTabProps {
  npc: NPC;
}

const NPCOverviewTab: React.FC<NPCOverviewTabProps> = ({ npc }) => {
  const dispatch = useAppDispatch();
  const selectedNPCId = useAppSelector(selectSelectedNPCId);
  const allTraits = useAppSelector(selectTraits);
  const traitsLoading = useAppSelector(selectTraitLoading);
  const playerPermanentTraits = useAppSelector(selectPlayerPermanentTraitIds);
  const playerEquippedTraits = useAppSelector(state => state.player.traits); // Assuming this is how equipped traits are accessed

  useEffect(() => {
    if (Object.keys(allTraits).length === 0 && !traitsLoading) {
      dispatch(fetchTraitsThunk());
    }
  }, [dispatch, allTraits, traitsLoading]);

  const getUnlockRequirement = (level: number) => {
    return `Requires relationship level ${level}+`;
  };

  const isTabUnlocked = (requirement: number) => {
    return npc.relationshipValue >= requirement;
  };

  const sharedTraitsDisplay = useMemo(() => {
    if (!npc.sharedTraits || !allTraits) return [];
    return Object.entries(npc.sharedTraits)
      .filter(([_, npcTraitInfo]) => (npcTraitInfo as any)?.isVisible)
      .map(([traitId, _]) => allTraits[traitId])
      .filter(trait => trait && trait.name);
  }, [npc.sharedTraits, allTraits]);

  const availableTraitsDisplay = useMemo(() => {
    if (!npc.availableTraits || !allTraits) return [];
    return npc.availableTraits
      .map((traitId: string) => allTraits[traitId])
      .filter((trait: any) => trait && trait.name);
  }, [npc.availableTraits, allTraits]);

  // Get available traits (traits the player can acquire from this NPC)
  const availableTraitsForResonance = useMemo(() => {
    if (!npc?.availableTraits) return [];
    return npc.availableTraits.map(traitId => allTraits[traitId]).filter(Boolean);
  }, [npc?.availableTraits, allTraits]);

  // Get NPC's innate traits for display (from availableTraits since traits property doesn't exist)
  const npcInnateTraitsDisplay = npc?.availableTraits
    ? npc.availableTraits.map(traitId => {
        const trait = allTraits[traitId];
        return trait ? {
          id: traitId,
          name: trait.name,
          description: trait.description,
          category: trait.category,
          rarity: trait.rarity
        } : null;
      }).filter(Boolean)
    : [];

  const handleEquipInnateTraitToPlayer = useCallback((traitId: string) => {
    // TODO: Implement trait equipping when the action is available
    // For now, show a placeholder message
    console.log(`Equipping trait ${traitId} to player - functionality pending`);

    // When the correct action is available, it might look like:
    // dispatch(equipTraitToPlayer({ traitId, slotIndex: availableSlotIndex }));
  }, []);

  // Handle equipping an NPC's innate trait to player's slot
  const handleEquipNPCTrait = useCallback((traitId: string) => {
    // Check if player has available trait slots
    const usedSlots = playerEquippedTraits.length;
    const maxSlots = 6; // Standard trait slot count
    
    if (usedSlots < maxSlots) {
      dispatch(equipTrait({ traitId, slotIndex: -1 })); // -1 indicates auto-assign to next available slot
      dispatch(recalculateStatsThunk());
    }
  }, [dispatch, playerEquippedTraits]);

  if (traitsLoading && Object.keys(allTraits).length === 0) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading traits...</Typography>
      </Box>
    );
  }

  // If no NPC is found, show error state
  if (!npc) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6">
          NPC not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Available Interactions</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>{isTabUnlocked(1) ? <DialogueIcon color="primary" /> : <LockedIcon color="disabled" />}</ListItemIcon>
                  <ListItemText primary="Dialogue" secondary={isTabUnlocked(1) ? 'Have conversations' : getUnlockRequirement(1)} />
                  {isTabUnlocked(1) && <Chip label="Available" color="success" size="small" />}
                </ListItem>
                <ListItem>
                  <ListItemIcon>{isTabUnlocked(2) ? <TradeIcon color="primary" /> : <LockedIcon color="disabled" />}</ListItemIcon>
                  <ListItemText primary="Trading" secondary={isTabUnlocked(2) ? 'Buy and sell items' : getUnlockRequirement(2)} />
                  {isTabUnlocked(2) && npc.inventory?.items?.length && <Chip label={`${npc.inventory.items.length} items`} color="info" size="small" />}
                </ListItem>
                <ListItem>
                  <ListItemIcon>{isTabUnlocked(3) ? <QuestIcon color="primary" /> : <LockedIcon color="disabled" />}</ListItemIcon>
                  <ListItemText primary="Quests" secondary={isTabUnlocked(3) ? 'Accept and complete quests' : getUnlockRequirement(3)} />
                  {isTabUnlocked(3) && npc.availableQuests?.length && <Chip label={`${npc.availableQuests.length} available`} color="warning" size="small" />}
                </ListItem>
                <ListItem>
                  <ListItemIcon>{isTabUnlocked(0) ? <TraitIcon color="primary" /> : <LockedIcon color="disabled" />}</ListItemIcon>
                  <ListItemText primary="Trait Interaction" secondary={isTabUnlocked(0) ? 'Resonate, share, or equip traits' : getUnlockRequirement(0)} />
                  {isTabUnlocked(0) && (npc.availableTraits?.length || npc.innateTraits?.length) && <Chip label="Traits" color="secondary" size="small" />}
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Character Information</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Statistics</Typography>
                <Typography variant="body2" color="text.secondary">Loyalty: {npc.loyalty || 0}/100</Typography>
                <Typography variant="body2" color="text.secondary">Connection Depth: {npc.connectionDepth?.toFixed(1) || '0.0'}</Typography>
                <Typography variant="body2" color="text.secondary">Affinity: {npc.relationshipValue || 0}</Typography>
              </Box>

              {npc.personality && npc.personality.traits && npc.personality.traits.length > 0 && (
                <Accordion defaultExpanded sx={{ boxShadow: 'none', '&:before': { display: 'none' }, mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="subtitle2">Personality Traits</Typography></AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}><Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {npc.personality?.traits?.map((trait: string, index: number) => (<Chip key={index} label={trait} size="small" variant="outlined" />))}
                  </Box></AccordionDetails>
                </Accordion>
              )}

              {/* NPC's Innate Traits Section */}
              {npcInnateTraitsDisplay.length > 0 && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      <StarIcon sx={{ mr: 1, color: 'primary.main' }} />
                      NPC's Innate Traits ({npcInnateTraitsDisplay.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      These are traits this NPC naturally possesses. You can temporarily equip them to your character.
                    </Typography>
                    <Grid container spacing={2}>
                      {npcInnateTraitsDisplay.map((trait) => (
                        <Grid item xs={12} sm={6} md={4} key={trait.id}>
                          <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                {trait.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {trait.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Chip 
                                  label={trait.category} 
                                  size="small" 
                                  color="secondary"
                                />
                                <Chip 
                                  label={trait.rarity} 
                                  size="small" 
                                  color="primary"
                                />
                              </Box>
                              <Button
                                variant="outlined"
                                size="small"
                                fullWidth
                                onClick={() => handleEquipNPCTrait(trait.id)}
                                disabled={playerEquippedTraits.length >= 6 || playerEquippedTraits.some(t => t.id === trait.id)}
                              >
                                {playerEquippedTraits.some(t => t.id === trait.id) ? 'Already Equipped' : 'Equip Trait'}
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              )}

              {availableTraitsDisplay.length > 0 && (
                <Accordion defaultExpanded sx={{ boxShadow: 'none', '&:before': { display: 'none' }, mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="subtitle2">Traits for Resonance ({availableTraitsDisplay.length})</Typography></AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}><List dense>{availableTraitsDisplay.map((trait: any) => (<ListItem key={trait.id} sx={{ pl: 0 }}><ListItemIcon sx={{minWidth: 'auto', mr: 1}}><TraitIcon fontSize="small" color="secondary" /></ListItemIcon><ListItemText primary={trait.name || trait.id} secondary={<Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>{trait.category && (<Typography variant="caption" color="text.secondary" component="span">{trait.category}</Typography>)}{trait.rarity && (<Chip component="span" label={trait.rarity} size="small" variant="outlined" />)}</Box>} /></ListItem>))}</List></AccordionDetails>
                </Accordion>
              )}

              {sharedTraitsDisplay.length > 0 && (
                <Accordion defaultExpanded sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="subtitle2">Shared Traits ({sharedTraitsDisplay.length})</Typography></AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}><Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Traits you have shared with {npc.name}</Typography><List dense>{sharedTraitsDisplay.map((trait: any) => (<ListItem key={trait.id} sx={{ pl: 0 }}><ListItemIcon sx={{minWidth: 'auto', mr: 1}}><TraitIcon fontSize="small" color="success" /></ListItemIcon><ListItemText primary={trait.name || trait.id} secondary={<Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>{trait.category && (<Typography variant="caption" color="text.secondary" component="span">{trait.category}</Typography>)}{trait.rarity && (<Chip component="span" label={trait.rarity} size="small" variant="outlined" />)}</Box>} /></ListItem>))}</List></AccordionDetails>
                </Accordion>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Accordion defaultExpanded sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Recent Activity</Typography></AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}><Card><CardContent>{npc.lastInteraction ? (<Typography variant="body2" color="text.secondary">Last interaction: {new Date(npc.lastInteraction).toLocaleString()}</Typography>) : (<Alert severity="info" sx={{mb: npc.completedQuests?.length > 0 ? 2 : 0}}>No interactions yet.</Alert>)}{npc.completedQuests?.length > 0 && (<Box sx={{ mt: npc.lastInteraction ? 2 : 0 }}><Typography variant="subtitle2" gutterBottom>Completed Quests ({npc.completedQuests.length})</Typography><List dense>{npc.completedQuests.map((questId: string, index: number) => (<ListItem key={index} sx={{ pl: 0 }}><ListItemIcon sx={{minWidth: 'auto', mr: 1}}><CompletedIcon fontSize="small" color="success" /></ListItemIcon><ListItemText primary={questId} /></ListItem>))}</List></Box>)}</CardContent></Card></AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(NPCOverviewTab);
