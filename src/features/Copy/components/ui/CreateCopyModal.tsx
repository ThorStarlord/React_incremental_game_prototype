import React, { useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { createCopyThunk } from '../../state/CopyThunks';
import { CopyGrowthType } from '../../state/CopyTypes';
import { COPY_SYSTEM } from '../../../../constants/gameConstants';
import { selectPlayerAttributes } from '../../../Player/state/PlayerSelectors';
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';

interface CreateCopyModalProps {
  open: boolean;
  onClose: () => void;
  npcId: string;
  npcName: string;
}

export const CreateCopyModal: React.FC<CreateCopyModalProps> = ({
  open,
  onClose,
  npcId,
  npcName,
}) => {
  const dispatch = useAppDispatch();
  const [growthType, setGrowthType] = useState<CopyGrowthType>('normal');
  const attributes = useAppSelector(selectPlayerAttributes);
  const currentEssence = useAppSelector(selectCurrentEssence);

  const essenceCost = COPY_SYSTEM.ACCELERATED_GROWTH_COST;
  const lacksEssence = currentEssence < essenceCost;

  const successChancePct = useMemo(() => {
    const charisma = attributes.charisma ?? 10;
    const charismaModifier = Math.floor((charisma - 10) / 2);
    const chance = 5 + charismaModifier * 10; // as used in createCopyThunk
    return Math.max(0, Math.min(95, chance));
  }, [attributes.charisma]);

  const handleCreate = () => {
    dispatch(createCopyThunk({ npcId, growthType }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create a Copy of {npcName}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Choose the growth method for your new copy. Accelerated growth is much
          faster but requires a significant Essence investment.
        </DialogContentText>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">Estimated success chance: <b>{successChancePct}%</b> (based on Charisma)</Typography>
          <Typography variant="caption" color="text.secondary">
            Current Essence: {currentEssence} {lacksEssence && `(need ${essenceCost} for accelerated)`}
          </Typography>
        </Box>
        <RadioGroup
          aria-label="growth-type"
          name="growth-type-radio-buttons-group"
          value={growthType}
          onChange={(e) => setGrowthType(e.target.value as CopyGrowthType)}
        >
          <FormControlLabel
            value="normal"
            control={<Radio />}
            label={
              <Box>
                <Typography>Normal Growth</Typography>
                <Typography variant="caption" color="text.secondary">
                  The copy will mature over a long period of time. No extra cost.
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="accelerated"
            disabled={lacksEssence}
            control={<Radio />}
            label={
              <Box>
                <Typography>Accelerated Growth</Typography>
                <Typography variant="caption" color="text.secondary">
                  The copy will mature rapidly. Costs {COPY_SYSTEM.ACCELERATED_GROWTH_COST} Essence.
                </Typography>
                {lacksEssence && (
                  <Typography variant="caption" color="error.main">
                    Insufficient Essence for accelerated growth.
                  </Typography>
                )}
              </Box>
            }
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} variant="contained" disabled={growthType === 'accelerated' && lacksEssence}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
