/**
 * @file NPCPanel.tsx
 * @description Main container component for NPC interactions using MUI tabs strategy
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Alert,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StoreIcon from '@mui/icons-material/Store';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { selectNPCById, selectNPCLoading, selectNPCError } from '../../state/NPCSelectors';
import { npcActions } from '../../state/NPCSlice';

// Tab content components
import NPCOverviewTab from '../ui/NPCOverviewTab';
import NPCDialogueTab from '../ui/NPCDialogueTab';
import NPCRelationshipTab from '../ui/NPCRelationshipTab';
import NPCTradeTab from '../ui/NPCTradeTab';
import NPCQuestsTab from '../ui/NPCQuestsTab';
import NPCTraitsTab from '../ui/NPCTraitsTab';

// Styled components
const NPCPanelContainer = styled(Paper)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const TabContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: 48,
  '& .MuiTab-root': {
    minHeight: 48,
    textTransform: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
}));

// Tab configuration
interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactElement;
  component: React.ComponentType<{ npcId: string }>;
  requiresDiscovery?: boolean;
  requiresRelationship?: number;
}

const TAB_CONFIGS: TabConfig[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <PersonIcon />,
    component: NPCOverviewTab,
    requiresDiscovery: true,
  },
  {
    id: 'dialogue',
    label: 'Dialogue',
    icon: <ChatIcon />,
    component: NPCDialogueTab,
    requiresDiscovery: true,
  },
  {
    id: 'relationship',
    label: 'Relationship',
    icon: <FavoriteIcon />,
    component: NPCRelationshipTab,
    requiresDiscovery: true,
    requiresRelationship: 10, // Requires Acquaintance level
  },
  {
    id: 'trade',
    label: 'Trade',
    icon: <StoreIcon />,
    component: NPCTradeTab,
    requiresDiscovery: true,
    requiresRelationship: 25, // Requires Friend level
  },
  {
    id: 'quests',
    label: 'Quests',
    icon: <AssignmentIcon />,
    component: NPCQuestsTab,
    requiresDiscovery: true,
    requiresRelationship: 50, // Requires Close Friend level
  },
  {
    id: 'traits',
    label: 'Traits',
    icon: <AutoFixHighIcon />,
    component: NPCTraitsTab,
    requiresDiscovery: true,
    requiresRelationship: 75, // Requires Trusted level
  },
];

interface NPCPanelProps {
  npcId: string;
}

/**
 * NPCPanel - Main container for NPC interactions
 * 
 * Provides a tabbed interface for different types of NPC interactions:
 * - Overview: Basic information and status
 * - Dialogue: Conversation system
 * - Relationship: Relationship building activities
 * - Trade: Buy/sell items (unlocked at Friend level)
 * - Quests: Available and completed quests (unlocked at Close Friend level)
 * - Traits: Trait learning and sharing (unlocked at Trusted level)
 */
const NPCPanel: React.FC<NPCPanelProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const npc = useAppSelector((state) => selectNPCById(state, npcId));
  const loading = useAppSelector(selectNPCLoading);
  const error = useAppSelector(selectNPCError);
  
  const [activeTab, setActiveTab] = useState('overview');

  // Determine available tabs based on NPC state and relationship
  const availableTabs = TAB_CONFIGS.filter(tab => {
    // Check if NPC is discovered
    if (tab.requiresDiscovery && (!npc || !npc.isDiscovered)) {
      return false;
    }
    
    // Check relationship requirements
    if (tab.requiresRelationship && npc) {
      return npc.relationshipValue >= tab.requiresRelationship;
    }
    
    return true;
  });

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  }, []);

  // Handle clearing errors
  const handleClearError = useCallback(() => {
    dispatch(npcActions.clearError());
  }, [dispatch]);

  // Loading state
  if (loading) {
    return (
      <NPCPanelContainer>
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height="100%"
        >
          <CircularProgress />
        </Box>
      </NPCPanelContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <NPCPanelContainer>
        <Box p={2}>
          <Alert 
            severity="error" 
            onClose={handleClearError}
            action={
              <Typography variant="body2" color="text.secondary">
                Failed to load NPC data
              </Typography>
            }
          >
            {error}
          </Alert>
        </Box>
      </NPCPanelContainer>
    );
  }

  // NPC not found
  if (!npc) {
    return (
      <NPCPanelContainer>
        <Box p={2}>
          <Alert severity="warning">
            <Typography variant="h6" gutterBottom>
              NPC Not Found
            </Typography>
            <Typography variant="body2">
              The NPC with ID "{npcId}" could not be found or has not been discovered yet.
            </Typography>
          </Alert>
        </Box>
      </NPCPanelContainer>
    );
  }

  // NPC not discovered
  if (!npc.isDiscovered) {
    return (
      <NPCPanelContainer>
        <Box p={2}>
          <Alert severity="info">
            <Typography variant="h6" gutterBottom>
              Unknown Character
            </Typography>
            <Typography variant="body2">
              You haven't met this character yet. Explore the world to discover new NPCs.
            </Typography>
          </Alert>
        </Box>
      </NPCPanelContainer>
    );
  }

  // Get current tab component
  const currentTabConfig = availableTabs.find(tab => tab.id === activeTab) || availableTabs[0];
  const CurrentTabComponent = currentTabConfig?.component;

  return (
    <NPCPanelContainer elevation={1}>
      {/* Tab Navigation */}
      <StyledTabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        {availableTabs.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={tab.label}
            icon={tab.icon}
            iconPosition="start"
          />
        ))}
      </StyledTabs>

      {/* Tab Content */}
      <TabContent>
        <Fade in={true} timeout={300} key={activeTab}>
          <Box>
            {CurrentTabComponent && (
              <CurrentTabComponent npcId={npcId} />
            )}
          </Box>
        </Fade>
      </TabContent>
    </NPCPanelContainer>
  );
};

export default NPCPanel;
