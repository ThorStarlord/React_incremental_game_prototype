import React from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Collapse,
  Box,
  Typography,
  Divider,
  Badge,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { NavItem, TabId } from '../../types/NavigationTypes';

interface DesktopNavBarProps {
  navItems: NavItem[];
  activeTabId: TabId | null;
  onTabChange: (tabId: TabId) => void;
  collapsed: boolean;
}

const StyledList = styled(List)<{ collapsed: boolean }>(({ theme, collapsed }) => ({
  width: collapsed ? 64 : 240,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  padding: theme.spacing(1, 0),
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
}));

const StyledListItemButton = styled(ListItemButton)<{ 
  isActive?: boolean;
  isImplemented?: boolean;
}>(({ theme, isActive, isImplemented }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  minHeight: 48,
  opacity: isImplemented ? 1 : 0.6,
  cursor: isImplemented ? 'pointer' : 'not-allowed',
  
  ...(isActive && {
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  }),
  
  '&:hover': {
    backgroundColor: isImplemented 
      ? theme.palette.action.hover 
      : theme.palette.action.disabled,
  },
  
  '&.Mui-disabled': {
    opacity: 0.5,
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 40,
  justifyContent: 'center',
}));

const SectionTitle = styled(Typography)<{ collapsed: boolean }>(({ theme, collapsed }) => ({
  padding: theme.spacing(1, 2),
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: collapsed ? 'none' : 'block',
}));

/**
 * Desktop vertical navigation bar component with Material-UI integration
 * Supports collapsed/expanded states and implements navigation primitives
 */
export const DesktopNavBar: React.FC<DesktopNavBarProps> = ({
  navItems,
  activeTabId,
  onTabChange,
  collapsed,
}) => {
  // Group items by section for better organization
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, NavItem[]> = {};
    
    navItems.forEach(item => {
      const section = item.section || 'general';
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(item);
    });
    
    return groups;
  }, [navItems]);

  const handleItemClick = (item: NavItem) => {
    if (!item.isImplemented) {
      return; // Prevent navigation to unimplemented features
    }
    
    if (item.requiresCondition && !item.requiresCondition()) {
      return; // Prevent navigation if condition not met
    }
    
    onTabChange(item.id);
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = activeTabId === item.id;
    const isDisabled = !item.isImplemented || (item.requiresCondition && !item.requiresCondition());
    
    const icon = (
      <StyledListItemIcon>
        {item.badge ? (
          <Badge
            badgeContent={item.badge.count}
            color={item.badge.color || 'primary'}
            variant={item.badge.variant || 'standard'}
          >
            <item.icon />
          </Badge>
        ) : (
          <item.icon />
        )}
      </StyledListItemIcon>
    );

    const listItem = (
      <StyledListItemButton
        key={item.id}
        isActive={isActive}
        isImplemented={item.isImplemented}
        disabled={isDisabled}
        onClick={() => handleItemClick(item)}
        aria-label={`Navigate to ${item.label}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {icon}
        <Collapse in={!collapsed} orientation="horizontal">
          <ListItemText 
            primary={item.label}
            primaryTypographyProps={{
              variant: 'body2',
              fontWeight: isActive ? 600 : 400,
            }}
          />
        </Collapse>
      </StyledListItemButton>
    );

    // Wrap with tooltip when collapsed or if item has tooltip
    if (collapsed || item.tooltip) {
      const tooltipText = collapsed 
        ? `${item.label}${!item.isImplemented ? ' (Coming Soon)' : ''}`
        : item.tooltip;
        
      return (
        <Tooltip
          key={item.id}
          title={tooltipText}
          placement="right"
          arrow
        >
          <Box>{listItem}</Box>
        </Tooltip>
      );
    }

    return listItem;
  };

  return (
    <Box
      sx={{
        height: '100%',
        borderRight: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <StyledList collapsed={collapsed}>
        {Object.entries(groupedItems).map(([sectionKey, items], index) => (
          <React.Fragment key={sectionKey}>
            {index > 0 && (
              <Divider sx={{ my: 1, mx: 2 }} />
            )}
            
            <SectionTitle 
              variant="overline" 
              collapsed={collapsed}
            >
              {sectionKey === 'general' ? 'Navigation' : sectionKey.replace('-', ' ')}
            </SectionTitle>
            
            {items.map(renderNavItem)}
          </React.Fragment>
        ))}
      </StyledList>
    </Box>
  );
};

export default DesktopNavBar;