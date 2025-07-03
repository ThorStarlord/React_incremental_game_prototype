/**
 * @file NPCPanelUI.tsx
 * @description Main NPC interaction panel UI component
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
  AlertTitle,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Chat as ChatIcon,
  Assignment as QuestIcon,
  Store as TradeIcon,
  Extension as TraitIcon,
  Favorite as RelationshipIcon
} from '@mui/icons-material';
import NPCOverviewTab from './tabs/NPCOverviewTab';
import NPCDialogueTab from './tabs/NPCDialogueTab';
import NPCQuestsTab from './tabs/NPCQuestsTab';
import NPCTradeTab from './tabs/NPCTradeTab';
import NPCTraitsTab from './tabs/NPCTraitsTab';
import NPCRelationshipTab from './tabs/NPCRelationshipTab';
import NPCHeader from './NPCHeader';
import type { NPC } from '../../state/NPCTypes';

// Simple TabLockMessage component for locked tabs
const TabLockMessage: React.FC<{ requiredLevel: number }> = ({ requiredLevel }) => (
  <Alert severity="warning">
    <AlertTitle>Tab Locked</AlertTitle>
    This tab requires relationship level {requiredLevel} or higher to access.
  </Alert>
);

export interface NPCPanelUIProps {
  npc?: NPC;
  npcList: NPC[];
  selectedNPCId?: string | null;
  loading: boolean;
  error: string | null;
  className?: string;
  onNPCSelect: (npcId: string) => void;
  onRelationshipChange: (npcId: string, change: number, reason: string) => void;
  onInteraction: (npcId: string, interactionType: string, data?: any) => void;
  onClose?: () => void;
}

const TAB_CONFIG = [
  { id: 'overview', label: 'Overview', icon: PersonIcon, minLevel: 0 },
  { id: 'dialogue', label: 'Dialogue', icon: ChatIcon, minLevel: 1 },
  { id: 'trade', label: 'Trade', icon: TradeIcon, minLevel: 2 },
  { id: 'quests', label: 'Quests', icon: QuestIcon, minLevel: 3 },
  { id: 'traits', label: 'Traits', icon: TraitIcon, minLevel: 0 },
  { id: 'relationship', label: 'Relationship', icon: RelationshipIcon, minLevel: 1 }
];

export const NPCPanelUI: React.FC<NPCPanelUIProps> = ({
  npc,
  npcList,
  selectedNPCId,
  loading,
  error,
  className,
  onNPCSelect,
  onRelationshipChange,
  onInteraction, // This prop is kept in the interface as other tabs might use it
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  }, []);
  
  const handleNPCChange = useCallback((event: any) => {
    const npcId = event.target.value;
    onNPCSelect(npcId);
    setActiveTab('overview'); 
  }, [onNPCSelect]);
  
  // Relationship-based tab unlocking
  const isTabUnlocked = useCallback((requiredLevel: number): boolean => {
    return npc ? npc.affinity >= requiredLevel : false;
  }, [npc]);
  
  const getAvailableTabs = useCallback(() => {
    return TAB_CONFIG.filter(tab => isTabUnlocked(tab.minLevel));
  }, [isTabUnlocked]);
  
  const renderTabContent = useCallback(() => {
    // Add null check for npc
    if (!npc) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>NPC Not Found</AlertTitle>
          The selected NPC could not be loaded. Please try selecting a different NPC.
        </Alert>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <NPCOverviewTab npc={npc} />;
      case 'dialogue':
        return isTabUnlocked(1) ? (
          <NPCDialogueTab 
            npcId={npc.id}
          />
        ) : (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <AlertTitle>Dialogue Locked</AlertTitle>
            Reach relationship level 1+ to unlock dialogue options.
          </Alert>
        );
      case 'trade':
        return isTabUnlocked(2) ? (
          <NPCTradeTab 
            npcId={npc.id}
          />
        ) : (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <AlertTitle>Trade Locked</AlertTitle>
            Reach relationship level 2+ to unlock trading.
          </Alert>
        );
      case 'quests':
        return isTabUnlocked(3) ? (
          <NPCQuestsTab 
            npcId={npc.id}
          />
        ) : (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <AlertTitle>Quests Locked</AlertTitle>
            Reach relationship level 3+ to unlock quest management.
          </Alert>
        );
      case 'traits':
        return <NPCTraitsTab 
          npcId={npc.id}
        />;
      case 'unknown':
        return <Alert severity="error">
          <AlertTitle>Unknown Tab</AlertTitle>
          This tab type is not recognized.
        </Alert>;
      default:
        return <NPCOverviewTab npc={npc} />;
    }
  }, [activeTab, npc, isTabUnlocked, onInteraction, onRelationshipChange]);
  
  if (loading) {
    return (
      <Card className={className} sx={{height: '100%'}}>
        <CardContent sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading NPC Data...</Typography>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className={className} sx={{height: '100%'}}>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (npcList.length === 0 && !loading) { // Check !loading to avoid showing this during initial load
    return (
      <Card className={className} sx={{height: '100%'}}>
        <CardContent sx={{textAlign: 'center', pt: 5}}>
          <Typography variant="h6" gutterBottom>No NPCs Discovered</Typography>
          <Typography color="text.secondary">Explore the world to meet new characters!</Typography>
        </CardContent>
      </Card>
    );
  }
  
  if (!npc && !loading) { // Check !loading
    return (
      <Card className={className} sx={{height: '100%'}}>
        <CardContent sx={{textAlign: 'center', pt: 5}}>
           <Typography variant="h6" gutterBottom>Select an NPC</Typography>
           <Typography color="text.secondary">Choose an NPC from the list or the dropdown above to view their details.</Typography>
        </CardContent>
      </Card>
    );
  }
  
  const availableTabs = getAvailableTabs();
  
  return (
    <Card className={className} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: npc ? 1 : 2 }}>
          <Typography variant="h5">
            {npc ? npc.name : "NPC Interaction"} 
          </Typography>
          {onClose && (
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        
        <FormControl fullWidth sx={{ mb: npc ? 1 : 0 }}>
          <InputLabel id="npc-select-label">Select NPC</InputLabel>
          <Select
            labelId="npc-select-label"
            value={selectedNPCId || ''}
            onChange={handleNPCChange}
            label="Select NPC"
            size="small"
          >
            {npcList.map((npcOption) => (
              <MenuItem key={npcOption.id} value={npcOption.id}>
                {npcOption.name} ({npcOption.location})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {npc && <NPCHeader npc={npc} />}
      </CardContent>
      
      {npc && <Divider />}
      
      {npc && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons={true} 
            allowScrollButtonsMobile
            aria-label="NPC interaction tabs"
          >
            {availableTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Tab
                  key={tab.id}
                  value={tab.id}
                  label={tab.label}
                  icon={<IconComponent />}
                  iconPosition="start"
                  disabled={!isTabUnlocked(tab.minLevel)}
                />
              );
            })}
          </Tabs>
        </Box>
      )}
      
      {npc && (
        <Box sx={{ flex: 1, overflow: 'auto', p: activeTab === 'overview' ? 0 : 2 }}> {/* Remove padding for overview if it handles its own */}
          {renderTabContent()}
        </Box>
      )}
    </Card>
  );
};

export default NPCPanelUI;
