import { useEffect, useCallback, useRef, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
// FIXED: Import selector from correct file
import { selectTraits } from '../state/TraitsSelectors';
// FIXED: Import correct selector from Player
import { selectPlayerTraitSlots } from '../../Player/state/PlayerSelectors';
// FIXED: Import actions from PlayerSlice
import { equipTrait, unequipTrait } from '../../Player/state/PlayerSlice';
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

const useTraitHotkeys = (): UseTraitHotkeysReturn => {
  const dispatch = useAppDispatch();
  const allTraits = useAppSelector(selectTraits);
  const traitSlots = useAppSelector(selectPlayerTraitSlots); // FIXED

  const traitsArray: Trait[] = useMemo(() => Object.values(allTraits), [allTraits]);

  const hotkeyMapRef = useRef<Record<string, string>>({});

  const config: ShortcutConfig = {
    enabled: true,
    showNotifications: true
  };

  const setConfig = useCallback((newConfig: Partial<ShortcutConfig>): void => {
    console.warn("setConfig is not fully implemented. Settings persistence requires a Redux action.");
  }, []);

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
  }, [traitsArray, config.showNotifications]);

  const unregisterTraitHotkey = useCallback((traitId: string): void => {
    Object.keys(hotkeyMapRef.current).forEach(key => {
      if (hotkeyMapRef.current[key] === traitId) {
        delete hotkeyMapRef.current[key];
      }
    });
    console.log(`Hotkey for trait ${traitId} unregistered.`);
  }, []);

  const clearAllHotkeys = useCallback((): void => {
    hotkeyMapRef.current = {};
    if (config.showNotifications) {
      console.log('All trait hotkeys cleared');
    }
  }, [config.showNotifications]);

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
    if (!config.enabled || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

    const key = event.key.toLowerCase();
    const traitId = hotkeyMapRef.current[key];
    if (!traitId) return;

    const trait = traitsArray.find((t: Trait) => t.id === traitId);
    if (!trait) return;

    const equippedSlot = traitSlots.find((slot: TraitSlot) => slot.traitId === traitId);

    if (equippedSlot) {
      dispatch(unequipTrait({ slotIndex: equippedSlot.slotIndex }));
      if (config.showNotifications) {
        console.log(`Unequipped ${trait.name} with hotkey ${key}`);
      }
      return;
    }

    // FIXED: Use `isLocked` instead of `isUnlocked`
    const availableSlot = traitSlots.find((slot: TraitSlot) => !slot.isLocked && !slot.traitId);

    if (availableSlot) {
      dispatch(equipTrait({ traitId, slotIndex: availableSlot.slotIndex }));
      if (config.showNotifications) {
        console.log(`Equipped ${trait.name} to slot ${availableSlot.slotIndex + 1} with hotkey ${key}`);
      }
    } else if (config.showNotifications) {
      console.log('No available trait slots');
    }
  }, [traitsArray, traitSlots, dispatch, config]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

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