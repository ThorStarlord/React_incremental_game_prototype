/**
 * TypeScript definitions for notification-related data structures
 */

/**
 * Types of notifications in the application
 */
export type NotificationType = 
  'info' | 'success' | 'warning' | 'error' | 
  'dialogue' | 'event' | 'achievement' | 'discovery' |
  'combat' | 'loot' | 'quest' | 'system';

/**
 * Notification interface - base structure for all notifications
 */
export interface Notification {
  /** Unique identifier for the notification */
  id: string;
  
  /** Message to display to the player */
  message: string;
  
  /** Type of notification, affects styling */
  type: NotificationType;
  
  /** How long the notification should display (in milliseconds) */
  duration: number;
  
  /** When the notification was created */
  timestamp: number;
  
  /** Whether the notification has been read */
  read: boolean;
  
  /** Optional icon to display with the notification */
  icon?: string;
  
  /** Optional category for grouping similar notifications */
  category?: string;
  
  /** Optional count for stacking multiple similar notifications */
  count?: number;
}

/**
 * Dialogue notification - extends base notification with NPC data
 */
export interface DialogueNotification extends Notification {
  type: 'dialogue';
  
  /** NPC ID for dialogue notifications */
  npcId: string;
  
  /** NPC name for dialogue notifications */
  npcName: string;
  
  /** Whether this is a player response for dialogue notifications */
  isPlayerResponse: boolean;
  
  /** Optional emotion for dialogue notifications */
  emotion?: string;
}

/**
 * Quest notification - extends base notification with quest data
 */
export interface QuestNotification extends Notification {
  type: 'quest';
  
  /** ID of the quest */
  questId: string;
  
  /** Name of the quest */
  questName: string;
  
  /** Current status of the quest */
  questStatus: 'started' | 'updated' | 'completed' | 'failed';
}

/**
 * Loot notification - extends base notification with item data
 */
export interface LootNotification extends Notification {
  type: 'loot';
  
  /** ID of the item received */
  itemId: string;
  
  /** Name of the item received */
  itemName: string;
  
  /** Quantity of the item received */
  quantity: number;
  
  /** Rarity of the item */
  rarity?: string;
}

/**
 * Achievement notification - extends base notification with achievement data
 */
export interface AchievementNotification extends Notification {
  type: 'achievement';
  
  /** ID of the achievement */
  achievementId: string;
  
  /** Name of the achievement */
  title: string;
  
  /** Description of the achievement */
  description: string;
}

/**
 * Resource notification - for resource gains/losses
 */
export interface ResourceNotification extends Notification {
  /** Resource type (essence, gold, etc.) */
  resourceType: string;
  
  /** Amount gained or lost */
  amount: number;
  
  /** Whether this is a gain (true) or loss (false) */
  isGain: boolean;
  
  /** Source of the resource change */
  source?: string;
}

/**
 * Filter options for querying notifications
 */
export interface NotificationFilter {
  /** Only include notifications of these types */
  types?: NotificationType[];
  
  /** Only include notifications in these categories */
  categories?: string[];
  
  /** Only include read or unread notifications */
  read?: boolean;
  
  /** Only include notifications after this timestamp */
  after?: number;
  
  /** Only include notifications before this timestamp */
  before?: number;
}

/**
 * State structure for the notifications slice
 */
export interface NotificationsState {
  /** Array of all notifications */
  notifications: Notification[];
  
  /** Number of unread notifications */
  unreadCount: number;
  
  /** Maximum number of notifications to keep in history */
  maxNotifications: number;
  
  /** Whether notification sounds are enabled */
  soundEnabled: boolean;
  
  /** Whether to display notifications in the UI */
  displayEnabled: boolean;
  
  /** Default duration for notifications in milliseconds */
  defaultDuration: number;
}
