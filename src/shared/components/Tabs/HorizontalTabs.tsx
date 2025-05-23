import React from 'react';
import { Box } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { StandardTabs, TabConfig } from './StandardTabs';

interface HorizontalTabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  indicatorColor?: 'primary' | 'secondary';
  textColor?: 'primary' | 'secondary' | 'inherit';
  centered?: boolean;
  showDivider?: boolean;
  sx?: SxProps<Theme>;
  'aria-label'?: string;
}

/**
 * Horizontal tabs wrapper optimized for top navigation
 * Provides consistent styling and behavior for horizontal tab layouts
 */
export const HorizontalTabs: React.FC<HorizontalTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'standard',
  indicatorColor = 'primary',
  textColor = 'primary',
  centered = false,
  showDivider = true,
  sx,
  'aria-label': ariaLabel,
}) => {
  return (
    <Box
      sx={{
        borderBottom: showDivider ? 1 : 0,
        borderColor: 'divider',
        width: '100%',
        ...sx,
      }}
    >
      <StandardTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        orientation="horizontal"
        variant={variant}
        indicatorColor={indicatorColor}
        textColor={textColor}
        aria-label={ariaLabel || 'Horizontal navigation tabs'}
        sx={{
          '& .MuiTabs-flexContainer': {
            justifyContent: centered ? 'center' : 'flex-start',
          },
          '& .MuiTab-root': {
            minHeight: 48,
            px: 2,
            py: 1,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '&.Mui-selected': {
              backgroundColor: 'action.selected',
            },
          },
          '& .MuiTabs-indicator': {
            height: 2,
          },
        }}
      />
    </Box>
  );
};
