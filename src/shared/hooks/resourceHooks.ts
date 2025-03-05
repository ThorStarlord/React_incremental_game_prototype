import { useContext, useCallback, useState } from 'react';
import { useGameState, useGameDispatch } from '../../context';
import { RESOURCE_TYPES, GENERATION_RATES } from '../../constants/gameConstants';

/**
 * Interface for essence manager hook return value
 */
interface UseEssenceManagerReturn {
  essence: number;
  gainEssence: (amount: number) => void;
  spendEssence: (amount: number) => boolean;
  hasEnoughEssence: (amount: number) => boolean;
}

/**
 * Interface for affinities object
 */
interface Affinities {
  [npcId: string]: string;
}

/**
 * Interface for affinity manager hook return value
 */
interface UseAffinityManagerReturn {
  affinities: Affinities;
  updateAffinity: (npcId: string, level: string) => void;
  getAffinityLevel: (npcId: string) => string;
}

/**
 * Interface for faction object
 */
interface Faction {
  id: string;
  name: string;
  [key: string]: any; // Additional faction properties
}

/**
 * Interface for faction data when creating new faction
 */
interface FactionData {
  name: string;
  description?: string;
  [key: string]: any; // Additional faction properties
}

/**
 * Interface for faction manager hook return value
 */
interface UseFactionManagerReturn {
  factions: Faction[];
  createFaction: (factionData: FactionData) => void;
  joinFaction: (factionId: string, role?: string) => void;
}

/**
 * Interface for notification options
 */
interface NotificationOptions {
  open?: boolean;
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

/**
 * Interface for notification object
 */
interface Notification {
  open: boolean;
  message?: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
}

/**
 * Interface for notification hook return value
 */
interface UseNotificationReturn {
  notification: Notification;
  showNotification: (notificationOptions: NotificationOptions) => void;
}

export const useEssenceManager = (): UseEssenceManagerReturn => {
  const { essence = 0 } = useGameState();
  const dispatch = useGameDispatch();

  const gainEssence = useCallback((amount: number): void => {
    dispatch({ type: 'GAIN_ESSENCE', payload: amount });
  }, [dispatch]);

  const spendEssence = useCallback((amount: number): boolean => {
    if (essence >= amount) {
      dispatch({ type: 'SPEND_ESSENCE', payload: amount });
      return true;
    }
    return false;
  }, [essence, dispatch]);

  const hasEnoughEssence = useCallback((amount: number): boolean => {
    return essence >= amount;
  }, [essence]);

  return {
    essence,
    gainEssence,
    spendEssence,
    hasEnoughEssence
  };
};

export const useAffinityManager = (): UseAffinityManagerReturn => {
  const { affinities = {} } = useGameState();
  const dispatch = useGameDispatch();

  const updateAffinity = useCallback((npcId: string, level: string): void => {
    dispatch({ 
      type: 'UPDATE_AFFINITY', 
      payload: { npcId, level } 
    });
  }, [dispatch]);

  const getAffinityLevel = useCallback((npcId: string): string => {
    return affinities && affinities[npcId] ? affinities[npcId] : 'Stranger';
  }, [affinities]);

  return {
    affinities,
    updateAffinity,
    getAffinityLevel
  };
};

export const useFactionManager = (): UseFactionManagerReturn => {
  const { factions = [] } = useGameState();
  const dispatch = useGameDispatch();

  const createFaction = useCallback((factionData: FactionData): void => {
    dispatch({
      type: 'CREATE_FACTION',
      payload: { faction: factionData }
    });
  }, [dispatch]);

  const joinFaction = useCallback((factionId: string, role: string = 'Member'): void => {
    dispatch({
      type: 'JOIN_FACTION',
      payload: { factionId, role }
    });
  }, [dispatch]);

  return {
    factions,
    createFaction,
    joinFaction
  };
};

/**
 * Hook for managing game notifications
 * 
 * @returns {UseNotificationReturn} Notification functions
 */
export const useNotification = (): UseNotificationReturn => {
  const dispatch = useGameDispatch();
  
  const [notification, setNotification] = useState<Notification>({ open: false });
  
  /**
   * Display a notification to the user
   * 
   * @param {NotificationOptions} notificationOptions - The notification options
   */
  const showNotification = useCallback((notificationOptions: NotificationOptions): void => {
    setNotification({
      open: notificationOptions.open !== undefined ? notificationOptions.open : true,
      message: notificationOptions.message || '',
      severity: notificationOptions.severity || 'info'
    });
  }, []);
  
  return { notification, showNotification };
};
