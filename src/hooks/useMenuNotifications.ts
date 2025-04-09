import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timeout?: number;
}

export function useMenuNotifications() {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback((message: string, type: Notification['type'] = 'info', timeout = 5000) => {
    const id = Date.now().toString();
    setNotification({
      id,
      message,
      type,
      timeout
    });
    
    if (timeout > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, timeout);
    }
  }, []);

  const dismissNotification = useCallback((id?: string) => {
    setNotification(prev => {
      if (!id || (prev && prev.id === id)) {
        return null;
      }
      return prev;
    });
  }, []);

  return {
    notification,
    showNotification,
    dismissNotification
  };
}
