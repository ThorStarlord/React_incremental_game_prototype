import React from 'react';
import { 
  AccountTree as TraitsIcon,
  People as NPCsIcon,
  Assignment as QuestsIcon,
  Settings as SettingsIcon,
  Dashboard as GameIcon,
  AutoAwesome as EssenceIcon,
  Group as CopiesIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { TabConfig } from './StandardTabs';

/**
 * Utility functions for creating tab configurations with consistent icons
 */

/**
 * Common icon mapping for game features
 */
export const FEATURE_ICONS = {
  game: <GameIcon />,
  traits: <TraitsIcon />,
  essence: <EssenceIcon />,
  npcs: <NPCsIcon />,
  copies: <CopiesIcon />,
  quests: <QuestsIcon />,
  settings: <SettingsIcon />,
  save: <SaveIcon />,
} as const;

export type FeatureIconKey = keyof typeof FEATURE_ICONS;

/**
 * Creates a tab configuration with an icon from the predefined set
 */
export const createTabWithIcon = (
  id: string,
  label: string,
  iconKey: FeatureIconKey,
  options?: Partial<TabConfig>
): TabConfig => ({
  id,
  label,
  icon: FEATURE_ICONS[iconKey],
  ...options,
});

/**
 * Creates a set of primary navigation tabs with icons
 */
export const createPrimaryNavigationTabs = (): TabConfig[] => [
  createTabWithIcon('game', 'Game', 'game'),
  createTabWithIcon('traits', 'Traits', 'traits'),
  createTabWithIcon('essence', 'Essence', 'essence'),
  createTabWithIcon('npcs', 'NPCs', 'npcs'),
  createTabWithIcon('copies', 'Copies', 'copies'),
  createTabWithIcon('quests', 'Quests', 'quests'),
  createTabWithIcon('settings', 'Settings', 'settings'),
];

/**
 * Creates tabs for trait system features
 */
export const createTraitSystemTabs = (): TabConfig[] => [
  { id: 'overview', label: 'Overview' },
  { id: 'acquired', label: 'Acquired' },
  { id: 'equipped', label: 'Equipped' },
  { id: 'permanent', label: 'Permanent' },
  { id: 'codex', label: 'Codex' },
];

/**
 * Creates tabs for essence system features
 */
export const createEssenceSystemTabs = (): TabConfig[] => [
  { id: 'overview', label: 'Overview' },
  { id: 'connections', label: 'Connections' },
  { id: 'generation', label: 'Generation' },
  { id: 'spending', label: 'Spending' },
];

/**
 * Creates tabs for NPC system features
 */
export const createNPCSystemTabs = (): TabConfig[] => [
  { id: 'overview', label: 'Overview' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'interactions', label: 'Interactions' },
  { id: 'directory', label: 'Directory' },
];

/**
 * Creates tabs for copy/minion system features
 */
export const createCopySystemTabs = (): TabConfig[] => [
  { id: 'overview', label: 'Overview' },
  { id: 'active', label: 'Active Copies' },
  { id: 'creation', label: 'Creation' },
  { id: 'management', label: 'Management' },
];

/**
 * Creates tabs for quest system features
 */
export const createQuestSystemTabs = (): TabConfig[] => [
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'available', label: 'Available' },
  { id: 'log', label: 'Quest Log' },
];

/**
 * Creates tabs for settings system
 */
export const createSettingsTabs = (): TabConfig[] => [
  { id: 'gameplay', label: 'Gameplay' },
  { id: 'display', label: 'Display' },
  { id: 'audio', label: 'Audio' },
  { id: 'controls', label: 'Controls' },
  { id: 'saves', label: 'Save Management' },
];

/**
 * Utility to add icons to existing tab configurations
 */
export const addIconsToTabs = (
  tabs: TabConfig[],
  iconMap: Record<string, React.ReactElement>
): TabConfig[] => {
  return tabs.map(tab => ({
    ...tab,
    icon: iconMap[tab.id] || tab.icon,
  }));
};

/**
 * Utility to mark tabs as disabled based on game state
 */
export const markTabsAsDisabled = (
  tabs: TabConfig[],
  disabledIds: string[]
): TabConfig[] => {
  return tabs.map(tab => ({
    ...tab,
    disabled: disabledIds.includes(tab.id) || tab.disabled,
  }));
};
