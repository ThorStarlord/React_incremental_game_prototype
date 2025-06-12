import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
  Divider,
  Badge,
  Alert,
  Paper,
  Stack,
  CircularProgress
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import InfoIcon from '@mui/icons-material/Info';
import Panel from '../../../../shared/components/layout/Panel';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
// FIXED: Importing correct selectors from the right files
import {
  selectTraits,
  selectTraitLoading,
  selectTraitError,
  selectEquippedTraits,
  selectAcquiredTraitObjects
} from '../../state/TraitsSelectors';
import {
  selectPermanentTraits as selectPermanentTraitIds, // Renamed to clarify it returns IDs
  selectPlayerTraitSlots
} from '../../../Player/state/PlayerSelectors';
// FIXED: Importing actions from the correct slice (PlayerSlice)
import { equipTrait, unequipTrait } from '../../../Player/state/PlayerSlice';
import { Trait } from '../../state/TraitsTypes';
import { fetchTraitsThunk } from '../../state/TraitThunks';
import AvailableTraitList from './AvailableTraitList';

interface IntegratedTraitsPanelProps {
  onClose: () => void;
}

interface TraitItemProps {
  trait: Trait;
  isEquipped?: boolean;
  isPermanent?: boolean;
}

const IntegratedTraitsPanel: React.FC<IntegratedTraitsPanelProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedTrait, setSelectedTrait] = useState<Trait | null>(null);

  // Correctly use selectors
  const allTraitsData = useAppSelector(selectTraits);
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);

  const equippedTraits = useAppSelector(selectEquippedTraits);
  const permanentTraitIds = useAppSelector(selectPermanentTraitIds);
  const acquiredTraits = useAppSelector(selectAcquiredTraitObjects);
  const playerSlots = useAppSelector(selectPlayerTraitSlots);

  // Get full trait objects for permanent traits
  const permanentTraits = React.useMemo(() => {
    return permanentTraitIds.map(id => allTraitsData[id]).filter(Boolean) as Trait[];
  }, [permanentTraitIds, allTraitsData]);
  
  // Get traits available for equipping (known but not equipped or permanent)
  const availableTraits = React.useMemo(() => {
    const equippedIds = equippedTraits.map(t => t.id);
    return acquiredTraits.filter(trait => !equippedIds.includes(trait.id) && !permanentTraitIds.includes(trait.id));
  }, [acquiredTraits, equippedTraits, permanentTraitIds]);

  const unlockedSlotCount = playerSlots.filter(s => !s.isLocked).length;
  const usedSlots = equippedTraits.length;

  useEffect(() => {
    if (Object.keys(allTraitsData).length === 0 && !isLoading) {
      dispatch(fetchTraitsThunk());
    }
  }, [dispatch, allTraitsData, isLoading]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue);
    setSelectedTrait(null);
  };

  const TraitItem: React.FC<TraitItemProps> = ({ trait, isEquipped = false, isPermanent = false }) => (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        cursor: 'pointer',
        border: selectedTrait?.id === trait.id ? '2px solid' : '1px solid',
        borderColor: selectedTrait?.id === trait.id ? 'primary.main' : 'divider',
        bgcolor: isPermanent ? 'rgba(76, 175, 80, 0.08)' : 'background.paper'
      }}
      onClick={() => setSelectedTrait(trait)}
    >
      <Typography variant="subtitle1" fontWeight="medium">{trait.name}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {trait.description?.substring(0, 60)}{trait.description?.length > 60 ? '...' : ''}
      </Typography>
      {isEquipped && (<Chip label="Equipped" color="primary" size="small" sx={{ mr: 1 }} />)}
      {isPermanent && (<Chip label="Permanent" color="success" size="small" />)}
    </Paper>
  );

  const panelTitle = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <AutoFixHighIcon sx={{ mr: 1 }} />
      <Typography variant="h6">Character Traits</Typography>
      {!isLoading && !error && (
        <Chip
          size="small"
          label={`${usedSlots}/${unlockedSlotCount}`}
          color="primary"
          sx={{ ml: 2 }}
        />
      )}
    </Box>
  );
  
  if (isLoading) {
    return <Panel title={panelTitle}><Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box></Panel>;
  }

  if (error) {
     return <Panel title={panelTitle}><Alert severity="error" sx={{ m: 1 }}>Failed to load trait data: {error}</Alert></Panel>;
  }

  if (!isLoading && Object.keys(allTraitsData).length === 0) {
     return <Panel title={panelTitle}><Alert severity="warning" sx={{ m: 1 }}>No trait definitions loaded.</Alert></Panel>;
  }

  return (
    <Panel title={panelTitle}>
      <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
        <Tab label="Equipped" />
        <Tab label={ <Badge badgeContent={availableTraits.length} color="secondary">Available</Badge> } />
      </Tabs>
      <Box role="tabpanel" hidden={activeTab !== 0}>
        {activeTab === 0 && (
          <>
            {equippedTraits.length > 0 ? (
              <Grid container spacing={2}>
                {equippedTraits.map(trait => (
                  <Grid item xs={12} sm={6} md={4} key={trait.id}>
                    <TraitItem trait={trait} isEquipped={true} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">You have no traits equipped.</Alert>
            )}
            {permanentTraits.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ my: 2 }}><Chip label="Permanent Traits" /></Divider>
                <Grid container spacing={2}>
                  {permanentTraits.map(trait => (
                    <Grid item xs={12} sm={6} md={4} key={trait.id}>
                      <TraitItem trait={trait} isPermanent={true} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </>
        )}
      </Box>
      <Box role="tabpanel" hidden={activeTab !== 1} sx={{p:1}}>
        {activeTab === 1 && ( <AvailableTraitList /> )}
      </Box>
      {selectedTrait && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon sx={{ mr: 1, color: 'info.main' }} />
            <Typography variant="h6">{selectedTrait.name} Details</Typography>
          </Box>
          <Typography variant="body1" gutterBottom>{selectedTrait.description}</Typography>
          {selectedTrait.effects && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Effects:</Typography>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {Object.entries(selectedTrait.effects).map(([key, value]) => (<li key={key}><Typography variant="body2">{key}: {typeof value === 'number' && value > 0 ? '+' : ''}{value}</Typography></li>))}
              </ul>
            </Box>
          )}
          {selectedTrait.requirements && Object.keys(selectedTrait.requirements).length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="warning.main" gutterBottom>Requirements:</Typography>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {Object.entries(selectedTrait.requirements).map(([key, value]) => (<li key={key}><Typography variant="body2">{`${key}: ${value}`}</Typography></li>))}
              </ul>
            </Box>
          )}
        </Box>
      )}
      <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
        {selectedTrait && activeTab === 1 && usedSlots < unlockedSlotCount && (
          <Button variant="contained" color="primary" onClick={() => {
            dispatch(equipTrait({ traitId: selectedTrait.id, slotIndex: -1 }));
            setSelectedTrait(null);
          }}>Equip Selected</Button>
        )}
        {selectedTrait && activeTab === 0 && !permanentTraits.some(t => t.id === selectedTrait.id) && (
          <Button variant="outlined" color="secondary" onClick={() => {
            const slotIndex = equippedTraits.findIndex(t => t.id === selectedTrait.id);
            if (slotIndex !== -1) {
              dispatch(unequipTrait({ slotIndex }));
              setSelectedTrait(null);
            }
          }}>Unequip Selected</Button>
        )}
        <Button onClick={onClose} variant="outlined">Close</Button>
      </Stack>
    </Panel>
  );
};

export default IntegratedTraitsPanel;