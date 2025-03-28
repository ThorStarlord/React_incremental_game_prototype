import React, { ReactNode } from 'react';
import { Box, Tabs, Tab, Badge, SxProps, Theme } from '@mui/material';

/**
 * Interface for tab item
 */
interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Icon component to show in the tab */
  icon?: string | React.ReactElement;  // Changed from ReactNode to match Tab requirements
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Number to show in badge (if > 0) */
  badgeCount?: number;
}

/**
 * Interface for TabNavigation component props
 */
interface TabNavigationProps {
  /** Array of tab definitions */
  tabs: TabItem[];
  /** ID of the currently active tab */
  activeTab: string;
  /** Callback function when tab changes */
  onTabChange: (tabId: string) => void;
  /** Variant of the tabs */
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  /** Additional styling */
  sx?: SxProps<Theme>;
  /** Orientation of the tabs */
  orientation?: 'horizontal' | 'vertical';
  /** Whether to allow scrolling on mobile */
  allowScrollButtonsMobile?: boolean;
  /** Where to display the icon relative to the label */
  iconPosition?: 'top' | 'bottom' | 'start' | 'end';
}

/**
 * Generic tab navigation component that can be used for various tabbed interfaces
 * 
 * @param props - Component props
 * @returns Tab navigation component
 */
const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'standard',
  sx = {},
  orientation = 'horizontal',
  allowScrollButtonsMobile = false,
  iconPosition = 'start'
}) => {
  /**
   * Handle tab change event
   * @param _event - React synthetic event
   * @param newValue - New active tab ID
   */
  const handleChange = (_event: React.SyntheticEvent, newValue: string): void => {
    onTabChange(newValue);
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant={variant}
        scrollButtons={variant === 'scrollable' ? 'auto' : undefined}
        allowScrollButtonsMobile={allowScrollButtonsMobile}
        orientation={orientation}
        aria-label="Navigation tabs"
      >
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={tab.label}
            disabled={tab.disabled}
            icon={
              tab.icon && tab.badgeCount && tab.badgeCount > 0 ? (
                <Badge badgeContent={tab.badgeCount} color="primary" max={99}>
                  {tab.icon}
                </Badge>
              ) : tab.icon
            }
            iconPosition={iconPosition}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default TabNavigation;
