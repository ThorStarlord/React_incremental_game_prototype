import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../../app/store';
import { 
  addNotification, 
  addDialogueNotification, 
  addQuestNotification, 
  addLootNotification,
  dismissNotification,
  markAsRead,
  markAllAsRead
} from './NotificationsSlice';
import { 
  Notification, 
  NotificationType, 
  DialogueNotification, 
  QuestNotification,
  LootNotification,
  AchievementNotification
} from './NotificationsTypes';

/**
 * Add notification with sound effect
 * 
 * Adds a notification and plays an appropriate sound based on
 * notification type if sound is enabled in settings
 */
export const addNotificationWithSound = createAsyncThunk<
  void,
  {
    message: string;
    type?: NotificationType;
    options?: Partial<Omit<Notification, 'id' | 'message' | 'type' | 'timestamp' | 'read'>>;
  },
  { state: RootState }
>(
  'notifications/addWithSound',
  async ({ message, type = 'info', options }, { dispatch, getState }) => {
    // Dispatch the add notification action
    dispatch(addNotification(message, type, options));
    
    // Check if sound is enabled in settings
    const soundEnabled = getState().notifications.soundEnabled;
    if (!soundEnabled) return;
    
    // Play sound based on notification type
    // This would use your game's sound system
    try {
      const soundMap: Record<NotificationType, string> = {
        info: 'notification_info',
        success: 'notification_success',
        warning: 'notification_warning',
        error: 'notification_error',
        dialogue: 'notification_dialogue',
        event: 'notification_event',
        achievement: 'notification_achievement',
        discovery: 'notification_discovery',
        combat: 'notification_combat',
        loot: 'notification_loot',
        quest: 'notification_quest',
        system: 'notification_system'
      };
      
      const soundId = soundMap[type] || 'notification_default';
      
      // Call your sound player
      // Example: SoundManager.play(soundId);
      console.log(`Playing sound: ${soundId}`);
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  }
);

/**
 * Add achievement notification with fanfare
 * 
 * Shows achievement notification with enhanced visual and audio effects
 */
export const addAchievementNotification = createAsyncThunk<
  void,
  {
    achievementId: string;
    title: string;
    description: string;
  },
  { state: RootState }
>(
  'notifications/addAchievement',
  async ({ achievementId, title, description }, { dispatch, getState }) => {
    // Create achievement notification
    const notification: AchievementNotification = {
      id: uuidv4(),
      message: `Achievement Unlocked: ${title}`,
      type: 'achievement',
      timestamp: Date.now(),
      read: false,
      duration: 8000, // Longer duration for achievements
      achievementId,
      title,
      description,
      icon: 'trophy' // Optional icon identifier
    };
    
    // Dispatch as regular notification
    dispatch(addNotification(
      notification.message,
      notification.type,
      {
        duration: notification.duration,
        icon: notification.icon,
        achievementId,
        title,
        description
      }
    ));
    
    // Play achievement sound if enabled
    const soundEnabled = getState().notifications.soundEnabled;
    if (soundEnabled) {
      // SoundManager.play('achievement_unlocked');
      console.log('Playing achievement sound');
    }
    
    // Could trigger additional visual effects here
  }
);

/**
 * Add multiple notifications at once (batch operation)
 */
export const addBatchNotifications = createAsyncThunk<
  void,
  Array<{
    message: string;
    type?: NotificationType;
    options?: Partial<Omit<Notification, 'id' | 'message' | 'type' | 'timestamp' | 'read'>>;
  }>,
  { state: RootState }
>(
  'notifications/addBatch',
  async (notifications, { dispatch }) => {
    // Add each notification with a slight delay to prevent UI overflow
    notifications.forEach((notification, index) => {
      setTimeout(() => {
        dispatch(addNotification(
          notification.message,
          notification.type || 'info',
          notification.options
        ));
      }, index * 300); // 300ms between notifications
    });
  }
);

/**
 * Auto-dismiss notifications after their duration
 */
export const setupAutoDismiss = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'notifications/setupAutoDismiss',
  async (_, { dispatch, getState }) => {
    // This could be called when the app initializes to set up auto-dismissal
    const checkInterval = setInterval(() => {
      const state = getState();
      const currentTime = Date.now();
      
      state.notifications.notifications.forEach(notification => {
        // Skip if duration is 0 (persistent) or already marked as read
        if (notification.duration === 0 || notification.read) return;
        
        // Check if notification has expired
        const expirationTime = notification.timestamp + notification.duration;
        if (currentTime >= expirationTime) {
          dispatch(markAsRead(notification.id));
          
          // Optionally dismiss (remove) after being marked as read for some time
          setTimeout(() => {
            dispatch(dismissNotification(notification.id));
          }, 5000); // Remove 5 seconds after being marked as read
        }
      });
    }, 1000); // Check every second
    
    // Return a cleanup function (for React useEffect-like behavior)
    return () => clearInterval(checkInterval);
  }
);

/**
 * Add a dialogue notification with typing animation
 */
export const addAnimatedDialogue = createAsyncThunk<
  void,
  {
    message: string;
    npcName: string;
    npcId: string;
    isPlayerResponse?: boolean;
    emotion?: string;
    typingSpeed?: number; // ms per character
  },
  { state: RootState }
>(
  'notifications/addAnimatedDialogue',
  async ({ 
    message, 
    npcName, 
    npcId, 
    isPlayerResponse = false, 
    emotion,
    typingSpeed = 50
  }, { dispatch }) => {
    // For a typing animation effect, we'd show a temporary notification
    // that gets updated with more text over time
    
    // Create initial notification with empty message
    const initialNotification = {
      message: isPlayerResponse ? 'You: ' : `${npcName}: `,
      npcName,
      npcId,
      isPlayerResponse,
      emotion
    };
    
    dispatch(addDialogueNotification(
      initialNotification.message,
      initialNotification.npcName,
      initialNotification.npcId,
      initialNotification.isPlayerResponse,
      initialNotification.emotion
    ));
    
    // In real implementation, you'd update the notification text
    // character by character. This is a simplified version:
    console.log(`Would animate dialogue: ${message} at ${typingSpeed}ms per character`);
    
    // Simulate animation completion
    setTimeout(() => {
      dispatch(addDialogueNotification(
        isPlayerResponse ? `You: ${message}` : `${npcName}: ${message}`,
        npcName,
        npcId,
        isPlayerResponse,
        emotion
      ));
    }, message.length * typingSpeed);
  }
);

/**
 * Clear all notifications of a specific type
 */
export const clearNotificationsByType = createAsyncThunk<
  void,
  NotificationType,
  { state: RootState }
>(
  'notifications/clearByType',
  async (type, { dispatch, getState }) => {
    const notifications = getState().notifications.notifications;
    
    // Get all notifications of the specified type
    const toRemove = notifications
      .filter(notification => notification.type === type)
      .map(notification => notification.id);
    
    // Dismiss each notification
    toRemove.forEach(id => {
      dispatch(dismissNotification(id));
    });
  }
);
