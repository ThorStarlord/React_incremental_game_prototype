import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; // Example Icon
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import SettingsIcon from '@mui/icons-material/Settings';
import PublicIcon from '@mui/icons-material/Public'; // For World Map

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface VerticalNavBarProps {
  navItems: NavItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  collapsed?: boolean; // Optional: for a collapsible sidebar
}

const SIDEBAR_WIDTH = 240;
const COLLAPSED_WIDTH = 70;

const VerticalNavBar: React.FC<VerticalNavBarProps> = ({
  navItems,
  activeTabId,
  onTabChange,
  collapsed = false,
}) => {
  const theme = useTheme();
  const width = collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Box
      component="nav" // Use nav semantic element
      sx={{
        width: width,
        flexShrink: 0,
        height: '100%',
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        overflowY: 'auto',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <List component="div" sx={{ pt: 1 }}> {/* Use div for List component prop */}
        {navItems.map((item) => (
          <Tooltip title={collapsed ? item.label : ''} placement="right" key={item.id}>
            <ListItemButton
              selected={activeTabId === item.id}
              onClick={() => onTabChange(item.id)}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? 'center' : 'initial',
                px: 2.5,
                mb: 0.5, // Adjust margin
                borderRadius: theme.shape.borderRadius, // Use theme border radius
                mx: 1,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  fontWeight: 'fontWeightBold',
                  '&:hover': { // Maintain selected style on hover
                     bgcolor: 'action.selected',
                     opacity: 0.9, // Slightly change opacity on hover when selected
                  }
                },
                 '&:hover': { // Hover style for non-selected items
                   bgcolor: 'action.hover',
                 }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 'auto' : 1.5, // Adjust margin
                  justifyContent: 'center',
                  color: activeTabId === item.id ? theme.palette.primary.main : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ opacity: collapsed ? 0 : 1, whiteSpace: 'nowrap' }}
                primaryTypographyProps={{
                  fontWeight: activeTabId === item.id ? 'bold' : 'normal',
                  variant: 'body2' // Adjust typography if needed
                }}
              />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );
};

export default VerticalNavBar;
