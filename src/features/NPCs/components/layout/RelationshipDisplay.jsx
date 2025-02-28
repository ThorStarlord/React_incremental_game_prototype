import React from 'react';
import PropTypes from 'prop-types';
import './RelationshipDisplay.css';

const RelationshipDisplay = ({ relationships }) => {
    return (
        <div className="relationship-display">
            <h2>Relationships</h2>
            <ul>
                {relationships.map((relationship) => (
                    <li key={relationship.id}>
                        <span>{relationship.name}: </span>
                        <span>{relationship.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

RelationshipDisplay.propTypes = {
    relationships: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default RelationshipDisplay;