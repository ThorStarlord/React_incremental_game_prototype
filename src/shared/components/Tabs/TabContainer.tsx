import React from 'react';
import { Box, Paper } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { StandardTabs, TabConfig } from './StandardTabs';
import { TabPanel } from './TabPanel';

interface TabContainerProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  elevation?: number;
  sx?: SxProps<Theme>;
  tabsSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  'aria-label'?: string;
}

/**
 * Complete tab container that combines StandardTabs with content area
 * Provides a consistent layout for tabbed interfaces
 */
export const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children,
  orientation = 'horizontal',
  variant = 'standard',
  elevation = 1,
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
        flexDirection: orientation === 'vertical' ? 'row' : 'column',
        height: '100%',
        ...sx,
      }}
    >
      <StandardTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        orientation={orientation}
        variant={variant}
        aria-label={ariaLabel}
        sx={{
          borderBottom: orientation === 'horizontal' ? 1 : 0,
          borderRight: orientation === 'vertical' ? 1 : 0,
          borderColor: 'divider',
          flexShrink: 0,
          ...tabsSx,
        }}
      />
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          ...contentSx,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};
