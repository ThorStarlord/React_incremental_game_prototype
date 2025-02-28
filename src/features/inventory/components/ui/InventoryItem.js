import React from 'react';
import PropTypes from 'prop-types';
import './InventoryItem.css';

const InventoryItem = ({ item, onUse }) => {
    return (
        <div className="inventory-item">
            <h3 className="item-name">{item.name}</h3>
            <p className="item-description">{item.description}</p>
            <button className="use-button" onClick={() => onUse(item.id)}>
                Use
            </button>
        </div>
    );
};

InventoryItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    onUse: PropTypes.func.isRequired,
};

export default InventoryItem;