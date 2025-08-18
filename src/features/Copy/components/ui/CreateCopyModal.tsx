import React, { useState } from 'react';
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
import { useAppDispatch } from '../../../../app/hooks';
import { createCopyThunk } from '../../state/CopyThunks';
import { CopyGrowthType } from '../../state/CopyTypes';
import { COPY_SYSTEM } from '../../../../constants/gameConstants';

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
            control={<Radio />}
            label={
              <Box>
                <Typography>Accelerated Growth</Typography>
                <Typography variant="caption" color="text.secondary">
                  The copy will mature rapidly. Costs {COPY_SYSTEM.ACCELERATED_GROWTH_COST} Essence.
                </Typography>
              </Box>
            }
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
