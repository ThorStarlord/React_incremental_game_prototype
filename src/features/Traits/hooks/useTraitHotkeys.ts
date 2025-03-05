import { useEffect } from 'react';

/**
 * Custom hook for handling keyboard hotkeys to activate traits
 * 
 * @param onTraitActivate - Callback function to trigger when a trait hotkey is pressed
 */
const useTraitHotkeys = (onTraitActivate: (traitIndex: number) => void): void => {
    useEffect(() => {
        /**
         * Handles keydown events and triggers trait activation when appropriate hotkeys are pressed
         * 
         * @param event - Keyboard event
         */
        const handleKeyDown = (event: KeyboardEvent): void => {
            // Check for specific key combinations for activating traits
            if (event.ctrlKey && event.key === '1') {
                onTraitActivate(1); // Activate trait 1
            } else if (event.ctrlKey && event.key === '2') {
                onTraitActivate(2); // Activate trait 2
            }
            // Add more key combinations as needed
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onTraitActivate]);
};

export default useTraitHotkeys;
