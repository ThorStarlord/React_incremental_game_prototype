import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Chip, Divider } from '@mui/material';
import ExtensionIcon from '@mui/icons-material/Extension';
import ShareIcon from '@mui/icons-material/Share';
import GetAppIcon from '@mui/icons-material/GetApp';

import type { NPC } from '../../../state/NPCTypes';
import { useAppSelector } from '../../../../../app/hooks';

interface NPCTraitsTabProps {
  npc: NPC;
}

const NPCTraitsTab: React.FC<NPCTraitsTabProps> = ({ npc }) => {
  const playerAcquiredTraits = useAppSelector(state => state.traits.acquiredTraits);
  const allTraits = useAppSelector(state => state.traits.traits);
  const essenceAmount = useAppSelector(state => state.essence.currentEssence);

  // Get NPC's visible traits
  const npcTraits = npc.traits ? Object.values(npc.traits).filter(trait => trait.isVisible) : [];
  
  // Get traits player can share (acquired traits not already shared)
  const sharedTraitIds = npc.sharedTraitSlots?.map(slot => slot.traitId).filter(Boolean) || [];
  const shareableTraits = playerAcquiredTraits.filter(traitId => !sharedTraitIds.includes(traitId));

  const handleAcquireTrait = (traitId: string) => {
    // TODO: Implement trait acquisition logic
    console.log(`Acquiring trait ${traitId} from ${npc.name}`);
  };

  const handleShareTrait = (traitId: string) => {
    // TODO: Implement trait sharing logic
    console.log(`Sharing trait ${traitId} with ${npc.name}`);
  };

  const canAcquireTrait = (traitId: string): boolean => {
    return !playerAcquiredTraits.includes(traitId) && essenceAmount >= (allTraits[traitId]?.essenceCost || 0);
  };

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ExtensionIcon color="primary" />
        <Typography variant="h6">Trait Interaction with {npc.name}</Typography>
      </Box>

      {/* NPC's Traits - Available for Acquisition */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {npc.name}'s Traits
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            These traits can be acquired through Emotional Resonance.
          </Typography>
          
          {npcTraits.length > 0 ? (
            <Grid container spacing={2}>
              {npcTraits.map((npcTrait) => {
                const trait = allTraits[npcTrait.id];
                if (!trait) return null;

                const isAcquired = playerAcquiredTraits.includes(trait.id);
                const canAcquire = canAcquireTrait(trait.id);
                const essenceCost = trait.essenceCost || 0;

                return (
                  <Grid item xs={12} key={trait.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flexGrow: 1, mr: 2 }}>
                            <Typography variant="subtitle1">{trait.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {trait.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
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
                            {npcTrait.relationshipRequirement && (
                              <Typography variant="caption" color="text.secondary">
                                Requires relationship level {npcTrait.relationshipRequirement}+
                              </Typography>
                            )}
                          </Box>
                          
                          <Button
                            variant={isAcquired ? "outlined" : "contained"}
                            size="small"
                            startIcon={<GetAppIcon />}
                            onClick={() => handleAcquireTrait(trait.id)}
                            disabled={isAcquired || !canAcquire}
                          >
                            {isAcquired ? 'Acquired' : 'Acquire'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No traits visible from {npc.name} at your current relationship level.
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
