import { useEffect, useState } from 'react';
import { fetchNPCRelations } from '../utils/npcUtils';

const useNPCRelations = (npcId) => {
    const [relations, setRelations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRelations = async () => {
            try {
                const data = await fetchNPCRelations(npcId);
                setRelations(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadRelations();
    }, [npcId]);

    return { relations, loading, error };
};

export default useNPCRelations;