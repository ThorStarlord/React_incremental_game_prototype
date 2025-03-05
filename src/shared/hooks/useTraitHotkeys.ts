import { useEffect, useCallback, useRef } from 'react';
import { useGameState, useGameDispatch } from '../../context';

/**
 * Interface for a trait object
 */
interface Trait {
  id: string;
  name: string;
  slotId?: string | null;
  hotkey?: string;
  isActive?: boolean;
  [key: string]: any; // Other trait properties
}

/**
 * Interface for a trait slot
 */
interface TraitSlot {
  id: string;
  index: number;
  isUnlocked: boolean;
  traitId?: string | null;
}

/**
 * Interface for shortcut configuration
 */
interface ShortcutConfig {
  enabled: boolean;
  showNotifications: boolean;
}

/**
 * Interface for hook return value
 */
interface UseTraitHotkeysReturn {
  registerTraitHotkey: (traitId: string, key: string) => void;
  unregisterTraitHotkey: (traitId: string) => void;
  clearAllHotkeys: () => void;
  isHotkeyRegistered: (key: string) => boolean;
  getKeyForTrait: (traitId: string) => string | null;
  getTraitForKey: (key: string) => Trait | null;
  config: ShortcutConfig;
  setConfig: (newConfig: Partial<ShortcutConfig>) => void;
}

/**
 * Hook for managing trait keyboard hotkeys
 * 
 * @returns {UseTraitHotkeysReturn} Functions to manage trait hotkeys
 */
const useTraitHotkeys = (): UseTraitHotkeysReturn => {
  const { traits = [], traitSlots = [], settings = {} } = useGameState();
  const dispatch = useGameDispatch();
  
  // Reference to store hotkey mappings that persists across renders
  const hotkeyMapRef = useRef<Record<string, string>>({}); // key -> traitId
  
  // Get configuration from settings or use defaults
  const config = {
    enabled: settings.traitHotkeysEnabled ?? true,
    showNotifications: settings.traitHotkeyNotifications ?? true
  };
  
  /**
   * Set or update hotkey configuration
   * 
   * @param {Partial<ShortcutConfig>} newConfig - New configuration options
   */
  const setConfig = useCallback((newConfig: Partial<ShortcutConfig>): void => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        traitHotkeysEnabled: newConfig.enabled !== undefined ? newConfig.enabled : config.enabled,
        traitHotkeyNotifications: newConfig.showNotifications !== undefined ? 
          newConfig.showNotifications : config.showNotifications
      }
    });
  }, [dispatch, config]);
  
  /**
   * Register a hotkey for a trait
   * 
   * @param {string} traitId - ID of the trait to assign hotkey to
   * @param {string} key - The key to use as hotkey
   */
  const registerTraitHotkey = useCallback((traitId: string, key: string): void => {
    // Remove any existing assignments for this key
    Object.keys(hotkeyMapRef.current).forEach(existingKey => {
      if (existingKey.toLowerCase() === key.toLowerCase()) {
        delete hotkeyMapRef.current[existingKey];
      }
    });
    
    // Add new hotkey mapping
    hotkeyMapRef.current[key.toLowerCase()] = traitId;
    
    // Save to persistent storage
    dispatch({
      type: 'SET_TRAIT_HOTKEY',
      payload: {
        traitId,
        hotkey: key.toLowerCase()
      }
    });
    
    // Show notification if enabled
    if (config.showNotifications) {
      const trait = traits.find(t => t.id === traitId);
      dispatch({
        type: 'SHOW_NOTIFICATION',
        payload: {
          message: `Hotkey ${key} assigned to ${trait?.name || 'trait'}`,
          severity: 'success',
          duration: 2000
        }
      });
    }
  }, [traits, dispatch, config.showNotifications]);
  
  /**
   * Remove hotkey assignment for a trait
   * 
   * @param {string} traitId - ID of the trait to unassign hotkey from
   */
  const unregisterTraitHotkey = useCallback((traitId: string): void => {
    // Find and remove hotkey for this trait
    Object.keys(hotkeyMapRef.current).forEach(key => {
      if (hotkeyMapRef.current[key] === traitId) {
        delete hotkeyMapRef.current[key];
      }
    });
    
    // Update persistent storage
    dispatch({
      type: 'SET_TRAIT_HOTKEY',
      payload: {
        traitId,
        hotkey: null
      }
    });
  }, [dispatch]);
  
  /**
   * Remove all hotkey assignments
   */
  const clearAllHotkeys = useCallback((): void => {
    hotkeyMapRef.current = {};
    
    dispatch({
      type: 'CLEAR_ALL_TRAIT_HOTKEYS'
    });
    
    if (config.showNotifications) {
      dispatch({
        type: 'SHOW_NOTIFICATION',
        payload: {
          message: 'All trait hotkeys cleared',
          severity: 'info',
          duration: 2000
        }
      });
    }
  }, [dispatch, config.showNotifications]);
  
  /**
   * Check if a key is already registered as a hotkey
   * 
   * @param {string} key - The key to check
   * @returns {boolean} Whether the key is already registered
   */
  const isHotkeyRegistered = useCallback((key: string): boolean => {
    return Object.keys(hotkeyMapRef.current).some(
      existingKey => existingKey.toLowerCase() === key.toLowerCase()
    );
  }, []);
  
  /**
   * Get the hotkey assigned to a trait
   * 
   * @param {string} traitId - ID of the trait to check
   * @returns {string|null} The assigned hotkey or null if none
   */
  const getKeyForTrait = useCallback((traitId: string): string | null => {
    const entries = Object.entries(hotkeyMapRef.current);
    const found = entries.find(([_, id]) => id === traitId);
    return found ? found[0] : null;
  }, []);
  
  /**
   * Get the trait assigned to a hotkey
   * 
   * @param {string} key - The hotkey to check
   * @returns {Trait|null} The trait object or null if none found
   */
  const getTraitForKey = useCallback((key: string): Trait | null => {
    const traitId = hotkeyMapRef.current[key.toLowerCase()];
    if (!traitId) return null;
    
    return traits.find(t => t.id === traitId) || null;
  }, [traits]);
  
  /**
   * Handle keyboard events for trait hotkeys
   * 
   * @param {KeyboardEvent} event - The keyboard event
   */
  const handleKeyDown = useCallback((event: KeyboardEvent): void => {
    // Ignore if hotkeys are disabled
    if (!config.enabled) return;
    
    // Ignore if user is typing in an input
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    const key = event.key.toLowerCase();
    // Skip if no mapping for this key
    if (!hotkeyMapRef.current[key]) return;
    
    const traitId = hotkeyMapRef.current[key];
    const trait = traits.find(t => t.id === traitId);
    
    if (!trait) return;
    
    // If trait is active (in a slot), remove it
    if (trait.isActive && trait.slotId) {
      dispatch({
        type: 'UNEQUIP_TRAIT',
        payload: {
          traitId,
          slotId: trait.slotId
        }
      });
      
      if (config.showNotifications) {
        dispatch({
          type: 'SHOW_NOTIFICATION',
          payload: {
            message: `Unequipped ${trait.name} with hotkey ${key}`,
            severity: 'info',
            duration: 1500
          }
        });
      }
      
      return;
    }
    
    // If trait is not active, try to equip it to first available slot
    const availableSlot = traitSlots.find(slot => 
      slot.isUnlocked && !slot.traitId
    );
    
    if (availableSlot) {
      dispatch({
        type: 'EQUIP_TRAIT',
        payload: {
          traitId,
          slotId: availableSlot.id
        }
      });
      
      if (config.showNotifications) {
        dispatch({
          type: 'SHOW_NOTIFICATION',
          payload: {
            message: `Equipped ${trait.name} to slot ${availableSlot.index + 1} with hotkey ${key}`,
            severity: 'success',
            duration: 1500
          }
        });
      }
    } else if (config.showNotifications) {
      // No slots available
      dispatch({
        type: 'SHOW_NOTIFICATION',
        payload: {
          message: 'No available trait slots',
          severity: 'warning',
          duration: 1500
        }
      });
    }
  }, [traits, traitSlots, dispatch, config]);
  
  // Initialize hotkey mappings from traits
  useEffect(() => {
    const initialHotkeys: Record<string, string> = {};
    
    traits.forEach(trait => {
      if (trait.hotkey) {
        initialHotkeys[trait.hotkey.toLowerCase()] = trait.id;
      }
    });
    
    hotkeyMapRef.current = initialHotkeys;
  }, []);
  
  // Set up keyboard event listener
  useEffect(() => {
    if (config.enabled) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [config.enabled, handleKeyDown]);
  
  return {
    registerTraitHotkey,
    unregisterTraitHotkey,
    clearAllHotkeys,
    isHotkeyRegistered,
    getKeyForTrait,
    getTraitForKey,
    config,
    setConfig
  };
};

export default useTraitHotkeys;
