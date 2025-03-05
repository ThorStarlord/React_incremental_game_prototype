// This file contains a custom hook for managing trait shortcuts in the game.

import { useEffect } from 'react';

/**
 * Custom hook for handling function key shortcuts to activate traits
 * 
 * @param onTraitActivate - Callback function to trigger when a trait shortcut is pressed
 */
const useTraitShortcuts = (onTraitActivate: (traitIndex: number) => void): void => {
    useEffect(() => {
        /**
         * Handles keydown events and triggers trait activation when F-keys are pressed
         * 
         * @param event - Keyboard event object
         */
        const handleKeyDown = (event: KeyboardEvent): void => {
            // Check if the key pressed corresponds to a trait shortcut
            if (event.key.startsWith('F') && !isNaN(parseInt(event.key.slice(1), 10))) {
                const traitIndex = parseInt(event.key.slice(1), 10) - 1;
                onTraitActivate(traitIndex);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onTraitActivate]);
};

export default useTraitShortcuts;
