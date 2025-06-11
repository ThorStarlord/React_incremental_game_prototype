import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { Lock } from '@mui/icons-material';

interface LockedSlotCardProps {
  slotIndex: number;
  unlockRequirement?: string;
}

/**
 * Card component for displaying locked trait slots
 */
export const LockedSlotCard: React.FC<LockedSlotCardProps> = React.memo(({
  slotIndex,
  unlockRequirement
}) => {
  return (
    <Card
      sx={{
        minHeight: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.100',
        border: '2px dashed',
        borderColor: 'grey.400',
        opacity: 0.6,
        cursor: 'not-allowed'
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 1 }}>
        <Lock sx={{ fontSize: 32, color: 'grey.500', mb: 1 }} />
        <Typography variant="caption" color="text.secondary" component="div">
          Slot {slotIndex + 1}
        </Typography>
        <Typography variant="caption" color="text.secondary" component="div">
          Locked
        </Typography>
        {unlockRequirement && (
          <Chip
            label={unlockRequirement}
            size="small"
            variant="outlined"
            sx={{ mt: 1, fontSize: '0.7rem' }}
          />
        )}
      </CardContent>
    </Card>
  );
});

LockedSlotCard.displayName = 'LockedSlotCard';

export default LockedSlotCard;
