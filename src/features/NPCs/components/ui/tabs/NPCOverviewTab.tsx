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
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button, 
  Tooltip, 
} from '@mui/material';
import {
  Assignment as QuestIcon,
  Extension as TraitIcon,
  Store as TradeIcon,
  Chat as DialogueIcon,
  Lock as LockedIcon,
  CheckCircle as CompletedIcon,
  ExpandMore as ExpandMoreIcon,
  FitnessCenter as EquipIcon, 
} from '@mui/icons-material';
import type { NPC } from '../../../state/NPCTypes';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import { 
  selectTraits, 
  selectTraitLoading,
} from '../../../../Traits/state/TraitsSelectors';
import { fetchTraitsThunk } from '../../../../Traits/state/TraitThunks';
import { 
  selectTraitSlots as selectPlayerTraitSlots, 
  selectPermanentTraits as selectPlayerPermanentTraitIds 
} from '../../../../Player/state/PlayerSelectors';
import { equipTrait as equipPlayerTraitAction } from '../../../../Player/state/PlayerSlice';
import { TraitSlot } from '../../../../Traits/state/TraitsTypes'; 

interface NPCOverviewTabProps {
  npc: NPC;
}

const NPCOverviewTab: React.FC<NPCOverviewTabProps> = ({ npc }) => {
  const dispatch = useAppDispatch();
  const allTraits = useAppSelector(selectTraits);
  const traitsLoading = useAppSelector(selectTraitLoading);
  const playerTraitSlots = useAppSelector(selectPlayerTraitSlots);
  const playerPermanentTraits = useAppSelector(selectPlayerPermanentTraitIds);

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

  const innateTraitsDisplay = useMemo(() => { 
    if (!npc.innateTraits || !allTraits) return [];
    return npc.innateTraits
      .map((traitId: string) => allTraits[traitId])
      .filter(trait => trait && trait.name);
  }, [npc.innateTraits, allTraits]);

  const handleEquipInnateTrait = useCallback((traitId: string) => {
    const emptyPlayerSlot = playerTraitSlots.find((slot: TraitSlot) => !slot.traitId && slot.isUnlocked);
    if (emptyPlayerSlot) {
      dispatch(equipPlayerTraitAction({ traitId, slotIndex: emptyPlayerSlot.index }));
    } else {
      console.warn("Cannot equip NPC innate trait: No empty player trait slot available or slot not found.");
    }
  }, [dispatch, playerTraitSlots]);


  if (traitsLoading && Object.keys(allTraits).length === 0) { 
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading traits...</Typography>
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

              {innateTraitsDisplay.length > 0 && (
                <Accordion defaultExpanded sx={{ boxShadow: 'none', '&:before': { display: 'none' }, mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="subtitle2">Innate Traits ({innateTraitsDisplay.length})</Typography></AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Traits {npc.name} possesses. You can temporarily equip these if you have a free slot.</Typography>
                    <List dense>
                      {innateTraitsDisplay.map((trait: any) => {
                        const isEquippedByPlayer = playerTraitSlots.some(slot => slot.traitId === trait.id);
                        const isPermanentForPlayer = playerPermanentTraits.includes(trait.id);
                        const hasFreePlayerSlot = playerTraitSlots.some(slot => !slot.traitId && slot.isUnlocked);
                        const canEquip = !isEquippedByPlayer && !isPermanentForPlayer && hasFreePlayerSlot;
                        let tooltipTitle = `Equip ${trait.name}`;
                        if (isEquippedByPlayer) tooltipTitle = "Already equipped by you";
                        else if (isPermanentForPlayer) tooltipTitle = "You already possess this trait permanently";
                        else if (!hasFreePlayerSlot) tooltipTitle = "No free player trait slots";

                        return (
                          <ListItem key={trait.id} sx={{ pl: 0 }}
                            secondaryAction={
                              <Tooltip title={tooltipTitle}>
                                <span>
                                  <Button size="small" variant="outlined" startIcon={<EquipIcon />} onClick={() => handleEquipInnateTrait(trait.id)} disabled={!canEquip}>Equip</Button>
                                </span>
                              </Tooltip>
                            }
                          >
                            <ListItemIcon sx={{minWidth: 'auto', mr: 1}}><TraitIcon fontSize="small" color="primary" /></ListItemIcon>
                            <ListItemText primary={trait.name || trait.id} secondary={<Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>{trait.category && (<Typography variant="caption" color="text.secondary" component="span">{trait.category}</Typography>)}{trait.rarity && (<Chip component="span" label={trait.rarity} size="small" variant="outlined" />)}</Box>} />
                          </ListItem>
                        );
                      })}
                    </List>
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
