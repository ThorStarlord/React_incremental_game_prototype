import { useEffect, useCallback, useRef, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { RootState } from '../../../app/store';
import {
  selectTraits
} from '../state/TraitsSlice';
import { selectTraitSlots } from '../../Player/state/PlayerSelectors'; // Corrected import path
import { equipTrait, unequipTrait } from '../../Player/state/PlayerSlice'; // Corrected import path
import { Trait, TraitSlot } from '../state/TraitsTypes';

interface ShortcutConfig {
  enabled: boolean;
  showNotifications: boolean;
}

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
 * Hook for managing trait keyboard hotkeys using Redux state
 *
 * @returns {UseTraitHotkeysReturn} Functions to manage trait hotkeys
 */
const useTraitHotkeys = (): UseTraitHotkeysReturn => {
  const dispatch = useAppDispatch();
  const allTraits = useAppSelector(selectTraits);
  const traitSlots = useAppSelector(selectTraitSlots);

  const traitsArray: Trait[] = useMemo(() => Object.values(allTraits), [allTraits]);

  const hotkeyMapRef = useRef<Record<string, string>>({});

  const config: ShortcutConfig = {
    enabled: true,
    showNotifications: true
  };

  const setConfig = useCallback((newConfig: Partial<ShortcutConfig>): void => {
    console.warn("setConfig is not fully implemented. Settings persistence requires a Redux action.");
  }, [dispatch, config]);

  const registerTraitHotkey = useCallback((traitId: string, key: string): void => {
    Object.keys(hotkeyMapRef.current).forEach(existingKey => {
      if (existingKey.toLowerCase() === key.toLowerCase()) {
        delete hotkeyMapRef.current[existingKey];
      }
    });

    hotkeyMapRef.current[key.toLowerCase()] = traitId;

    if (config.showNotifications) {
      const trait = traitsArray.find((t: Trait) => t.id === traitId);
      console.log(`Hotkey ${key} assigned to ${trait?.name || 'trait'}`);
    }
  }, [traitsArray, dispatch, config.showNotifications]);

  const unregisterTraitHotkey = useCallback((traitId: string): void => {
    Object.keys(hotkeyMapRef.current).forEach(key => {
      if (hotkeyMapRef.current[key] === traitId) {
        delete hotkeyMapRef.current[key];
      }
    });

    console.log(`Hotkey for trait ${traitId} unregistered.`);
  }, [dispatch]);

  const clearAllHotkeys = useCallback((): void => {
    hotkeyMapRef.current = {};

    if (config.showNotifications) {
      console.log('All trait hotkeys cleared');
    }
  }, [dispatch, config.showNotifications]);

  const isHotkeyRegistered = useCallback((key: string): boolean => {
    return Object.keys(hotkeyMapRef.current).some(
      existingKey => existingKey.toLowerCase() === key.toLowerCase()
    );
  }, []);

  const getKeyForTrait = useCallback((traitId: string): string | null => {
    const entries = Object.entries(hotkeyMapRef.current);
    const found = entries.find(([_, id]) => id === traitId);
    return found ? found[0] : null;
  }, []);

  const getTraitForKey = useCallback((key: string): Trait | null => {
    const traitId = hotkeyMapRef.current[key.toLowerCase()];
    if (!traitId) return null;
    return traitsArray.find((t: Trait) => t.id === traitId) || null;
  }, [traitsArray]);

  const handleKeyDown = useCallback((event: KeyboardEvent): void => {
    if (!config.enabled) return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    const key = event.key.toLowerCase();
    const traitId = hotkeyMapRef.current[key];
    if (!traitId) return;

    const trait = traitsArray.find((t: Trait) => t.id === traitId);
    if (!trait) return;

    const equippedSlot = traitSlots.find((slot: TraitSlot) => slot.traitId === traitId);

    if (equippedSlot) {
      dispatch(unequipTrait({ slotIndex: equippedSlot.index })); // Dispatch with slotIndex

      if (config.showNotifications) {
        console.log(`Unequipped ${trait.name} with hotkey ${key}`);
      }
      return;
    }

    const availableSlot = traitSlots.find((slot: TraitSlot) => slot.isUnlocked && !slot.traitId);

    if (availableSlot) {
      dispatch(equipTrait({ traitId, slotIndex: availableSlot.index }));

      if (config.showNotifications) {
        console.log(`Equipped ${trait.name} to slot ${availableSlot.index + 1} with hotkey ${key}`);
      }
    } else if (config.showNotifications) {
      console.log('No available trait slots');
    }
  }, [traitsArray, traitSlots, dispatch, config]);

  useEffect(() => {
    const initialHotkeys: Record<string, string> = {};
    traitsArray.forEach((trait: Trait) => {
      const savedHotkey = (trait as any).hotkey;
      if (savedHotkey) {
        initialHotkeys[savedHotkey.toLowerCase()] = trait.id;
      }
    });
    hotkeyMapRef.current = initialHotkeys;
  }, [traitsArray]);

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
