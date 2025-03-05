import { useState, useEffect } from 'react';
import { fetchQuests, QuestData } from '../data/quests';

/**
 * Interface for the return value of the useQuests hook
 */
interface UseQuestsResult {
  /** Array of quests data */
  quests: QuestData[];
  /** Whether quests are currently loading */
  loading: boolean;
  /** Error that occurred during fetch, if any */
  error: Error | null;
}

/**
 * Custom hook to fetch and manage quests data
 * 
 * @returns Object containing quests data, loading state, and any errors
 */
const useQuests = (): UseQuestsResult => {
    const [quests, setQuests] = useState<QuestData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadQuests = async (): Promise<void> => {
            try {
                const fetchedQuests = await fetchQuests();
                setQuests(fetchedQuests);
            } catch (err) {
                setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                setLoading(false);
            }
        };

        loadQuests();
    }, []);

    return { quests, loading, error };
};

export default useQuests;
