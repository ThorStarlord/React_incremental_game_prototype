import { useState, useEffect } from 'react';
import { fetchQuests } from '../data/quests';

const useQuests = () => {
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadQuests = async () => {
            try {
                const fetchedQuests = await fetchQuests();
                setQuests(fetchedQuests);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadQuests();
    }, []);

    return { quests, loading, error };
};

export default useQuests;