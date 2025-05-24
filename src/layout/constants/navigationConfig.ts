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
  Inventory as InventoryIcon,
  Build as CraftingIcon,
  Settings as SettingsIcon,
  Save as SaveLoadIcon
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
  character: {
    id: 'character',
    label: 'Character',
    icon: CharacterIcon,
    route: '/game/character',
    isImplemented: true, // Player state management implemented
    tooltip: 'View character stats and attributes',
    section: 'character-management',
  },
  
  traits: {
    id: 'traits',
    label: 'Traits',
    icon: TraitsIcon,
    route: '/game/traits',
    isImplemented: true, // UI fully implemented
    tooltip: 'Manage acquired traits and abilities',
    section: 'character-management',
  },
  
  npcs: {
    id: 'npcs',
    label: 'NPCs',
    icon: NPCsIcon,
    route: '/game/npcs',
    isImplemented: true, // UI fully implemented
    tooltip: 'Interact with non-player characters',
    section: 'world-interaction',
  },
  
  quests: {
    id: 'quests',
    label: 'Quests',
    icon: QuestsIcon,
    route: '/game/quests',
    isImplemented: false, // Planned
    tooltip: 'Track active and completed quests',
    section: 'world-interaction',
  },
  
  copies: {
    id: 'copies',
    label: 'Copies',
    icon: CopiesIcon,
    route: '/game/copies',
    isImplemented: false, // Planned
    tooltip: 'Manage created copies',
    section: 'world-interaction',
  },
  
  inventory: {
    id: 'inventory',
    label: 'Inventory',
    icon: InventoryIcon,
    route: '/game/inventory',
    isImplemented: false, // 📋 Future feature
    tooltip: 'Manage items and equipment'
  },
  
  crafting: {
    id: 'crafting',
    label: 'Crafting',
    icon: CraftingIcon,
    route: '/game/crafting',
    isImplemented: false, // 📋 Future feature
    tooltip: 'Craft items and equipment'
  },
  
  settings: {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    route: '/game/settings',
    isImplemented: true, // ✅ Implemented
    tooltip: 'Configure game settings',
    section: 'systems',
  },
  
  'save-load': {
    id: 'save-load',
    label: 'Save/Load',
    icon: SaveLoadIcon,
    route: '/game/save-load',
    isImplemented: true, // ✅ Implemented
    tooltip: 'Save and load game progress'
  }
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
      NAVIGATION_ITEMS.inventory
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
      NAVIGATION_ITEMS.crafting,
      NAVIGATION_ITEMS.settings,
      NAVIGATION_ITEMS['save-load']
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
  return item?.isImplemented && (!item.requiresCondition || item.requiresCondition());
}

/**
 * Default navigation items for initial load
 */
export const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    id: 'character',
    label: 'Character',
    icon: PersonIcon,
    route: '/game/character',
    isImplemented: true, // Player state management implemented
    tooltip: 'View character stats and attributes',
    section: 'character-management',
  },
  {
    id: 'traits',
    label: 'Traits',
    icon: PsychologyIcon,
    route: '/game/traits',
    isImplemented: true, // UI fully implemented
    tooltip: 'Manage acquired traits and abilities',
    section: 'character-management',
  },
  {
    id: 'npcs',
    label: 'NPCs',
    icon: GroupIcon,
    route: '/game/npcs',
    isImplemented: true, // UI fully implemented
    tooltip: 'Interact with non-player characters',
    section: 'world-interaction',
  },
  {
    id: 'quests',
    label: 'Quests',
    icon: AssignmentIcon,
    route: '/game/quests',
    isImplemented: false, // Planned
    tooltip: 'Track active and completed quests',
    section: 'world-interaction',
  },
  {
    id: 'copies',
    label: 'Copies',
    icon: FileCopyIcon,
    route: '/game/copies',
    isImplemented: false, // Planned
    tooltip: 'Manage created copies',
    section: 'world-interaction',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    route: '/game/settings',
    isImplemented: true, // ✅ Implemented
    tooltip: 'Configure game settings',
    section: 'systems',
  },
  {
    id: 'save-load',
    label: 'Save/Load',
    icon: SaveLoadIcon,
    route: '/game/save-load',
    isImplemented: true, // ✅ Implemented
    tooltip: 'Save and load game progress'
  }
];
