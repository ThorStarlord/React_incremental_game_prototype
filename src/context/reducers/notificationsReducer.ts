/**
 * Notification state management
 */
interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'event' | 'discovery' | 'achievement';
  duration: number;
  timestamp: number;
  read?: boolean;
  category?: string;
  icon?: string;
}

interface NotificationsState {
  queue: Notification[];
  history: Notification[];
  settings: {
    maxQueueSize: number;
    maxHistorySize: number;
    defaultDuration: number;
    groupSimilar: boolean;
    soundEnabled: boolean;
  };
}

// Action types
const SHOW_NOTIFICATION = 'notifications/show';
const HIDE_NOTIFICATION = 'notifications/hide';
const CLEAR_ALL_NOTIFICATIONS = 'notifications/clearAll';
const MARK_AS_READ = 'notifications/markAsRead';
const ARCHIVE_NOTIFICATION = 'notifications/archive';
const UPDATE_SETTINGS = 'notifications/updateSettings';

// Initial state
const InitialState: NotificationsState = {
  queue: [],
  history: [],
  settings: {
    maxQueueSize: 5,
    maxHistorySize: 50,
    defaultDuration: 3000,
    groupSimilar: true,
    soundEnabled: true
  }
};

// Helper functions
const trimQueue = (queue: Notification[], maxSize: number): Notification[] =>
  queue.length > maxSize ? queue.slice(-maxSize) : queue;

const trimHistory = (history: Notification[], maxSize: number): Notification[] =>
  history.length > maxSize ? history.slice(-maxSize) : history;

// Reducer
export const notificationsReducer = (
  state: NotificationsState = InitialState,
  action: { type: string; payload: any }
): NotificationsState => {
  switch (action.type) {
    case SHOW_NOTIFICATION: {
      const notification: Notification = {
        id: action.payload.id || `notification-${Date.now()}`,
        message: action.payload.message,
        type: action.payload.type || 'info',
        duration: action.payload.duration || state.settings.defaultDuration,
        timestamp: Date.now(),
        category: action.payload.category,
        icon: action.payload.icon
      };
      
      // Optional grouping of similar notifications
      if (state.settings.groupSimilar) {
        const similarIndex = state.queue.findIndex(n => 
          n.message === notification.message && n.type === notification.type
        );
        
        if (similarIndex !== -1) {
          // Update existing notification instead of adding new one
          const updatedQueue = [...state.queue];
          updatedQueue[similarIndex] = {
            ...updatedQueue[similarIndex],
            timestamp: Date.now(), // Reset timeout
            count: (updatedQueue[similarIndex].count || 1) + 1
          };
          
          return {
            ...state,
            queue: updatedQueue
          };
        }
      }
      
      return {
        ...state,
        queue: trimQueue([
          ...state.queue,
          notification
        ], state.settings.maxQueueSize)
      };
    }
    
    case HIDE_NOTIFICATION: {
      const { id, archive = true } = action.payload;
      
      const notification = state.queue.find(n => n.id === id);
      
      // If we need to archive it and it exists
      if (archive && notification) {
        return {
          ...state,
          queue: state.queue.filter(n => n.id !== id),
          history: trimHistory([
            ...state.history,
            { ...notification, read: true }
          ], state.settings.maxHistorySize)
        };
      }
      
      // Just remove from queue
      return {
        ...state,
        queue: state.queue.filter(n => n.id !== id)
      };
    }
    
    case CLEAR_ALL_NOTIFICATIONS:
      return {
        ...state,
        queue: []
      };
    
    case MARK_AS_READ: {
      const { id } = action.payload;
      
      return {
        ...state,
        history: state.history.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      };
    }
    
    case ARCHIVE_NOTIFICATION: {
      const { notification } = action.payload;
      
      return {
        ...state,
        history: trimHistory([
          ...state.history,
          { ...notification, read: true }
        ], state.settings.maxHistorySize)
      };
    }
    
    case UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
    
    default:
      return state;
  }
};

export default notificationsReducer;
