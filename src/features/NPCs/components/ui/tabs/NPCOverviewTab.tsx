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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Assignment as QuestIcon,
  Extension as TraitIcon,
  Store as TradeIcon,
  Chat as DialogueIcon,
  Lock as LockedIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
// FIXED: Importing from PlayerSelectors now
import {
  selectPermanentTraits,
  selectEquippedTraits as selectEquippedTraits, // Use alias for consistency
} from '../../../../Player/state/PlayerSelectors';
// FIXED: Importing from TraitsSelectors
import {
  selectTraits,
  selectTraitLoading,
} from '../../../../Traits/state/TraitsSelectors';
import { fetchTraitsThunk } from '../../../../Traits/state/TraitThunks';
import { equipTrait } from '../../../../Player/state/PlayerSlice';
import { recalculateStatsThunk } from '../../../../Player/state/PlayerThunks';
import type { NPC } from '../../../state/NPCTypes';
import type { Trait } from '../../../../Traits/state/TraitsTypes';

interface NPCOverviewTabProps {
  npc: NPC;
}

const NPCOverviewTab: React.FC<NPCOverviewTabProps> = ({ npc }) => {
  const dispatch = useAppDispatch();

  const allTraits = useAppSelector(selectTraits);
  const traitsLoading = useAppSelector(selectTraitLoading);
  const playerEquippedTraits = useAppSelector(selectEquippedTraits);

  useEffect(() => {
    if (Object.keys(allTraits).length === 0 && !traitsLoading) {
      dispatch(fetchTraitsThunk());
    }
  }, [dispatch, allTraits, traitsLoading]);

  const isTabUnlocked = (requirement: number) => {
    return npc.relationshipValue >= requirement;
  };

  const npcInnateTraitsDisplay = useMemo(() => {
    if (!npc?.innateTraits) return [];
    return npc.innateTraits.map((traitId: string) => allTraits[traitId]).filter(Boolean) as Trait[];
  }, [npc?.innateTraits, allTraits]);

  const handleEquipNPCTrait = useCallback((traitId: string) => {
    dispatch(equipTrait({ traitId, slotIndex: -1 }));
    dispatch(recalculateStatsThunk());
  }, [dispatch]);

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
                  <ListItemText primary="Dialogue" secondary={isTabUnlocked(1) ? 'Have conversations' : `Requires Affinity: 1`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>{isTabUnlocked(2) ? <TradeIcon color="primary" /> : <LockedIcon color="disabled" />}</ListItemIcon>
                  <ListItemText primary="Trading" secondary={isTabUnlocked(2) ? 'Buy and sell items' : `Requires Affinity: 2`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>{isTabUnlocked(3) ? <QuestIcon color="primary" /> : <LockedIcon color="disabled" />}</ListItemIcon>
                  <ListItemText primary="Quests" secondary={isTabUnlocked(3) ? 'Accept and complete quests' : `Requires Affinity: 3`} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Character Information</Typography>
              <Typography variant="body2" color="text.secondary">Loyalty: {npc.loyalty || 0}/100</Typography>
              <Typography variant="body2" color="text.secondary">Connection Depth: {npc.connectionDepth?.toFixed(1) || '0.0'}</Typography>
              <Typography variant="body2" color="text.secondary">Affinity: {npc.relationshipValue || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {npcInnateTraitsDisplay.length > 0 && (
          <Grid item xs={12}>
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
                  {npcInnateTraitsDisplay.map((trait: Trait) => (
                    <Grid item xs={12} sm={6} md={4} key={trait.id}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>{trait.name}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{trait.description}</Typography>
                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip label={trait.category} size="small" color="secondary" />
                            <Chip label={trait.rarity} size="small" color="primary" />
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
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default React.memo(NPCOverviewTab);