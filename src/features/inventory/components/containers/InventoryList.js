import React from 'react';
import { useInventory } from '../../hooks/useInventory';
import InventoryItem from '../ui/InventoryItem';
import './InventoryList.css';

const InventoryList = () => {
    const { items } = useInventory();

    return (
        <div className="inventory-list">
            {items.length === 0 ? (
                <p>No items in inventory.</p>
            ) : (
                items.map(item => (
                    <InventoryItem key={item.id} item={item} />
                ))
            )}
        </div>
    );
};

export default InventoryList;