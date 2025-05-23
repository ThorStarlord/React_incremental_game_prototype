import React from 'react';
import { Box } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { StandardTabs, TabConfig } from './StandardTabs';

interface VerticalTabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  indicatorColor?: 'primary' | 'secondary';
  textColor?: 'primary' | 'secondary' | 'inherit';
  minWidth?: number;
  showDivider?: boolean;
  sx?: SxProps<Theme>;
  'aria-label'?: string;
}

/**
 * Vertical tabs wrapper optimized for sidebar navigation
 * Provides consistent styling and behavior for vertical tab layouts
 */
export const VerticalTabs: React.FC<VerticalTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'standard',
  indicatorColor = 'primary',
  textColor = 'primary',
  minWidth = 240,
  showDivider = true,
  sx,
  'aria-label': ariaLabel,
}) => {
  return (
    <Box
      sx={{
        borderRight: showDivider ? 1 : 0,
        borderColor: 'divider',
        minWidth,
        height: '100%',
        ...sx,
      }}
    >
      <StandardTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        orientation="vertical"
        variant={variant}
        indicatorColor={indicatorColor}
        textColor={textColor}
        aria-label={ariaLabel || 'Vertical navigation tabs'}
        sx={{
          '& .MuiTabs-flexContainer': {
            alignItems: 'stretch',
          },
          '& .MuiTab-root': {
            alignItems: 'flex-start',
            textAlign: 'left',
            justifyContent: 'flex-start',
            minHeight: 56,
            px: 3,
            py: 1.5,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '&.Mui-selected': {
              backgroundColor: 'action.selected',
            },
          },
          '& .MuiTabs-indicator': {
            width: 3,
            right: 0,
            left: 'auto',
          },
        }}
      />
    </Box>
  );
};
