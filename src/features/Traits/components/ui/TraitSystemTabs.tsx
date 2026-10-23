import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  AlertTitle,
  Paper,
} from '@mui/material';
import EquippedSlotsPanel from './EquippedSlotsPanel';
import TraitManagement from './TraitManagement';
import type { Trait, TraitSlot } from '../../state/TraitsTypes';
import TraitCodexDrawer from '../containers/TraitCodexDrawer'; // Import the drawer
import DoctrineFocusPanel from './DoctrineFocusPanel';

// Define the props interface for TraitSystemTabs (formerly TraitSystemUI)
export interface TraitSystemTabsProps {
  allTraits: Record<string, Trait>;
  traitSlots: TraitSlot[];
  equippedTraits: Trait[];
  permanentTraits: Trait[];
  acquiredTraits: Trait[];
  discoveredTraits: Trait[];
  availableTraitsForEquip: Trait[];
  currentEssence: number;
  isInProximityToNPC: boolean;
  loading: boolean;
  error: string | null;
  onEquipTrait: (traitId: string, slotIndex: number) => void;
  onUnequipTrait: (slotIndex: number) => void;
  onAcquireTrait: (traitId: string) => void;
  onDiscoverTrait: (traitId: string) => void;
  canAcquireTrait: (trait: Trait) => boolean;
  getTraitAffordability: (trait: Trait) => {
    canAfford: boolean;
    cost: number;
    currentEssence: number;
    message: string;
  };
}

const TraitSystemTabs: React.FC<TraitSystemTabsProps> = React.memo(({
  allTraits,
  traitSlots,
  equippedTraits,
  permanentTraits,
  acquiredTraits,
  discoveredTraits,
  availableTraitsForEquip,
  currentEssence,
  isInProximityToNPC,
  loading,
  error,
  onEquipTrait,
  onUnequipTrait,
  onAcquireTrait,
  onDiscoverTrait,
  canAcquireTrait,
  getTraitAffordability,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isCodexDrawerOpen, setIsCodexDrawerOpen] = useState(false); // State for the drawer

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    // The Codex is a drawer, not a separate empty page that then requires
    // a second "Open Codex" click. Returning leaves the previous tab active.
    if (newValue === 2) setIsCodexDrawerOpen(true);
    else setActiveTab(newValue);
  }, []);

  const handleCloseCodex = () => setIsCodexDrawerOpen(false);

  // Define the tabs and their corresponding components
  const tabs = useMemo(() => [
    { id: 'slots', label: 'Slots', component: EquippedSlotsPanel },
    { id: 'management', label: 'Management', component: TraitManagement },
    { id: 'codex', label: 'Codex', component: 'codex_drawer' }, // Opens the Codex directly
    { id: 'doctrine', label: 'Doctrine', component: DoctrineFocusPanel },
  ], []);

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 0: // Slots
        return <EquippedSlotsPanel />;
      case 1: // Management
        return <TraitManagement currentEssence={currentEssence} />;
      case 3: // Doctrine
        return <DoctrineFocusPanel />;
      default:
        return null;
    }
  }, [activeTab, currentEssence]);

  if (loading && Object.keys(allTraits).length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading Traits...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error Loading Traits</AlertTitle>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* The Drawer is rendered here, but only visible when isCodexDrawerOpen is true */}
      <TraitCodexDrawer open={isCodexDrawerOpen} onClose={handleCloseCodex} />

      <Paper elevation={1} sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="trait system tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}  
        </Tabs>
      </Paper>
      <Box sx={{ p: 2 }}>{renderTabContent()}
      </Box>  
    </Box>
  );
});

TraitSystemTabs.displayName = 'TraitSystemTabs';
export default TraitSystemTabs;
