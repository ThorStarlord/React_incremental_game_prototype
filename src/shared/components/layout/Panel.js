import React from 'react';
import './Panel.css'; // Assuming you have a CSS file for styling

const Panel = ({ title, children }) => {
    return (
        <div className="panel">
            {title && <h2 className="panel-title">{title}</h2>}
            <div className="panel-content">
                {children}
            </div>
        </div>
    );
};

export default Panel;