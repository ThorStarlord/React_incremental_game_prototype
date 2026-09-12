/**
 * Navigation configuration and item definitions
 * Centralized configuration for the main navigation system
 */

import {
  Person as CharacterIcon,
  AutoAwesome as TraitsIcon,
  Groups as NPCsIcon,
  Assignment as QuestsIcon,
  ContentCopy as CopiesIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  LocalFireDepartment as EssenceIcon,
  BugReport as DebugIcon,
} from '@mui/icons-material';

import type { 
  NavigationConfig, 
  NavSection, 
  NavItem, 
  TabId 
} from '../types/NavigationTypes';

/**
 * Default navigation configuration
 */
export const DEFAULT_NAVIGATION_CONFIG: NavigationConfig = {
  defaultTab: 'character',
  maxHistoryLength: 10,
  persistState: true,
  storageKey: 'rpg_navigation_state',
  enableTransitions: true,
  transitionDuration: 300
};

/**
 * Core navigation items definition
 * Defines all available navigation destinations
 */
export const NAVIGATION_ITEMS: Record<TabId, NavItem> = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    route: '/game/dashboard',
    isImplemented: true,
    tooltip: 'View game overview and statistics',
    section: 'systems',
  },
  character: {
    id: 'character',
    label: 'Character',
    icon: CharacterIcon,
    route: '/game/character',
    isImplemented: true,
    tooltip: 'View character stats and attributes',
    section: 'character-management',
  },
  traits: {
    id: 'traits',
    label: 'Traits',
    icon: TraitsIcon,
    route: '/game/traits',
    isImplemented: true,
    tooltip: 'Manage acquired traits and abilities',
    section: 'character-management',
  },
  npcs: {
    id: 'npcs',
    label: 'NPCs',
    icon: NPCsIcon,
    route: '/game/npcs',
    isImplemented: true,
    tooltip: 'Interact with non-player characters',
    section: 'world-interaction',
  },
  quests: {
    id: 'quests',
    label: 'Quests',
    icon: QuestsIcon,
    route: '/game/quests',
    isImplemented: true,
    tooltip: 'Track active and completed quests',
    section: 'world-interaction',
  },
  copies: {
    id: 'copies',
    label: 'Copies',
    icon: CopiesIcon,
    route: '/game/copies',
    isImplemented: true, // Set to true since the page now exists
    tooltip: 'Manage created copies',
    section: 'world-interaction',
  },
  essence: {
    id: 'essence',
    label: 'Essence',
    icon: EssenceIcon,
    route: '/game/essence',
    isImplemented: true,
    tooltip: 'Manage essence and related mechanics',
    section: 'character-management',
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    route: '/game/settings',
    isImplemented: true,
    tooltip: 'Configure game settings',
    section: 'systems',
  },
  debug: {
    id: 'debug',
    label: 'Debug',
    icon: DebugIcon,
    route: '/game/debug',
    isImplemented: process.env.NODE_ENV === 'development',
    tooltip: 'Access development and testing tools',
    section: 'systems',
  },
};

/**
 * Navigation sections for organized display
 * Groups navigation items into logical sections
 */
export const NAVIGATION_SECTIONS: NavSection[] = [
  {
    id: 'character-management',
    title: 'Character',
    items: [
      NAVIGATION_ITEMS.character,
      NAVIGATION_ITEMS.traits,
      NAVIGATION_ITEMS.essence
    ]
  },
  
  {
    id: 'world-interaction',
    title: 'World',
    items: [
      NAVIGATION_ITEMS.npcs,
      NAVIGATION_ITEMS.quests,
      NAVIGATION_ITEMS.copies
    ]
  },
  
  {
    id: 'systems',
    title: 'Systems',
    items: [
      NAVIGATION_ITEMS.dashboard,
      NAVIGATION_ITEMS.settings,
      NAVIGATION_ITEMS.debug,
    ]
  }
];

/**
 * Get navigation item by ID with type safety
 */
export function getNavigationItem(id: TabId): NavItem {
  const item = NAVIGATION_ITEMS[id];
  if (!item) {
    throw new Error(`Navigation item with id "${id}" not found`);
  }
  return item;
}

/**
 * Get all implemented navigation items
 */
export function getImplementedItems(): NavItem[] {
  return Object.values(NAVIGATION_ITEMS).filter(item => item.isImplemented);
}

/**
 * Get navigation items by section
 */
export function getItemsBySection(sectionId: string): NavItem[] {
  const section = NAVIGATION_SECTIONS.find(s => s.id === sectionId);
  return section?.items || [];
}

/**
 * Check if a navigation item is available
 */
export function isItemAvailable(id: TabId): boolean {
  const item = NAVIGATION_ITEMS[id];
  return !!item?.isImplemented && (!item.requiresCondition || item.requiresCondition());
}

/**
 * Default navigation items for initial load
 * (This is a fallback and might be deprecated in favor of the full sections)
 */
export const DEFAULT_NAV_ITEMS: NavItem[] = Object.values(NAVIGATION_ITEMS);
