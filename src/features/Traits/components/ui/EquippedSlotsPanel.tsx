import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { TraitSlot } from '../../state/TraitsTypes';
import { Trait } from '../../state/TraitsTypes';
import TraitCard from './TraitCard';
import EmptySlotCard from './EmptySlotCard';
import LockedSlotCard from './LockedSlotCard';

interface EquippedSlotsPanelProps {
  slots: TraitSlot[];
  equippedTraits: Record<string, Trait>;
  onSlotClick: (slotIndex: number, traitId: string | null) => void;
  onTraitUnequip: (slotIndex: number, traitId: string) => void;
  className?: string;
}

/**
 * Left-side panel displaying the grid of player trait slots.
 */
export const EquippedSlotsPanel: React.FC<EquippedSlotsPanelProps> = React.memo(({
  slots,
  equippedTraits,
  onSlotClick,
  onTraitUnequip,
  className
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSlotClick = React.useCallback((slot: TraitSlot) => {
    // FIXED: Use correct property `slotIndex`
    onSlotClick(slot.slotIndex, slot.traitId);
  }, [onSlotClick]);

  const handleTraitUnequip = React.useCallback((slotIndex: number, traitId: string) => {
    onTraitUnequip(slotIndex, traitId);
  }, [onTraitUnequip]);

  const renderSlot = React.useCallback((slot: TraitSlot) => {
    // FIXED: Use correct properties `slotIndex` and `isLocked`
    const { slotIndex, traitId, isLocked, unlockRequirement } = slot;

    if (isLocked) {
      return (
        <LockedSlotCard
          key={`slot-${slotIndex}`}
          slotIndex={slotIndex}
          unlockRequirement={unlockRequirement}
        />
      );
    }

    if (traitId && equippedTraits[traitId]) {
      const trait = equippedTraits[traitId];
      return (
        // FIXED: Using the correct `onUnequip` prop for the action button
        <TraitCard
          key={`slot-${slotIndex}-${traitId}`}
          trait={trait}
          onUnequip={() => handleTraitUnequip(slotIndex, traitId)}
          showUnequipButton={true}
          currentEssence={0} // Not needed for this action
        />
      );
    }

    return (
      // FIXED: Removed non-existent `onAction` prop
      <Box sx={{ width: '100%', height: '100%', cursor: 'pointer' }} onClick={() => handleSlotClick(slot)}>
        <EmptySlotCard />
      </Box>
    );
  }, [equippedTraits, handleSlotClick, handleTraitUnequip]);

  return (
    <Paper
      className={className}
      sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'background.paper' }}
      elevation={1}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
          Equipped Traits
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click slots to equip/unequip traits
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Grid container spacing={isMobile ? 1 : 2} sx={{ '& .MuiGrid-item': { display: 'flex' } }}>
          {slots.map((slot) => (
            // FIXED: Using correct property `slotIndex` for the key
            <Grid item xs={6} sm={4} md={6} lg={4} key={`grid-${slot.slotIndex}`}>
              {renderSlot(slot)}
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" component="div">
          {/* FIXED: Using correct property `isLocked` */}
          Slots: {slots.filter(s => s.traitId && !s.isLocked).length} / {slots.filter(s => !s.isLocked).length} equipped
        </Typography>
        {slots.some(s => s.isLocked) && (
          <Typography variant="caption" color="text.secondary" component="div">
            {slots.filter(s => s.isLocked).length} slots locked
          </Typography>
        )}
      </Box>
    </Paper>
  );
});

EquippedSlotsPanel.displayName = 'EquippedSlotsPanel';

export default EquippedSlotsPanel;