import React from 'react';
import { Box, Paper } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { HorizontalTabs } from './HorizontalTabs';
import { TabPanel } from './TabPanel';
import { TabConfig } from './StandardTabs';

interface FeatureTabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  elevation?: number;
  centered?: boolean;
  sx?: SxProps<Theme>;
  tabsSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  'aria-label'?: string;
}

/**
 * Feature tabs specifically designed for content area navigation
 * Combines horizontal tabs with content area for feature-specific interfaces
 */
export const FeatureTabs: React.FC<FeatureTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children,
  variant = 'standard',
  elevation = 0,
  centered = false,
  sx,
  tabsSx,
  contentSx,
  'aria-label': ariaLabel,
}) => {
  return (
    <Paper
      elevation={elevation}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <HorizontalTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        variant={variant}
        centered={centered}
        aria-label={ariaLabel || 'Feature navigation'}
        sx={{
          flexShrink: 0,
          backgroundColor: 'background.default',
          ...tabsSx,
        }}
      />
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: 'background.paper',
          ...contentSx,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};
