import { useEffect } from 'react';

const useTraitHotkeys = (onTraitActivate) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
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