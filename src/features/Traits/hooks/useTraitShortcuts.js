// This file contains a custom hook for managing trait shortcuts in the game.

import { useEffect } from 'react';

const useTraitShortcuts = (onTraitActivate) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Check if the key pressed corresponds to a trait shortcut
            if (event.key.startsWith('F') && !isNaN(event.key.slice(1))) {
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