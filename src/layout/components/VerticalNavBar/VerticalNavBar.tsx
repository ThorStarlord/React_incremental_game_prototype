import React, { useState, useCallback } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { DesktopNavBar } from './DesktopNavBar';
import { MobileNavDrawer } from './MobileNavDrawer';
import { NAVIGATION_ITEMS, getImplementedNavItems } from '../../constants/navigationConfig';
import type { TabId, NavItem } from '../../types/NavigationTypes';

/**
 * Props interface for the main VerticalNavBar component
 */
export interface VerticalNavBarProps {
  /** Whether the desktop navigation should be collapsed */
  collapsed?: boolean;
  /** Callback when desktop collapse state should change */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Override navigation items (defaults to implemented items) */
  navItems?: NavItem[];
  /** Additional CSS class name */
  className?: string;
}

/**
 * Main responsive navigation component that conditionally renders
 * DesktopNavBar or MobileNavDrawer based on screen size
 */
export const VerticalNavBar: React.FC<VerticalNavBarProps> = ({
  collapsed = false,
  onCollapseChange,
  navItems,
  className
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Get navigation items (use provided or default to implemented items)
  const navigationItems = navItems || getImplementedNavItems();

  // Determine active tab based on current route
  const getActiveTabFromRoute = useCallback((): TabId | undefined => {
    const path = location.pathname;
    
    // Map routes to TabIds
    const routeToTabMap: Record<string, TabId> = {
      '/game': 'character',
      '/game/character': 'character',
      '/game/traits': 'traits',
      '/game/npcs': 'npcs',
      '/game/quests': 'quests',
      '/game/copies': 'copies',
      '/game/inventory': 'inventory',
      '/game/crafting': 'crafting',
      '/game/settings': 'settings',
      '/game/save-load': 'save-load'
    };

    return routeToTabMap[path] || 'character';
  }, [location.pathname]);

  const activeTabId = getActiveTabFromRoute();

  // Navigation handler
  const handleTabChange = useCallback((tabId: TabId) => {
    // Navigate to the appropriate route
    const routeMap: Record<TabId, string> = {
      'character': '/game/character',
      'traits': '/game/traits',
      'npcs': '/game/npcs',
      'quests': '/game/quests',
      'copies': '/game/copies',
      'inventory': '/game/inventory',
      'crafting': '/game/crafting',
      'settings': '/game/settings',
      'save-load': '/game/save-load'
    };

    const route = routeMap[tabId] || '/game';
    navigate(route);

    // Close mobile drawer after navigation
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  }, [navigate, isMobile]);

  // Mobile drawer handlers
  const handleMobileDrawerOpen = useCallback(() => {
    setMobileDrawerOpen(true);
  }, []);

  const handleMobileDrawerClose = useCallback(() => {
    setMobileDrawerOpen(false);
  }, []);

  // Desktop collapse handler
  const handleCollapseToggle = useCallback(() => {
    const newCollapsed = !collapsed;
    onCollapseChange?.(newCollapsed);
  }, [collapsed, onCollapseChange]);

  // Render mobile navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile trigger could be rendered by parent component */}
        <MobileNavDrawer
          isOpen={mobileDrawerOpen}
          onClose={handleMobileDrawerClose}
          activeTabId={activeTabId}
          onTabChange={handleTabChange}
          navItems={navigationItems}
        />
      </>
    );
  }

  // Render desktop navigation
  return (
    <DesktopNavBar
      navItems={navigationItems}
      activeTabId={activeTabId}
      onTabChange={handleTabChange}
      collapsed={collapsed}
      onCollapseToggle={handleCollapseToggle}
      className={className}
    />
  );
};

/**
 * Hook to control mobile navigation drawer from parent components
 */
export const useMobileNavigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => {
    if (isMobile) {
      setIsDrawerOpen(true);
    }
  }, [isMobile]);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen(prev => !prev);
  }, []);

  return {
    isMobile,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer
  };
};

export default VerticalNavBar;
