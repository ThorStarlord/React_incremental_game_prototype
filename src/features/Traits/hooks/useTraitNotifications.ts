import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface TraitNotification {
  id: string;
  title: string;
  message: string;
  traitId: string;
  traitName: string;
  type: 'positive' | 'negative' | 'neutral';
  timestamp?: number;
}

interface UseTraitNotificationsReturn {
  notifications: TraitNotification[];
  addNotification: (notification: Omit<TraitNotification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

/**
 * Hook for managing trait-related notifications
 * Handles showing and dismissing trait effect notifications
 */
const useTraitNotifications = (): UseTraitNotificationsReturn => {
  const [notifications, setNotifications] = useState<TraitNotification[]>([]);

  // Add a new notification
  const addNotification = useCallback((notification: Omit<TraitNotification, 'id' | 'timestamp'>) => {
    const id = uuidv4();
    setNotifications(prev => [
      {
        ...notification,
        id,
        timestamp: Date.now()
      },
      ...prev // Add to beginning for newest-first order
    ]);
  }, []);

  // Dismiss a notification by ID
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAllNotifications
  };
};

export default useTraitNotifications;
