import React, { useMemo, useCallback, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { DesktopNavBar } from './DesktopNavBar';
import { MobileNavDrawer } from './MobileNavDrawer';
import { getImplementedItems } from '../../constants/navigationConfig';
import type { NavItem, TabId } from '../../types/NavigationTypes';

export interface VerticalNavBarProps {
  /** Whether the navigation is collapsed (desktop only) */
  collapsed?: boolean;
  /** Function called when collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Currently active tab */
  activeTab?: TabId;
  /** Function called when tab changes */
  onTabChange?: (tabId: TabId) => void;
  /** Navigation items to display (optional override) */
  navItems?: NavItem[];
  /** Additional CSS class name */
  className?: string;
}

/**
 * Custom hook for mobile navigation state management
 */
export const useMobileNavigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return {
    isMobile,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  };
};

/**
 * Unified responsive vertical navigation bar component
 * Automatically switches between desktop and mobile navigation patterns
 */
export const VerticalNavBar: React.FC<VerticalNavBarProps> = ({
  collapsed = false,
  onCollapseChange,
  activeTab,
  onTabChange,
  navItems,
  className,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use custom nav items or get implemented items from config
  const navigationItems = useMemo(() => {
    return navItems || getImplementedItems();
  }, [navItems]);

  // Extract current tab from route if not provided
  const currentTab = useMemo(() => {
    if (activeTab) return activeTab;
    
    const path = location.pathname;
    if (path.startsWith('/game/')) {
      const segments = path.split('/');
      return segments[2] as TabId || 'dashboard';
    }
    return 'dashboard';
  }, [activeTab, location.pathname]);

  // Mobile navigation state
  const { isDrawerOpen, closeDrawer } = useMobileNavigation();

  // Handle tab changes
  const handleTabChange = useCallback((tabId: TabId) => {
    // Navigate to the corresponding route
    navigate(`/game/${tabId}`);

    if (onTabChange) {
      onTabChange(tabId);
    }
    // Close mobile drawer on navigation
    if (isMobile) {
      closeDrawer();
    }
  }, [onTabChange, isMobile, closeDrawer, navigate]);

  // Handle collapse changes (desktop only)
  const handleCollapseChange = useCallback((newCollapsed: boolean) => {
    if (!isMobile && onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  }, [isMobile, onCollapseChange]);

  return (
    <Box className={className}>
      {isMobile ? (
        <MobileNavDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          activeTabId={currentTab}
          onTabChange={handleTabChange}
          navItems={navigationItems}
        />
      ) : (
        <DesktopNavBar
          navItems={navigationItems}
          activeTabId={currentTab}
          onTabChange={handleTabChange}
          collapsed={collapsed}
          onCollapseChange={handleCollapseChange}
        />
      )}
    </Box>
  );
};

export default VerticalNavBar;
