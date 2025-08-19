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
import { selectNPCById } from '../../../NPCs/state/NPCSelectors';
import { selectTraits } from '../../../Traits/state/TraitsSelectors';
import { computeInheritedTraits, getInheritedTraitCap, getCopyCreationCost } from '../../utils/copyUtils';

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
  const npc = useAppSelector((state) => selectNPCById(state, npcId));
  const allTraits = useAppSelector(selectTraits);

  const creationCost = getCopyCreationCost(npc?.connectionDepth);
  const accelCost = COPY_SYSTEM.ACCELERATED_GROWTH_COST;
  const totalCost = growthType === 'accelerated' ? creationCost + accelCost : creationCost;
  const lacksEssence = currentEssence < totalCost;

  const successChancePct = useMemo(() => {
    const charisma = attributes.charisma ?? 10;
    const charismaModifier = Math.floor((charisma - 10) / 2);
    const chance = 5 + charismaModifier * 10; // as used in createCopyThunk
    return Math.max(0, Math.min(95, chance));
  }, [attributes.charisma]);

  const inheritanceInfo = useMemo(() => {
    if (!npc) return { cap: 0, ids: [] as string[], names: [] as string[] };
    const cap = getInheritedTraitCap(npc.connectionDepth ?? 0);
    const ids = computeInheritedTraits(npc).slice(0, cap);
    const names = ids.map(id => allTraits[id]?.name || id);
    return { cap, ids, names };
  }, [npc, allTraits]);

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
          <Typography variant="caption" color="text.secondary" display="block">
            Base creation cost scales with connection depth. Current cost: <b>{creationCost}</b> Essence
          </Typography>
          {growthType === 'accelerated' && (
            <Typography variant="caption" color="text.secondary" display="block">
              Accelerated growth additional cost: <b>{accelCost}</b> Essence
            </Typography>
          )}
          <Typography variant="caption" color={lacksEssence ? 'error.main' : 'text.secondary'} display="block">
            Total cost: <b>{totalCost}</b> Essence — You have {currentEssence}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Inheritance Preview</Typography>
          <Typography variant="caption" color="text.secondary">
            At connection depth {npc?.connectionDepth ?? 0}, up to {inheritanceInfo.cap} trait{inheritanceInfo.cap === 1 ? '' : 's'} can be inherited.
          </Typography>
          {inheritanceInfo.names.length > 0 ? (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Predicted: {inheritanceInfo.names.join(', ')}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ mt: 0.5 }} color="text.secondary">
              No traits eligible to inherit at this connection depth.
            </Typography>
          )}
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
                  The copy will mature rapidly. Additional cost {accelCost} Essence.
                </Typography>
                {lacksEssence && (
                  <Typography variant="caption" color="error.main">
                    Insufficient Essence for selected option.
                  </Typography>
                )}
              </Box>
            }
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
  <Button onClick={handleCreate} variant="contained" disabled={lacksEssence}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
