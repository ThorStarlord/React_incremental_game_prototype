import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { TabId } from '../../types/NavigationTypes';
import type { NavItem } from '../../constants/navigationConfig';
import { NAVIGATION_SECTIONS } from '../../constants/navigationConfig';

interface MobileNavDrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Function to close the drawer */
  onClose: () => void;
  /** Currently active tab */
  activeTabId?: TabId;
  /** Function called when tab changes */
  onTabChange: (tabId: TabId) => void;
  /** Navigation items to display (optional override) */
  navItems?: NavItem[];
}

const DrawerContainer = styled(Box)(({ theme }) => ({
  width: 280,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginTop: theme.spacing(1),
}));

const NavigationList = styled(List)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1, 0),
  overflow: 'auto',
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isImplemented'
})<{ 
  isActive?: boolean; 
  isImplemented?: boolean; 
}>(({ theme, isActive, isImplemented }) => ({
  margin: theme.spacing(0, 1),
  borderRadius: theme.shape.borderRadius,
  minHeight: 48,
  
  ...(isActive && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  }),
  
  ...(!isImplemented && {
    opacity: 0.6,
    '& .MuiListItemText-primary': {
      fontStyle: 'italic',
    },
  }),

  '&:hover': {
    backgroundColor: isActive 
      ? theme.palette.primary.dark 
      : theme.palette.action.hover,
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  height: 20,
  fontSize: '0.625rem',
  fontWeight: 500,
  '& .MuiChip-label': {
    padding: '0 6px',
  },
}));

/**
 * Mobile navigation drawer component
 * Provides mobile-friendly navigation with drawer pattern
 */
export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  activeTabId,
  onTabChange,
  navItems
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleItemClick = (item: NavItem) => {
    if (!item.isImplemented) {
      return;
    }

    onTabChange(item.id);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent, item: NavItem) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleItemClick(item);
    }
  };

  const getStatusChip = (item: NavItem) => {
    if (item.isImplemented) {
      return (
        <StatusChip
          label="Ready"
          size="small"
          color="success"
          variant="outlined"
        />
      );
    }
    return (
      <StatusChip
        label="Soon"
        size="small"
        color="default"
        variant="outlined"
      />
    );
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = activeTabId === item.id;
    const IconComponent = item.icon;

    const content = (
      <StyledListItemButton
        key={item.id}
        isActive={isActive}
        isImplemented={item.isImplemented}
        onClick={() => handleItemClick(item)}
        onKeyDown={(event) => handleKeyDown(event, item)}
        disabled={!item.isImplemented}
        aria-label={`Navigate to ${item.label}${!item.isImplemented ? ' (coming soon)' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <ListItemIcon>
          <IconComponent fontSize="small" />
        </ListItemIcon>
        
        <ListItemText 
          primary={item.label}
          primaryTypographyProps={{
            variant: 'body2',
            fontWeight: isActive ? 600 : 400,
          }}
        />
        
        <Box ml={1}>
          {getStatusChip(item)}
        </Box>
      </StyledListItemButton>
    );

    if (item.tooltip && !item.isImplemented) {
      return (
        <Tooltip
          key={item.id}
          title={item.tooltip}
          placement="right"
          arrow
        >
          <div>{content}</div>
        </Tooltip>
      );
    }

    return content;
  };

  const renderSection = (section: typeof NAVIGATION_SECTIONS[0]) => (
    <Box key={section.id}>
      <SectionHeader variant="overline">
        {section.title}
      </SectionHeader>
      
      {section.items.map(renderNavItem)}
      
      <Divider sx={{ my: 1, mx: 2 }} />
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={isOpen && isMobile}
      onClose={onClose}
      variant="temporary"
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      PaperProps={{
        elevation: 8,
      }}
    >
      <DrawerContainer
        role="navigation"
        aria-label="Mobile navigation menu"
      >
        <DrawerHeader>
          <Typography variant="h6" component="h2" fontWeight="bold">
            Incremental RPG
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
            Navigation
          </Typography>
        </DrawerHeader>

        <NavigationList>
          {navItems ? (
            // Custom nav items provided
            navItems.map(renderNavItem)
          ) : (
            // Use default sections
            NAVIGATION_SECTIONS.map(renderSection)
          )}
        </NavigationList>
      </DrawerContainer>
    </Drawer>
  );
};

export default MobileNavDrawer;
