import { useEffect } from 'react';
import { useNotification } from '../../../shared/hooks/resourceHooks';

const useTraitNotifications = (traits) => {
    const { notify } = useNotification();

    useEffect(() => {
        if (traits.length > 0) {
            traits.forEach(trait => {
                notify(`Trait activated: ${trait.name}`);
            });
        }
    }, [traits, notify]);
};

export default useTraitNotifications;