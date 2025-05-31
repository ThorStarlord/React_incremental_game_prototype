import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Chip, Divider, Tooltip } from '@mui/material'; // Added Tooltip
import ExtensionIcon from '@mui/icons-material/Extension';
import ShareIcon from '@mui/icons-material/Share';
import GetAppIcon from '@mui/icons-material/GetApp';

import type { NPC } from '../../../state/NPCTypes';
import type { Trait } from '../../../../Traits/state/TraitsTypes';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import { discoverTrait } from '../../../../Traits/state/TraitsSlice';
import { acquireTraitWithEssenceThunk } from '../../../../Traits/state/TraitThunks'; // Import the thunk
import VisibilityIcon from '@mui/icons-material/Visibility';

interface NPCTraitsTabProps {
  npc: NPC;
}

const NPCTraitsTab: React.FC<NPCTraitsTabProps> = ({ npc }) => {
  const dispatch = useAppDispatch(); // Added dispatch
  const playerAcquiredTraits = useAppSelector(state => state.traits.acquiredTraits);
  const playerDiscoveredTraits = useAppSelector(state => state.traits.discoveredTraits); // Added discoveredTraits
  const allTraits = useAppSelector(state => state.traits.traits);
  const essenceAmount = useAppSelector(state => state.essence.currentEssence);
  const playerRelationshipWithNPC = npc.relationshipValue; // Get current relationship value

  // Get NPC's teachable traits and their full details
  const teachableTraitsDetails = React.useMemo(() => {
    if (!npc.teachableTraits || !allTraits) {
      return [];
    }
    return npc.teachableTraits
      .map(traitId => allTraits[traitId])
      .filter(trait => trait !== undefined); // Filter out undefined if a traitId is not in allTraits
  }, [npc.teachableTraits, allTraits]);
  
  // Get traits player can share (acquired traits not already shared)
  const sharedTraitIds = npc.sharedTraitSlots?.map(slot => slot.traitId).filter(Boolean) || [];
  const shareableTraits = playerAcquiredTraits.filter(traitId => !sharedTraitIds.includes(traitId));

  const handleAcquireTrait = (traitId: string) => {
    dispatch(acquireTraitWithEssenceThunk(traitId));
  };

  const handleDiscoverTrait = (traitId: string) => {
    dispatch(discoverTrait(traitId));
    console.log(`Attempting to discover trait ${traitId} from ${npc.name}`);
  };

  const handleShareTrait = (traitId: string) => {
    // TODO: Dispatch actual shareTraitWithNPCThunk 
    console.log(`Attempting to share trait ${traitId} with ${npc.name}`);
  };

  // Updated canPlayerAcquireTrait to check all conditions
  const canPlayerAcquireTrait = (trait: Trait): boolean => {
    if (!playerDiscoveredTraits.includes(trait.id)) return false; // Must be discovered first
    if (playerAcquiredTraits.includes(trait.id)) return false; // Already acquired

    const relationshipReq = trait.requirements?.relationshipLevel;
    if (relationshipReq && playerRelationshipWithNPC < relationshipReq) return false; // Relationship too low

    const prerequisiteTraitsReq = trait.requirements?.prerequisiteTraits;
    if (prerequisiteTraitsReq && prerequisiteTraitsReq.length > 0) {
      if (!prerequisiteTraitsReq.every(reqId => playerAcquiredTraits.includes(reqId))) {
        return false; // Missing prerequisite traits
      }
    }
    
    // Check essence cost
    return essenceAmount >= (trait.essenceCost || 0);
  };

  const getLearnButtonTooltip = (trait: Trait, canAcquireNow: boolean, isAcquiredByPlayer: boolean): string => {
    if (isAcquiredByPlayer) return "Already acquired";
    if (!canAcquireNow) {
      const relationshipReq = trait.requirements?.relationshipLevel;
      if (relationshipReq && playerRelationshipWithNPC < relationshipReq) {
        return `Requires Relationship Level ${relationshipReq}`;
      }
      const prerequisiteTraitsReq = trait.requirements?.prerequisiteTraits;
      if (prerequisiteTraitsReq && prerequisiteTraitsReq.length > 0) {
        const missingPrerequisites = prerequisiteTraitsReq.filter(reqId => !playerAcquiredTraits.includes(reqId));
        if (missingPrerequisites.length > 0) {
          return `Requires traits: ${missingPrerequisites.map(id => allTraits[id]?.name || id).join(', ')}`;
        }
      }
      if (essenceAmount < (trait.essenceCost || 0)) {
        return `Requires ${trait.essenceCost || 0} Essence`;
      }
      return "Cannot acquire yet"; // Generic fallback
    }
    return "Learn this trait";
  };

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ExtensionIcon color="primary" />
        <Typography variant="h6">Trait Interaction with {npc.name}</Typography>
      </Box>

      {/* NPC's Teachable Traits */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Traits {npc.name} Can Teach
          </Typography>
          
          {teachableTraitsDetails.length > 0 ? (
            <Grid container spacing={2}>
              {teachableTraitsDetails.map((trait) => {
                const isDiscoveredByPlayer = playerDiscoveredTraits.includes(trait.id);
                const isAcquiredByPlayer = playerAcquiredTraits.includes(trait.id);
                const canAcquireNow = canPlayerAcquireTrait(trait); // This now implies discovered
                const essenceCost = trait.essenceCost || 0;
                const relationshipReq = trait.requirements?.relationshipLevel;
                const prerequisiteTraitsReq = trait.requirements?.prerequisiteTraits;

                return (
                  <Grid item xs={12} md={6} key={trait.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flexGrow: 1, mr: 2 }}>
                            <Typography variant="subtitle1">{trait.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {trait.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
                              <Chip label={trait.category} size="small" variant="outlined" />
                              <Chip label={trait.rarity} size="small" color="secondary" />
                              {essenceCost > 0 && (
                                <Chip 
                                  label={`${essenceCost} Essence`} 
                                  size="small" 
                                  color={essenceAmount >= essenceCost ? 'success' : 'error'}
                                />
                              )}
                            </Box>
                            {relationshipReq && (
                              <Typography variant="caption" color={playerRelationshipWithNPC >= relationshipReq ? 'success.main' : 'error.main'}>
                                Requires Relationship: {relationshipReq} (Current: {playerRelationshipWithNPC})
                              </Typography>
                            )}
                            {prerequisiteTraitsReq && prerequisiteTraitsReq.length > 0 && (
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Requires Traits: {prerequisiteTraitsReq.map(id => allTraits[id]?.name || id).join(', ')}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          
                          {isDiscoveredByPlayer ? (
                            <Tooltip title={getLearnButtonTooltip(trait, canAcquireNow, isAcquiredByPlayer)}>
                              <span> {/* Tooltip needs a span wrapper for disabled buttons */}
                                <Button
                                  variant={isAcquiredByPlayer ? "outlined" : "contained"}
                                  size="small"
                                  startIcon={<GetAppIcon />}
                                  onClick={() => handleAcquireTrait(trait.id)}
                                  disabled={isAcquiredByPlayer || !canAcquireNow}
                                >
                                  {isAcquiredByPlayer ? 'Acquired' : 'Learn'}
                                </Button>
                              </span>
                            </Tooltip>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleDiscoverTrait(trait.id)}
                              // TODO: Add conditions for enabling Observe button, e.g., relationship level
                            >
                              Observe
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {npc.name} has no traits to teach you at this time, or you do not meet the requirements to see them.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }} />

      {/* Shared Trait Slots */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Shared Trait Slots
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Share your acquired traits with {npc.name} to strengthen your connection.
          </Typography>
          
          {npc.sharedTraitSlots && npc.sharedTraitSlots.length > 0 ? (
            <Grid container spacing={2}>
              {npc.sharedTraitSlots.map((slot) => (
                <Grid item xs={12} sm={6} key={slot.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Slot {slot.index + 1}
                      </Typography>
                      {slot.traitId ? (
                        <Box>
                          <Typography variant="body2">
                            {allTraits[slot.traitId]?.name || slot.traitId}
                          </Typography>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleShareTrait('')} // Empty string to unshare
                            sx={{ mt: 1 }}
                          >
                            Remove
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Empty slot
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No shared trait slots available. Improve your relationship to unlock trait sharing.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Available Traits to Share */}
      {shareableTraits.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Traits Available to Share
            </Typography>
            
            <Grid container spacing={1}>
              {shareableTraits.map((traitId) => {
                const trait = allTraits[traitId];
                if (!trait) return null;

                return (
                  <Grid item key={traitId}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ShareIcon />}
                      onClick={() => handleShareTrait(traitId)}
                    >
                      {trait.name}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default React.memo(NPCTraitsTab);
