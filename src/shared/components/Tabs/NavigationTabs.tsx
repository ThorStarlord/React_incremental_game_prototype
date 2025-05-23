import React from 'react';
import { Box } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { VerticalTabs } from './VerticalTabs';
import { TabConfig } from './StandardTabs';

interface NavigationTabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  sx?: SxProps<Theme>;
  'aria-label'?: string;
}

/**
 * Navigation tabs specifically designed for primary app navigation
 * Uses vertical layout with enhanced styling for main navigation areas
 */
export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  sx,
  'aria-label': ariaLabel,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        height: '100%',
        ...sx,
      }}
    >
      <VerticalTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        aria-label={ariaLabel || 'Primary navigation'}
        sx={{
          borderRight: 0,
          '& .MuiTab-root': {
            fontSize: '0.95rem',
            borderRadius: 0,
            margin: 0,
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
            '&:last-child': {
              borderBottom: 'none',
            },
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          },
          '& .MuiTabs-indicator': {
            display: 'none', // Use background color instead
          },
        }}
      />
    </Box>
  );
};
