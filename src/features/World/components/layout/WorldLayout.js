import React from 'react';
import './WorldLayout.css';

const WorldLayout = ({ children }) => {
    return (
        <div className="world-layout">
            <header className="world-header">
                <h1>World Overview</h1>
            </header>
            <main className="world-content">
                {children}
            </main>
            <footer className="world-footer">
                <p>Explore the vast world!</p>
            </footer>
        </div>
    );
};

export default WorldLayout;