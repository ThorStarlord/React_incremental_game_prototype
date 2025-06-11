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
 * Provides click-based interaction for equipping/unequipping traits.
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
    onSlotClick(slot.index, slot.traitId);
  }, [onSlotClick]);

  const handleTraitUnequip = React.useCallback((slotIndex: number, traitId: string) => {
    onTraitUnequip(slotIndex, traitId);
  }, [onTraitUnequip]);

  const renderSlot = React.useCallback((slot: TraitSlot) => {
    const { index, traitId, isUnlocked, unlockRequirement } = slot;

    // Locked slot
    if (!isUnlocked) {
      return (
        <LockedSlotCard
          key={`slot-${index}`}
          slotIndex={index}
          unlockRequirement={unlockRequirement}
        />
      );
    }

    // Equipped slot with trait
    if (traitId && equippedTraits[traitId]) {
      const trait = equippedTraits[traitId];
      return (
        <TraitCard
          key={`slot-${index}-${traitId}`}
          trait={trait}
          onClick={() => handleTraitUnequip(index, traitId)}
          isEquipped={true}
          isPermanent={false}
        />
      );
    }

    // Empty unlocked slot
    return (
      <EmptySlotCard
        key={`slot-${index}`}
        onAction={() => handleSlotClick(slot)}
      />
    );
  }, [equippedTraits, handleSlotClick, handleTraitUnequip]);

  return (
    <Paper
      className={className}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper'
      }}
      elevation={1}
    >
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            mb: 0.5
          }}
        >
          Equipped Traits
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
        >
          Click slots to equip/unequip traits
        </Typography>
      </Box>

      {/* Slots Grid */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Grid 
          container 
          spacing={isMobile ? 1 : 2}
          sx={{
            '& .MuiGrid-item': {
              display: 'flex'
            }
          }}
        >
          {slots.map((slot) => (
            <Grid 
              item 
              xs={6} 
              sm={4} 
              md={6} 
              lg={4}
              key={`grid-${slot.index}`}
            >
              {renderSlot(slot)}
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Slot Summary */}
      <Box 
        sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: 1, 
          borderColor: 'divider' 
        }}
      >
        <Typography 
          variant="caption" 
          color="text.secondary"
          component="div"
        >
          Slots: {slots.filter(s => s.traitId && s.isUnlocked).length} / {slots.filter(s => s.isUnlocked).length} equipped
        </Typography>
        {slots.some(s => !s.isUnlocked) && (
          <Typography 
            variant="caption" 
            color="text.secondary"
            component="div"
          >
            {slots.filter(s => !s.isUnlocked).length} slots locked
          </Typography>
        )}
      </Box>
    </Paper>
  );
});

EquippedSlotsPanel.displayName = 'EquippedSlotsPanel';

export default EquippedSlotsPanel;