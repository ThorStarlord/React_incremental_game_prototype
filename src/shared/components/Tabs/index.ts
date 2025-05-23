// Core components
export { StandardTabs } from './StandardTabs';
export { TabPanel } from './TabPanel';
export { TabContainer } from './TabContainer';

// Layout wrappers
export { VerticalTabs } from './VerticalTabs';
export { HorizontalTabs } from './HorizontalTabs';
export { IconTabs } from './IconTabs';
export { TabsWithBadges } from './TabsWithBadges';

// Utilities
export {
  createTabConfig,
  createIconTabConfig,
  createBadgeTabConfig,
  createNotificationTabConfig,
  filterAvailableTabs,
  gameTabConfigs,
  validateTabConfig,
} from './tabUtils';

// Types
export type { TabConfig } from './StandardTabs';
export type { IconTabConfig } from './IconTabs';
export type { BadgeTabConfig } from './TabsWithBadges';
