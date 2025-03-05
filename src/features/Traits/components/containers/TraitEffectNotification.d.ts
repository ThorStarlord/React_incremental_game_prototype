import React from 'react';

interface NotificationObject {
  id: string | number;
  message: string;
  type?: string;
  description?: string;
  timestamp?: number;
  traitName?: string;
  value?: string | number;
}

interface TraitEffectNotificationProps {
  notifications?: NotificationObject[];
  onDismiss?: (id: string | number) => void;
}

/**
 * Component that displays notifications for trait effects
 */
declare const TraitEffectNotification: React.FC<TraitEffectNotificationProps>;

export default TraitEffectNotification;
