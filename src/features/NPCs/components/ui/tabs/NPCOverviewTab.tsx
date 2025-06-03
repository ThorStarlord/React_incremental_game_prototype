/**
 * @file NPCOverviewTab.tsx
 * @description Overview tab showing basic NPC information and available interactions
 */

import React, { useEffect, useMemo } from 'react';
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
  AccordionDetails
} from '@mui/material';
import {
  Assignment as QuestIcon,
  Extension as TraitIcon,
  Store as TradeIcon,
  Chat as DialogueIcon,
  Lock as LockedIcon,
  CheckCircle as CompletedIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import type { NPC } from '../../../state/NPCTypes';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import { selectTraits, selectTraitLoading } from '../../../../Traits/state/TraitsSelectors';
import { fetchTraitsThunk } from '../../../../Traits/state/TraitThunks';

interface NPCOverviewTabProps {
  npc: NPC;
}

const NPCOverviewTab: React.FC<NPCOverviewTabProps> = ({ npc }) => {
  const dispatch = useAppDispatch();
  const allTraits = useAppSelector(selectTraits);
  const traitsLoading = useAppSelector(selectTraitLoading);

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

  // Get traits shared by the player with this NPC
  const sharedTraitsDisplay = useMemo(() => {
    if (!npc.sharedTraits || !allTraits) return [];
    
    return Object.entries(npc.sharedTraits)
      .filter(([_, npcTraitInfo]) => (npcTraitInfo as any)?.isVisible) // Type assertion to handle unknown type
      .map(([traitId, _]) => allTraits[traitId])
      .filter(trait => trait && trait.name); // Ensure trait exists and has a name
  }, [npc.sharedTraits, allTraits]);

  // Get traits available for acquisition from this NPC
  const availableTraitsDisplay = useMemo(() => {
    if (!npc.availableTraits || !allTraits) return [];
    
    return npc.availableTraits
      .map((traitId: string) => allTraits[traitId])
      .filter((trait: any) => trait && trait.name); // Ensure trait exists and has a name
  }, [npc.availableTraits, allTraits]);

  if (traitsLoading) {
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
        {/* Available Interactions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Interactions
              </Typography>
              
              <List dense>
                {/* Dialogue */}
                <ListItem>
                  <ListItemIcon>
                    {isTabUnlocked(1) ? (
                      <DialogueIcon color="primary" />
                    ) : (
                      <LockedIcon color="disabled" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Dialogue"
                    secondary={isTabUnlocked(1) ? 
                      'Have conversations' : 
                      getUnlockRequirement(1)
                    }
                  />
                  {isTabUnlocked(1) && (
                    <Chip label="Available" color="success" size="small" />
                  )}
                </ListItem>

                {/* Trading */}
                <ListItem>
                  <ListItemIcon>
                    {isTabUnlocked(2) ? (
                      <TradeIcon color="primary" />
                    ) : (
                      <LockedIcon color="disabled" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Trading"
                    secondary={isTabUnlocked(2) ? 
                      'Buy and sell items' : 
                      getUnlockRequirement(2)
                    }
                  />
                  {isTabUnlocked(2) && npc.inventory?.items?.length && (
                    <Chip label={`${npc.inventory.items.length} items`} color="info" size="small" />
                  )}
                </ListItem>

                {/* Quests */}
                <ListItem>
                  <ListItemIcon>
                    {isTabUnlocked(3) ? (
                      <QuestIcon color="primary" />
                    ) : (
                      <LockedIcon color="disabled" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Quests"
                    secondary={isTabUnlocked(3) ? 
                      'Accept and complete quests' : 
                      getUnlockRequirement(3)
                    }
                  />
                  {isTabUnlocked(3) && npc.availableQuests?.length && (
                    <Chip label={`${npc.availableQuests.length} available`} color="warning" size="small" />
                  )}
                </ListItem>

                {/* Traits */}
                <ListItem>
                  <ListItemIcon>
                    {/*
                      Ideally, TAB_CONFIG would be imported or passed down.
                      For now, assuming 'traits' tab minLevel is 0 as per recent changes.
                      If TAB_CONFIG is accessible, use:
                      const traitsTabConfig = TAB_CONFIG.find(tab => tab.id === 'traits');
                      const traitsMinLevel = traitsTabConfig ? traitsTabConfig.minLevel : 0;
                    */}
                    {isTabUnlocked(0) ? ( // Assuming traitsMinLevel is 0
                      <TraitIcon color="primary" />
                    ) : (
                      <LockedIcon color="disabled" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Trait Sharing"
                    secondary={isTabUnlocked(0) ? // Assuming traitsMinLevel is 0
                      'Share and acquire traits' : 
                      getUnlockRequirement(0) // Assuming traitsMinLevel is 0
                    }
                  />
                  {isTabUnlocked(0) && npc.availableTraits?.length && ( // Assuming traitsMinLevel is 0
                    <Chip label={`${npc.availableTraits.length} available`} color="secondary" size="small" />
                  )}
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Character Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Character Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Statistics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Loyalty: {npc.loyalty || 0}/100
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connection Depth: {npc.connectionDepth?.toFixed(1) || '0.0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Value: {npc.relationshipValue || 0}
                </Typography>
              </Box>

              {npc.personality && (npc.personality.traits?.length ?? 0) > 0 && (
                <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' }, mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">Personality Traits</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {npc.personality.traits?.map((trait: string, index: number) => (
                        <Chip
                          key={index}
                          label={trait}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Available Traits for Resonance */}
              {availableTraitsDisplay.length > 0 && (
                <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' }, mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">Available Traits for Resonance ({availableTraitsDisplay.length})</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <List dense>
                      {availableTraitsDisplay.map((trait: any) => (
                        <ListItem key={trait.id} sx={{ pl: 0 }}>
                          <ListItemIcon sx={{minWidth: 'auto', mr: 1}}>
                            <TraitIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={trait.name || trait.id}
                            secondary={
                              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {trait.category && (
                                  <Typography variant="caption" color="text.secondary" component="span">
                                    {trait.category}
                                  </Typography>
                                )}
                                {trait.rarity && (
                                  <Chip component="span" label={trait.rarity} size="small" variant="outlined" />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Shared Traits section */}
              {sharedTraitsDisplay.length > 0 && (
                <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">Shared Traits ({sharedTraitsDisplay.length})</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Traits you have shared with {npc.name}
                    </Typography>
                    <List dense>
                      {sharedTraitsDisplay.map((trait: any) => (
                        <ListItem key={trait.id} sx={{ pl: 0 }}>
                          <ListItemIcon sx={{minWidth: 'auto', mr: 1}}>
                            <TraitIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={trait.name || trait.id}
                            secondary={
                              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {trait.category && (
                                  <Typography variant="caption" color="text.secondary" component="span">
                                    {trait.category}
                                  </Typography>
                                )}
                                {trait.rarity && (
                                  <Chip component="span" label={trait.rarity} size="small" variant="outlined" />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Interaction History */}
        <Grid item xs={12}>
          <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Recent Activity</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Card>
                <CardContent>
                  {npc.lastInteraction ? (
                    <Typography variant="body2" color="text.secondary">
                      Last interaction: {new Date(npc.lastInteraction).toLocaleString()}
                    </Typography>
                  ) : (
                    <Alert severity="info" sx={{mb: npc.completedQuests && npc.completedQuests.length > 0 ? 2 : 0}}>
                      No interactions yet. Start a conversation to build your relationship!
                    </Alert>
                  )}

                  {npc.completedQuests && npc.completedQuests.length > 0 && (
                    <Box sx={{ mt: npc.lastInteraction ? 2 : 0 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Completed Quests ({npc.completedQuests.length})
                      </Typography>
                      <List dense>
                        {npc.completedQuests.map((questId: string, index: number) => (
                          <ListItem key={index} sx={{ pl: 0 }}>
                            <ListItemIcon sx={{minWidth: 'auto', mr: 1}}>
                              <CompletedIcon fontSize="small" color="success" />
                            </ListItemIcon>
                            <ListItemText primary={questId} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(NPCOverviewTab);
