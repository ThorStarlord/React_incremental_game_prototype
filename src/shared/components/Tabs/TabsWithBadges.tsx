import React from 'react';
import { Badge, Box } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { StandardTabs, TabConfig } from './StandardTabs';

export interface BadgeTabConfig extends TabConfig {
  badgeContent?: string | number;
  showBadge?: boolean;
  badgeColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  badgeVariant?: 'standard' | 'dot';
}

interface TabsWithBadgesProps {
  tabs: BadgeTabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  indicatorColor?: 'primary' | 'secondary';
  textColor?: 'primary' | 'secondary' | 'inherit';
  showDivider?: boolean;
  sx?: SxProps<Theme>;
  'aria-label'?: string;
}

/**
 * Tabs component with notification badge support
 * Useful for showing unread counts or status indicators
 */
export const TabsWithBadges: React.FC<TabsWithBadgesProps> = ({
  tabs,
  activeTab,
  onTabChange,
  orientation = 'horizontal',
  variant = 'standard',
  indicatorColor = 'primary',
  textColor = 'primary',
  showDivider = true,
  sx,
  'aria-label': ariaLabel,
}) => {
  // Transform tabs to include badge rendering
  const tabsWithBadges: TabConfig[] = tabs.map((tab) => ({
    ...tab,
    label: tab.showBadge ? (
      <Badge
        badgeContent={tab.badgeContent}
        color={tab.badgeColor || 'primary'}
        variant={tab.badgeVariant || 'standard'}
        sx={{
          '& .MuiBadge-badge': {
            right: -8,
            top: -4,
          },
        }}
      >
        {tab.label}
      </Badge>
    ) : (
      tab.label
    ),
  }));

  const getBorderStyle = () => {
    if (!showDivider) return {};
    return orientation === 'vertical'
      ? { borderRight: 1, borderColor: 'divider' }
      : { borderBottom: 1, borderColor: 'divider' };
  };

  return (
    <Box sx={{ ...getBorderStyle(), ...sx }}>
      <StandardTabs
        tabs={tabsWithBadges}
        activeTab={activeTab}
        onTabChange={onTabChange}
        orientation={orientation}
        variant={variant}
        indicatorColor={indicatorColor}
        textColor={textColor}
        aria-label={ariaLabel || 'Tabs with badges'}
        sx={{
          '& .MuiTab-root': {
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '&.Mui-selected': {
              backgroundColor: 'action.selected',
            },
          },
        }}
      />
    </Box>
  );
};
