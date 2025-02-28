import React from 'react';
import PropTypes from 'prop-types';
import './RelationshipProgress.css';

const RelationshipProgress = ({ relationshipLevel }) => {
    return (
        <div className="relationship-progress">
            <h3>Relationship Level: {relationshipLevel}</h3>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${relationshipLevel}%` }}></div>
            </div>
        </div>
    );
};

RelationshipProgress.propTypes = {
    relationshipLevel: PropTypes.number.isRequired,
};

export default RelationshipProgress;