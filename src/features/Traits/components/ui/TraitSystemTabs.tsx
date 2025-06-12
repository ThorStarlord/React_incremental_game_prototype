import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Paper
} from '@mui/material';
// ...existing imports...
import TraitCodex from './TraitCodex';
import EquippedSlotsPanel from './EquippedSlotsPanel';
import TraitManagement, { TraitManagementProps } from './TraitManagement';
import type { Trait, TraitSlot } from '../../state/TraitsTypes';

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


// Renamed the component from TraitSystemUI to TraitSystemTabs
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

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  // Define the tabs and their corresponding components
  const tabs = useMemo(() => [
    { id: 'slots', label: 'Slots', component: EquippedSlotsPanel },
    { id: 'management', label: 'Management', component: TraitManagement },
    { id: 'codex', label: 'Codex', component: TraitCodex },
  ], []);

  // Pass necessary props down to the tab components if they need them.
  // Note: This assumes the tab components are designed to receive these props.
  // If they are containers that fetch their own data, props might not be needed here.
  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 0: // Slots
        // EquippedSlotsPanel is a container, doesn't need props here
        return <EquippedSlotsPanel />;
      case 1: // Management
        // TraitManagement needs currentEssence
        return <TraitManagement currentEssence={currentEssence} />;
      case 2: // Codex
        // TraitCodex needs various props for display and actions
        return <TraitCodex {...{ allTraits, discoveredTraits, acquiredTraitIds: acquiredTraits.map(t => t.id), permanentTraitIds: permanentTraits.map(t => t.id), currentEssence, onAcquireTrait, onDiscoverTrait, canAcquireTrait, getTraitAffordability }} />;
      default:
        return null;
    }
  }, [
    activeTab,
    allTraits,
    acquiredTraits,
    permanentTraits,
    discoveredTraits,
    currentEssence,
    onAcquireTrait,
    onDiscoverTrait,
    canAcquireTrait,
    getTraitAffordability,
  ]);

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
            // Use index as key for tabs array
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