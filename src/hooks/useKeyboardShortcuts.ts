import { useEffect, useRef, useCallback } from 'react';

interface ShortcutAction {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description?: string;
}

export function useKeyboardShortcuts() {
  const shortcuts = useRef<ShortcutAction[]>([]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    for (const shortcut of shortcuts.current) {
      if (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!event.ctrlKey === !!shortcut.ctrl &&
        !!event.shiftKey === !!shortcut.shift &&
        !!event.altKey === !!shortcut.alt
      ) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const registerShortcut = useCallback((shortcutAction: ShortcutAction) => {
    shortcuts.current.push(shortcutAction);

    return () => {
      shortcuts.current = shortcuts.current.filter(
        s => !(s.key === shortcutAction.key && 
               s.ctrl === shortcutAction.ctrl && 
               s.shift === shortcutAction.shift && 
               s.alt === shortcutAction.alt)
      );
    };
  }, []);

  const getShortcuts = useCallback(() => {
    return [...shortcuts.current];
  }, []);

  return {
    registerShortcut,
    getShortcuts
  };
}
