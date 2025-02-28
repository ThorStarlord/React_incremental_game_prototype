import { useEffect, useState } from 'react';

const useEssenceGeneration = (initialEssence) => {
    const [essence, setEssence] = useState(initialEssence);

    useEffect(() => {
        const interval = setInterval(() => {
            setEssence(prevEssence => prevEssence + 1); // Increment essence over time
        }, 1000); // Adjust the interval as needed

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return essence;
};

export default useEssenceGeneration;