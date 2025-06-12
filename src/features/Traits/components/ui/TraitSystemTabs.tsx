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
  Grid,
} from '@mui/material';
// ...existing imports...
import TraitCodex from './TraitCodex';
import EquippedSlotsPanel from './EquippedSlotsPanel';
import TraitManagement from './TraitManagement';

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


// Rename the component from TraitSystemUI to TraitSystemTabs
- const TraitSystemUI: React.FC<TraitSystemTabsProps> = React.memo(({
+ const TraitSystemTabs: React.FC<TraitSystemTabsProps> = React.memo(({
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
    { label: 'Slots', component: EquippedSlotsPanel },
    { label: 'Management', component: TraitManagement },
    { label: 'Codex', component: TraitCodex },
  ], []);

  // Pass necessary props down to the tab components if they need them.
  // Note: This assumes the tab components are designed to receive these props.
  // If they are containers that fetch their own data, props might not be needed here.
  const renderTabContent = useCallback(() => {
    const TabComponent = tabs[activeTab].component;
     return <TabComponent
       allTraits={allTraits}
       traitSlots={traitSlots}
       equippedTraits={equippedTraits}
       permanentTraits={permanentTraits}
       acquiredTraits={acquiredTraits}
       discoveredTraits={discoveredTraits}
       availableTraitsForEquip={availableTraitsForEquip}
       currentEssence={currentEssence}
       isInProximityToNPC={isInProximityToNPC}
       loading={loading}
       error={error}
       onEquipTrait={onEquipTrait}
       onUnequipTrait={onUnequipTrait}
       onAcquireTrait={onAcquireTrait}
       onDiscoverTrait={onDiscoverTrait}
       canAcquireTrait={canAcquireTrait}
       getTraitAffordability={getTraitAffordability}
     />;
  }, [
    activeTab,
    tabs,
    allTraits,
    traitSlots,
    equippedTraits,
    permanentTraits,
    acquiredTraits,
    discoveredTraits,
    availableTraitsForEquence,
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
  ]);


  if (loading) {
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
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Paper>
      <Box sx={{ p: 2 }}>
        {renderTabContent()}
      </Box>
    </Box>
  );
});

// Update displayName
- TraitSystemUI.displayName = 'TraitSystemUI';
+ TraitSystemTabs.displayName = 'TraitSystemTabs';

// Update export
- export default TraitSystemUI;
+ export default TraitSystemTabs;