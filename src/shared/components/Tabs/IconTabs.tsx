import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

export interface IconTabConfig {
  id: string;
  label: string;
  icon: React.ReactElement;
  iconPosition?: 'start' | 'end' | 'top' | 'bottom';
  disabled?: boolean;
  'aria-label'?: string;
}

interface IconTabsProps {
  tabs: IconTabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  indicatorColor?: 'primary' | 'secondary';
  textColor?: 'primary' | 'secondary' | 'inherit';
  iconPosition?: 'start' | 'end' | 'top' | 'bottom';
  showDivider?: boolean;
  sx?: SxProps<Theme>;
  'aria-label'?: string;
}

/**
 * Tabs component with icon support
 * Provides flexible icon positioning and consistent styling
 */
export const IconTabs: React.FC<IconTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  orientation = 'horizontal',
  variant = 'standard',
  indicatorColor = 'primary',
  textColor = 'primary',
  iconPosition = 'start',
  showDivider = true,
  sx,
  'aria-label': ariaLabel,
}) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  const getBorderStyle = () => {
    if (!showDivider) return {};
    return orientation === 'vertical'
      ? { borderRight: 1, borderColor: 'divider' }
      : { borderBottom: 1, borderColor: 'divider' };
  };

  return (
    <Box sx={{ ...getBorderStyle(), ...sx }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        orientation={orientation}
        variant={variant}
        indicatorColor={indicatorColor}
        textColor={textColor}
        aria-label={ariaLabel || 'Icon navigation tabs'}
        sx={{
          '& .MuiTab-root': {
            flexDirection: iconPosition === 'top' || iconPosition === 'bottom' ? 'column' : 'row',
            '& .MuiTab-iconWrapper': {
              marginBottom: iconPosition === 'top' ? 0.5 : 0,
              marginTop: iconPosition === 'bottom' ? 0.5 : 0,
              marginRight: iconPosition === 'start' ? 1 : 0,
              marginLeft: iconPosition === 'end' ? 1 : 0,
              order: iconPosition === 'end' ? 1 : -1,
            },
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '&.Mui-selected': {
              backgroundColor: 'action.selected',
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={tab.label}
            icon={tab.icon}
            iconPosition={tab.iconPosition || iconPosition}
            disabled={tab.disabled}
            aria-label={tab['aria-label']}
          />
        ))}
      </Tabs>
    </Box>
  );
};
