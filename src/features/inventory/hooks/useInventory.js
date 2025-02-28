import { useState, useEffect } from 'react';
import { getItems } from '../data/items';
import { useInventoryContext } from '../../../context/GameStateContext';

const useInventory = () => {
    const { inventory, setInventory } = useInventoryContext();
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const fetchedItems = await getItems();
            setItems(fetchedItems);
        };

        fetchItems();
    }, []);

    const addItem = (item) => {
        setInventory((prevInventory) => [...prevInventory, item]);
    };

    const removeItem = (itemId) => {
        setInventory((prevInventory) => prevInventory.filter(item => item.id !== itemId));
    };

    return {
        items,
        inventory,
        addItem,
        removeItem,
    };
};

export default useInventory;