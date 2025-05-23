import React from 'react';
import { Tabs, Tab, Box, useTheme } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

export interface TabConfig {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactElement;
}

interface StandardTabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  indicatorColor?: 'primary' | 'secondary';
  textColor?: 'primary' | 'secondary' | 'inherit';
  sx?: SxProps<Theme>;
  'aria-label'?: string;
}

/**
 * Standardized tab component using MUI Tabs for consistent behavior across features
 */
export const StandardTabs: React.FC<StandardTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  orientation = 'horizontal',
  variant = 'standard',
  indicatorColor = 'primary',
  textColor = 'primary',
  sx,
  'aria-label': ariaLabel,
}) => {
  const theme = useTheme();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <Box sx={sx}>
      <Tabs
        value={activeIndex !== -1 ? activeIndex : 0}
        onChange={handleChange}
        orientation={orientation}
        variant={variant}
        indicatorColor={indicatorColor}
        textColor={textColor}
        aria-label={ariaLabel || 'Navigation tabs'}
        sx={{
          '& .MuiTabs-flexContainer': {
            ...(orientation === 'vertical' && {
              alignItems: 'stretch',
            }),
          },
          '& .MuiTab-root': {
            minHeight: theme.spacing(6),
            textTransform: 'none',
            fontWeight: theme.typography.fontWeightMedium,
            ...(orientation === 'vertical' && {
              alignItems: 'flex-start',
              textAlign: 'left',
            }),
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            disabled={tab.disabled}
            icon={tab.icon}
            iconPosition={orientation === 'vertical' ? 'start' : 'top'}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
          />
        ))}
      </Tabs>
    </Box>
  );
};
