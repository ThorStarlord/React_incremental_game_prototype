import React from 'react';
import './RegionDetailsModal.css';

const RegionDetailsModal = ({ region, onClose }) => {
    if (!region) return null;

    return (
        <div className="region-details-modal">
            <div className="modal-content">
                <h2>{region.name}</h2>
                <p>{region.description}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default RegionDetailsModal;