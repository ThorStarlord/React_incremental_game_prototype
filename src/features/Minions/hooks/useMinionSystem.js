import { useState, useEffect } from 'react';

const useMinionSystem = () => {
    const [minions, setMinions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch minion data from an API or local storage
        const fetchMinions = async () => {
            try {
                // Simulating an API call
                const response = await fetch('/api/minions');
                const data = await response.json();
                setMinions(data);
            } catch (error) {
                console.error('Error fetching minions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMinions();
    }, []);

    const addMinion = (newMinion) => {
        setMinions((prevMinions) => [...prevMinions, newMinion]);
    };

    const removeMinion = (minionId) => {
        setMinions((prevMinions) => prevMinions.filter(minion => minion.id !== minionId));
    };

    return {
        minions,
        loading,
        addMinion,
        removeMinion,
    };
};

export default useMinionSystem;