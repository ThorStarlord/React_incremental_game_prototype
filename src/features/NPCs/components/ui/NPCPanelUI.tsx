/**
 * @file NPCPanelUI.tsx
 * @description Main NPC interaction panel UI component
 */

import React, { useState, useCallback, useMemo } from 'react';
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

export interface NPCPanelUIProps {
  /** The currently selected NPC */
  npc?: NPC;
  /** List of all available NPCs */
  npcList: NPC[];
  /** ID of the currently selected NPC */
  selectedNPCId?: string | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Additional CSS class */
  className?: string;
  /** Callback when NPC is selected */
  onNPCSelect: (npcId: string) => void;
  /** Callback when relationship changes */
  onRelationshipChange: (npcId: string, change: number, reason: string) => void;
  /** Callback for interactions */
  onInteraction: (npcId: string, interactionType: string, data?: any) => void;
  /** Callback when panel is closed */
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

/**
 * Main NPC interaction panel providing tabbed interface for all NPC interactions
 */
export const NPCPanelUI: React.FC<NPCPanelUIProps> = ({
  npc,
  npcList,
  selectedNPCId,
  loading,
  error,
  className,
  onNPCSelect,
  onRelationshipChange,
  onInteraction,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  }, []);
  
  const handleNPCChange = useCallback((event: any) => {
    const npcId = event.target.value;
    onNPCSelect(npcId);
    setActiveTab('overview'); // Reset to overview when switching NPCs
  }, [onNPCSelect]);
  
  const isTabUnlocked = useCallback((minLevel: number) => {
    return npc ? npc.relationshipValue >= minLevel : false;
  }, [npc]);
  
  const getAvailableTabs = useCallback(() => {
    return TAB_CONFIG.filter(tab => isTabUnlocked(tab.minLevel));
  }, [isTabUnlocked]);
  
  const renderTabContent = useCallback(() => {
    if (!npc) return null;
    
    switch (activeTab) {
      case 'overview':
        return <NPCOverviewTab npc={npc} />;
      case 'dialogue':
        return isTabUnlocked(1) ? (
          <NPCDialogueTab 
            npc={npc} 
            onInteraction={(data: any) => onInteraction(npc.id, 'dialogue', data)}
          />
        ) : null;
      case 'trade':
        return isTabUnlocked(2) ? (
          <NPCTradeTab 
            npc={npc} 
            relationshipLevel={npc.relationshipValue}
            onInteraction={(data: any) => onInteraction(npc.id, 'trade', data)}
          />
        ) : null;
      case 'quests':
        return isTabUnlocked(3) ? (
          <NPCQuestsTab 
            npc={npc} 
            relationshipLevel={npc.relationshipValue}
            onInteraction={(data: any) => onInteraction(npc.id, 'quest', data)}
          />
        ) : null;
      case 'traits':
        // Use the minLevel from TAB_CONFIG for consistency
        const traitsTabConfig = TAB_CONFIG.find(tab => tab.id === 'traits');
        const traitsMinLevel = traitsTabConfig ? traitsTabConfig.minLevel : 0; // Default to 0 if not found
        return isTabUnlocked(traitsMinLevel) ? (
          <NPCTraitsTab 
            npcId={npc.id} 
            onInteraction={(data: any) => onInteraction(npc.id, 'trait', data)}
          />
        ) : null;
      case 'relationship':
        return isTabUnlocked(1) ? (
          <NPCRelationshipTab 
            npc={npc} 
            onRelationshipChange={(change: number, reason: string) => onRelationshipChange(npc.id, change, reason)}
          />
        ) : null;
      default:
        return <NPCOverviewTab npc={npc} />;
    }
  }, [activeTab, npc, isTabUnlocked, onInteraction, onRelationshipChange]);
  
  if (loading) {
    return (
      <Card className={className}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading NPCs...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className={className}>
        <CardContent>
          <Alert severity="error">
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (npcList.length === 0) {
    return (
      <Card className={className}>
        <CardContent>
          <Alert severity="info">
            No NPCs available. Explore the world to meet new characters!
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (!npc) {
    return (
      <Card className={className}>
        <CardContent>
          <Alert severity="warning">
            Please select an NPC to interact with.
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  const availableTabs = getAvailableTabs();
  
  return (
    <Card className={className} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">
            NPC Interaction
          </Typography>
          {onClose && (
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        
        {/* NPC Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select NPC</InputLabel>
          <Select
            value={selectedNPCId || ''}
            onChange={handleNPCChange}
            label="Select NPC"
          >
            {npcList.map((npcOption) => (
              <MenuItem key={npcOption.id} value={npcOption.id}>
                {npcOption.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* NPC Header */}
        <NPCHeader npc={npc} />
      </CardContent>
      
      <Divider />
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons={true} // Force scroll buttons to be shown if tabs overflow on desktop
          allowScrollButtonsMobile // Also allow scroll buttons on mobile if needed
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
              />
            );
          })}
        </Tabs>
      </Box>
      
      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {renderTabContent()}
      </Box>
    </Card>
  );
};

export default NPCPanelUI;
