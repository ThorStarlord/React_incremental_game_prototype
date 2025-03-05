import { useState, useEffect, useCallback } from 'react';
import { useGameState } from '../../../context/GameStateContext';

/**
 * Interface for trait notification objects
 */
interface TraitNotification {
  /** Unique ID for the notification */
  id: string;
  /** Type of notification (equip, unequip, etc.) */
  type: string;
  /** ID of the trait related to this notification */
  traitId: string;
  /** Display message for the notification */
  message: string;
  /** Description text for additional details */
  description: string;
  /** Timestamp when the notification was created */
  timestamp: number;
}

/**
 * Return type for the useTraitNotifications hook
 */
interface UseTraitNotificationsResult {
  /** List of active notifications */
  notifications: TraitNotification[];
  /** Function to dismiss a specific notification */
  dismissNotification: (id: string) => void;
}

/**
 * Custom hook for managing trait-related notifications
 * Uses defensive programming to prevent "Cannot read properties of undefined" errors
 * 
 * @returns Notification state and functions
 */
const useTraitNotifications = (): UseTraitNotificationsResult => {
  // Initialize with an empty array to prevent undefined.length issues
  const [notifications, setNotifications] = useState<TraitNotification[]>([]);
  const { player = {}, traits = {} } = useGameState();
  
  // Get equipped traits safely with default empty array
  const equippedTraits = Array.isArray(player?.equippedTraits) ? player.equippedTraits : [];
  // Get acquired traits safely with default empty array
  const acquiredTraits = Array.isArray(player?.acquiredTraits) ? player.acquiredTraits : [];
  // Get copyable traits safely with default empty object
  const copyableTraits = traits?.copyableTraits || {};
  
  // Track previous equipped traits to detect changes
  const [prevEquippedTraits, setPrevEquippedTraits] = useState<string[]>([]);
  
  // Check for new trait activations whenever equipped traits change
  useEffect(() => {
    // Guard clause - if equippedTraits is not an array, don't proceed
    if (!Array.isArray(equippedTraits)) {
      return;
    }
    
    // Only run this effect if equippedTraits has actually changed
    const newTraitIds = equippedTraits.filter(traitId => !prevEquippedTraits.includes(traitId));
    const removedTraitIds = prevEquippedTraits.filter(traitId => !equippedTraits.includes(traitId));
    
    // Create notifications for newly equipped traits
    if (newTraitIds.length > 0) {
      const newNotifications: TraitNotification[] = newTraitIds.map(traitId => {
        const trait = copyableTraits[traitId];
        return {
          id: `trait-equipped-${traitId}-${Date.now()}`,
          type: 'equip',
          traitId,
          message: `Equipped: ${trait?.name || traitId}`,
          description: trait?.description || '',
          timestamp: Date.now()
        };
      });
      
      setNotifications(prev => [...prev, ...newNotifications]);
    }
    
    // Create notifications for removed traits
    if (removedTraitIds.length > 0) {
      const removedNotifications: TraitNotification[] = removedTraitIds.map(traitId => {
        const trait = copyableTraits[traitId];
        return {
          id: `trait-unequipped-${traitId}-${Date.now()}`,
          type: 'unequip',
          traitId,
          message: `Unequipped: ${trait?.name || traitId}`,
          description: trait?.description || '',
          timestamp: Date.now()
        };
      });
      
      setNotifications(prev => [...prev, ...removedNotifications]);
    }
    
    // Update previous equipped traits
    setPrevEquippedTraits(equippedTraits);
  }, [equippedTraits, prevEquippedTraits, copyableTraits]);
  
  // Function to dismiss a notification
  const dismissNotification = useCallback((id: string): void => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Auto-dismiss notifications after a delay
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        // Remove oldest notification
        setNotifications(prev => prev.slice(1));
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications]);
  
  return {
    notifications,
    dismissNotification
  };
};

export default useTraitNotifications;
