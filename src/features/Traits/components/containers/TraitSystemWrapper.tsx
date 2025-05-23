import React from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import { useAppSelector } from '../../../../app/hooks';
import { selectTraitsError, selectTraitsLoading } from '../../state/TraitsSelectors';
import { TraitSlots } from '../ui/TraitSlots';
import { TraitCodex } from '../ui/TraitCodex';
import { TraitManagement } from '../ui/TraitManagement';
import { StandardTabs } from '../../../../shared/components/Tabs';
import { TabPanel } from '../../../../shared/components/Tabs/TabPanel';
import { useTabs } from '../../../../shared/hooks/useTabs';

const traitTabs = [
  { id: 'slots', label: 'Equipped Traits' },
  { id: 'management', label: 'Manage Traits' },
  { id: 'codex', label: 'Trait Codex' },
];

export const TraitSystemWrapper: React.FC = () => {
  const loading = useAppSelector(selectTraitsLoading);
  const error = useAppSelector(selectTraitsError);
  
  const { activeTab, setActiveTab } = useTabs({
    defaultTab: 'slots',
    tabs: traitTabs,
    persistKey: 'trait_system_tabs'
  });

  if (loading) {
    return (
      <Box 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CircularProgress />
        <Alert severity="info">Loading traits...</Alert>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Error loading traits: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <StandardTabs
        tabs={traitTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        aria-label="Trait System Navigation"
      />
      
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <TabPanel tabId="slots" activeTab={activeTab}>
          <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <TraitSlots />
          </Box>
        </TabPanel>
        
        <TabPanel tabId="management" activeTab={activeTab}>
          <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <TraitManagement />
          </Box>
        </TabPanel>
        
        <TabPanel tabId="codex" activeTab={activeTab}>
          <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <TraitCodex />
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default TraitSystemWrapper;
