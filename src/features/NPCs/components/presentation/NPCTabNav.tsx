import React from 'react';
import { Tabs, Tab, Box, Badge } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

/**
 * Interface for tab definition
 */
interface TabDefinition {
  /** Unique identifier for tab */
  id: string;
  /** Label to display on tab */
  label: string;
  /** Icon component to display */
  icon?: React.ReactElement | string; // Updated to match Tab requirements
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Optional badge count to show */
  badgeCount?: number;
}

/**
 * Interface for NPCTabNav component props
 */
interface NPCTabNavProps {
  /** Currently active tab */
  activeTab: string;
  /** Callback when tab changes */
  onTabChange: (tabId: string) => void;
  /** Whether trading is available with this NPC */
  tradingAvailable?: boolean;
  /** Whether quests are available with this NPC */
  questsAvailable?: boolean;
  /** Number of available quests */
  availableQuestsCount?: number;
  /** Number of completable quests */
  completableQuestsCount?: number;
}

/**
 * Component for navigation between different NPC interaction tabs
 * 
 * @param props - Component props
 * @param props.activeTab - Currently active tab id
 * @param props.onTabChange - Function called when tab changes
 * @param props.tradingAvailable - Whether trading is available with this NPC
 * @param props.questsAvailable - Whether quests are available with this NPC
 * @param props.availableQuestsCount - Number of available quests
 * @param props.completableQuestsCount - Number of completable quests
 * @returns Tab navigation component for NPC interactions
 */
const NPCTabNav: React.FC<NPCTabNavProps> = ({
  activeTab,
  onTabChange,
  tradingAvailable = false,
  questsAvailable = false,
  availableQuestsCount = 0,
  completableQuestsCount = 0
}) => {
  /**
   * Handle tab change event
   * @param event - React event
   * @param newTabId - ID of the newly selected tab
   */
  const handleChange = (_event: React.SyntheticEvent, newTabId: string): void => {
    onTabChange(newTabId);
  };

  // Define the tabs to show
  const tabs: TabDefinition[] = [
    {
      id: 'dialogue',
      label: 'Talk',
      icon: <ChatIcon />
    },
    {
      id: 'relationship',
      label: 'Relationship',
      icon: <HandshakeIcon />
    },
    {
      id: 'history',
      label: 'History',
      icon: <HistoryIcon />
    },
    {
      id: 'trade',
      label: 'Trade',
      icon: <ShoppingCartIcon />,
      disabled: !tradingAvailable
    },
    {
      id: 'quests',
      label: 'Quests',
      icon: <EmojiEventsIcon />,
      disabled: !questsAvailable,
      badgeCount: completableQuestsCount || availableQuestsCount
    }
  ];

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs 
        value={activeTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="NPC interaction tabs"
      >
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={tab.label}
            icon={
              tab.icon && tab.badgeCount ? (
                <Badge badgeContent={tab.badgeCount} color="primary">
                  {tab.icon}
                </Badge>
              ) : tab.icon || undefined // Ensure we pass undefined, not null
            }
            iconPosition="start"
            disabled={tab.disabled}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default NPCTabNav;
