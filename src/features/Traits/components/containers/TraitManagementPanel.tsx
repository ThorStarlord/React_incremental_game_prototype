import React, { useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
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
import {
  selectTraits,
  selectTraitLoading,
  selectTraitError,
  selectDiscoveredTraitObjects
} from '../../state/TraitsSelectors';
import {
  selectPermanentTraits,
  selectPlayerTraitSlots,
  selectEquippedTraits
} from '../../../Player/state/PlayerSelectors';
import {
  equipTrait,
  unequipTrait
} from '../../../Player/state/PlayerSlice';
import { Trait } from '../../state/TraitsTypes';
import AvailableTraitList from './AvailableTraitList';
import TraitItem from '../ui/TraitCard';

interface IntegratedTraitsPanelProps {
  onClose: () => void;
}

const TraitManagementPanel: React.FC<IntegratedTraitsPanelProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedTrait, setSelectedTrait] = useState<Trait | null>(null);

  const allTraitsData = useAppSelector(selectTraits);
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);
  const currentEssence = useAppSelector((state) => state.essence.currentEssence); // Get essence

  const equippedTraits = useAppSelector(selectEquippedTraits);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const acquiredTraits = useAppSelector(selectDiscoveredTraitObjects);
  const playerSlots = useAppSelector(selectPlayerTraitSlots);

  const permanentTraits = useMemo(() => {
    return permanentTraitIds.map(id => allTraitsData[id]).filter(Boolean) as Trait[];
  }, [permanentTraitIds, allTraitsData]);

  const availableTraits = useMemo(() => {
    const equippedIds = equippedTraits.map(t => t.id);
    return acquiredTraits.filter(trait => !equippedIds.includes(trait.id) && !permanentTraitIds.includes(trait.id));
  }, [acquiredTraits, equippedTraits, permanentTraitIds]);

  const unlockedSlotCount = playerSlots.filter(s => !s.isLocked).length;
  const usedSlots = equippedTraits.length;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue);
    setSelectedTrait(null);
  };

  const panelTitle = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <AutoFixHighIcon sx={{ mr: 1 }} />
      <Typography variant="h6">Trait Management</Typography>
      {!isLoading && !error && (
        <Chip size="small" label={`${usedSlots}/${unlockedSlotCount}`} color="primary" sx={{ ml: 2 }} />
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
        <Tab label={<Badge badgeContent={availableTraits.length} color="secondary">Available</Badge>} />
      </Tabs>
      <Box role="tabpanel" hidden={activeTab !== 0}>
        {activeTab === 0 && (
          <>
            {equippedTraits.length > 0 ? (
              <Grid container spacing={2}>
                {equippedTraits.map(trait => (
                  <Grid item xs={12} sm={6} md={4} key={trait.id}>
                    {/* FIXED: Added currentEssence prop */}
                    <TraitItem trait={trait} isEquipped={true} currentEssence={currentEssence} />
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
                      {/* FIXED: Added currentEssence prop */}
                      <TraitItem trait={trait} isPermanent={true} currentEssence={currentEssence} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </>
        )}
      </Box>
      <Box role="tabpanel" hidden={activeTab !== 1}>
        {activeTab === 1 && <AvailableTraitList />}
      </Box>
      {/* ... (rest of the component logic) */}
    </Panel>
  );
};

export default TraitManagementPanel;