import { TabConfig } from './StandardTabs';
import { IconTabConfig } from './IconTabs';
import { BadgeTabConfig } from './TabsWithBadges';

/**
 * Utility functions for creating common tab configurations
 * Based on the game's feature specifications
 */

/**
 * Creates a basic tab configuration array
 */
export const createTabConfig = (
  tabs: Array<{
    id: string;
    label: string;
    disabled?: boolean;
  }>
): TabConfig[] => {
  return tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    disabled: tab.disabled || false,
  }));
};

/**
 * Creates icon tab configuration with consistent icon positioning
 */
export const createIconTabConfig = (
  tabs: Array<{
    id: string;
    label: string;
    icon: React.ReactElement;
    disabled?: boolean;
  }>,
  iconPosition: 'start' | 'end' | 'top' | 'bottom' = 'start'
): IconTabConfig[] => {
  return tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    icon: tab.icon,
    iconPosition,
    disabled: tab.disabled || false,
  }));
};

/**
 * Creates badge tab configuration with notification counts
 */
export const createBadgeTabConfig = (
  tabs: Array<{
    id: string;
    label: string;
    badgeContent?: string | number;
    badgeColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    disabled?: boolean;
  }>
): BadgeTabConfig[] => {
  return tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    disabled: tab.disabled || false,
    badgeContent: tab.badgeContent,
    showBadge: tab.badgeContent !== undefined,
    badgeColor: tab.badgeColor || 'primary',
    badgeVariant: 'standard',
  }));
};

/**
 * Common tab configurations for game features
 * Based on specifications from the features folder
 */
export const gameTabConfigs = {
  /**
   * Main navigation tabs for the left column
   */
  mainNavigationTabs: createTabConfig([
    { id: 'player', label: 'Player' },
    { id: 'traits', label: 'Traits' },
    { id: 'essence', label: 'Essence' },
    { id: 'npcs', label: 'NPCs' },
    { id: 'copies', label: 'Copies' },
    { id: 'quests', label: 'Quests' },
    { id: 'settings', label: 'Settings' },
  ]),

  /**
   * Player character tabs
   */
  playerTabs: createTabConfig([
    { id: 'overview', label: 'Overview' },
    { id: 'stats', label: 'Stats & Attributes' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'skills', label: 'Skills' },
  ]),

  /**
   * Trait system tabs based on TraitSystem.md
   */
  traitTabs: createTabConfig([
    { id: 'equipped', label: 'Equipped Traits' },
    { id: 'acquired', label: 'Acquired Traits' },
    { id: 'permanent', label: 'Permanent Traits' },
    { id: 'codex', label: 'Trait Codex' },
    { id: 'presets', label: 'Presets' },
  ]),

  /**
   * Essence system tabs based on EssenceSystem.md
   */
  essenceTabs: createTabConfig([
    { id: 'overview', label: 'Overview' },
    { id: 'connections', label: 'Connections' },
    { id: 'generation', label: 'Generation' },
    { id: 'spending', label: 'Spending History' },
  ]),

  /**
   * NPC management tabs based on NPCSystem.md
   */
  npcTabs: createTabConfig([
    { id: 'relationships', label: 'Relationships' },
    { id: 'interactions', label: 'Interactions' },
    { id: 'shared_traits', label: 'Shared Traits' },
    { id: 'locations', label: 'Locations' },
  ]),

  /**
   * Copy management tabs based on CopySystem.md
   */
  copyTabs: createTabConfig([
    { id: 'active', label: 'Active Copies' },
    { id: 'creation', label: 'Create New' },
    { id: 'tasks', label: 'Task Management' },
    { id: 'loyalty', label: 'Loyalty Management' },
  ]),

  /**
   * Quest system tabs based on QuestSystem.md
   */
  questTabs: createTabConfig([
    { id: 'active', label: 'Active Quests' },
    { id: 'available', label: 'Available Quests' },
    { id: 'completed', label: 'Completed' },
    { id: 'log', label: 'Quest Log' },
  ]),

  /**
   * Settings tabs for configuration
   */
  settingsTabs: createTabConfig([
    { id: 'gameplay', label: 'Gameplay' },
    { id: 'audio', label: 'Audio' },
    { id: 'graphics', label: 'Graphics' },
    { id: 'ui', label: 'Interface' },
    { id: 'gameloop', label: 'Game Loop' },
  ]),

  /**
   * Save/Load system tabs based on SaveLoadSystem.md
   */
  saveLoadTabs: createTabConfig([
    { id: 'save', label: 'Save Game' },
    { id: 'load', label: 'Load Game' },
    { id: 'import_export', label: 'Import/Export' },
    { id: 'autosave', label: 'Auto-save Settings' },
  ]),
};

/**
 * Validates tab configuration arrays
 */
export const validateTabConfig = (tabs: TabConfig[]): boolean => {
  // Check for unique IDs
  const ids = tabs.map((tab) => tab.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    console.warn('Duplicate tab IDs found in tab configuration');
    return false;
  }

  // Check for empty labels
  const hasEmptyLabels = tabs.some((tab) => !tab.label || tab.label.trim() === '');
  if (hasEmptyLabels) {
    console.warn('Empty labels found in tab configuration');
    return false;
  }

  return true;
};

/**
 * Creates tab configurations with quest/notification counts
 * Useful for showing active quest counts, unread messages, etc.
 */
export const createNotificationTabConfig = (
  baseConfig: TabConfig[],
  notifications: Record<string, number>
): BadgeTabConfig[] => {
  return baseConfig.map((tab) => ({
    ...tab,
    badgeContent: notifications[tab.id] || 0,
    showBadge: (notifications[tab.id] || 0) > 0,
    badgeColor: 'primary' as const,
    badgeVariant: 'standard' as const,
  }));
};

/**
 * Helper function to filter disabled tabs based on game progression
 */
export const filterAvailableTabs = (
  tabs: TabConfig[],
  availabilityCheck: (tabId: string) => boolean
): TabConfig[] => {
  return tabs.map((tab) => ({
    ...tab,
    disabled: !availabilityCheck(tab.id),
  }));
};
