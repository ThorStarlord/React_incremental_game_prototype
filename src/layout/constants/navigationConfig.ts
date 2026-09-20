/**
 * Navigation configuration and item definitions.
 *
 * `NAVIGATION_ITEMS` retains legacy IDs so old layout state and historical
 * references remain type-safe, but Campaign One only advertises currently
 * implemented 1.0 surfaces. Cut/deferred legacy IDs stay unavailable.
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
  Save as SaveLoadIcon,
  Dashboard as DashboardIcon,
  School as SkillsIcon,
  LocalFireDepartment as EssenceIcon,
  SaveAlt as SavesIcon,
  BugReport as DebugIcon,
} from '@mui/icons-material';

import type {
  NavigationConfig,
  NavSection,
  NavItem,
  TabId,
} from '../types/NavigationTypes';

export const DEFAULT_NAVIGATION_CONFIG: NavigationConfig = {
  defaultTab: 'character',
  maxHistoryLength: 10,
  persistState: true,
  storageKey: 'rpg_navigation_state',
  enableTransitions: true,
  transitionDuration: 300,
};

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
    tooltip: 'Manage relationship-derived capabilities and Traits',
    section: 'character-management',
  },

  // Historical compatibility ID. A separate generic skill tree is CUT for 1.0;
  // Traits remain the Campaign One capability authority.
  skills: {
    id: 'skills',
    label: 'Skills',
    icon: SkillsIcon,
    route: '/game/skills',
    isImplemented: false,
    tooltip: 'Not part of Campaign One / 1.0',
    section: 'character-management',
  },

  npcs: {
    id: 'npcs',
    label: 'NPCs',
    icon: NPCsIcon,
    route: '/game/npcs',
    isImplemented: true,
    tooltip: 'Interact with characters and relationship history',
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
    isImplemented: true,
    tooltip: 'Manage bounded delegated routine work',
    section: 'world-interaction',
  },
  essence: {
    id: 'essence',
    label: 'Essence',
    icon: EssenceIcon,
    route: '/game/essence',
    isImplemented: true,
    tooltip: 'View Essence and Resonance progression',
    section: 'character-management',
  },

  // Deferred post-1.0 unless a concrete Campaign One requirement promotes it.
  inventory: {
    id: 'inventory',
    label: 'Inventory',
    icon: InventoryIcon,
    route: '/game/inventory',
    isImplemented: false,
    tooltip: 'Deferred from Campaign One / 1.0',
  },

  // Generic crafting is CUT for Campaign One. Authored forge interactions and
  // mastered routines do not imply a generic crafting economy.
  crafting: {
    id: 'crafting',
    label: 'Crafting',
    icon: CraftingIcon,
    route: '/game/crafting',
    isImplemented: false,
    tooltip: 'Not part of Campaign One / 1.0',
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

  // Legacy compatibility IDs. Save/load/import/export is owned by the main
  // menu; Campaign One does not expose a second save-management authority.
  saves: {
    id: 'saves',
    label: 'Manage Saves',
    icon: SavesIcon,
    route: '/game/saves',
    isImplemented: false,
    tooltip: 'Use the main menu for save management',
    section: 'systems',
  },
  'save-load': {
    id: 'save-load',
    label: 'Save/Load',
    icon: SaveLoadIcon,
    route: '/game/save-load',
    isImplemented: false,
    tooltip: 'Use the main menu for save/load/import/export',
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
 * Primary Campaign One grouping. Only actual 1.0 surfaces belong in these
 * sections; compatibility IDs above intentionally remain outside them.
 */
export const NAVIGATION_SECTIONS: NavSection[] = [
  {
    id: 'character-management',
    title: 'Character',
    items: [
      NAVIGATION_ITEMS.character,
      NAVIGATION_ITEMS.traits,
      NAVIGATION_ITEMS.essence,
    ],
  },
  {
    id: 'world-interaction',
    title: 'World',
    items: [
      NAVIGATION_ITEMS.npcs,
      NAVIGATION_ITEMS.quests,
      NAVIGATION_ITEMS.copies,
    ],
  },
  {
    id: 'systems',
    title: 'Systems',
    items: [
      NAVIGATION_ITEMS.dashboard,
      NAVIGATION_ITEMS.settings,
      NAVIGATION_ITEMS.debug,
    ],
  },
];

export function getNavigationItem(id: TabId): NavItem {
  const item = NAVIGATION_ITEMS[id];
  if (!item) {
    throw new Error(`Navigation item with id "${id}" not found`);
  }
  return item;
}

export function getImplementedItems(): NavItem[] {
  return Object.values(NAVIGATION_ITEMS).filter(item => item.isImplemented);
}

export function getItemsBySection(sectionId: string): NavItem[] {
  const section = NAVIGATION_SECTIONS.find(s => s.id === sectionId);
  return section?.items || [];
}

export function isItemAvailable(id: TabId): boolean {
  const item = NAVIGATION_ITEMS[id];
  return !!item?.isImplemented && (!item.requiresCondition || item.requiresCondition());
}

/**
 * Fallback player navigation now mirrors availability instead of advertising
 * unavailable legacy destinations.
 */
export const DEFAULT_NAV_ITEMS: NavItem[] = getImplementedItems();
