import { useState, useCallback } from 'react';

export interface TraitNotification {
  id: string;
  title: string;
  message: string;
  traitId: string;
  traitName: string;
  type: 'positive' | 'negative' | 'neutral';
}

interface UseTraitNotificationsReturn {
  notifications: TraitNotification[];
  addNotification: (notification: Omit<TraitNotification, 'id'>) => void;
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
  const addNotification = useCallback((notification: Omit<TraitNotification, 'id'>) => {
    const id = `trait-notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setNotifications(prev => [...prev, { ...notification, id }]);
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
