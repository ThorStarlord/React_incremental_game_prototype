import React from 'react';
import { Box, Paper, Divider } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { NavigationTabs } from './NavigationTabs';
import { TabConfig } from './StandardTabs';

interface SidebarTabLayoutProps {
  navigationTabs: TabConfig[];
  activeNavigationTab: string;
  onNavigationTabChange: (tabId: string) => void;
  children: React.ReactNode;
  sidebarWidth?: number;
  sx?: SxProps<Theme>;
  sidebarSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  'aria-label'?: string;
}

/**
 * Complete sidebar tab layout for main application navigation
 * Combines vertical navigation tabs with main content area
 */
export const SidebarTabLayout: React.FC<SidebarTabLayoutProps> = ({
  navigationTabs,
  activeNavigationTab,
  onNavigationTabChange,
  children,
  sidebarWidth = 280,
  sx,
  sidebarSx,
  contentSx,
  'aria-label': ariaLabel,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {/* Sidebar Navigation */}
      <Paper
        elevation={2}
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          ...sidebarSx,
        }}
      >
        <NavigationTabs
          tabs={navigationTabs}
          activeTab={activeNavigationTab}
          onTabChange={onNavigationTabChange}
          aria-label={ariaLabel || 'Main navigation'}
        />
      </Paper>

      {/* Divider */}
      <Divider orientation="vertical" flexItem />

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: 'background.default',
          ...contentSx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
