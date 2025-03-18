import React from 'react';
import { type Notification } from '../../hooks/useMenuNotifications';

interface NotificationSystemProps {
  notification: Notification | null;
  onDismiss: (id: string) => void;
}

export function NotificationSystem({ notification, onDismiss }: NotificationSystemProps) {
  if (!notification) {
    return null;
  }

  const colorClasses = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  const classes = `
    fixed bottom-4 right-4 
    p-4 rounded-md shadow-md 
    border 
    flex items-center gap-2
    max-w-md
    animate-fade-in
    ${colorClasses[notification.type]}
  `;

  return (
    <div className={classes} role="alert">
      <div className="flex-1">{notification.message}</div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
