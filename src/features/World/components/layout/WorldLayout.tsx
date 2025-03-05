import React from 'react';
import './WorldLayout.css';

/**
 * Interface for WorldLayout props
 * 
 * @interface WorldLayoutProps
 * @property {React.ReactNode} children - Child components to be rendered in the layout
 */
interface WorldLayoutProps {
    children: React.ReactNode;
}

/**
 * WorldLayout Component
 * 
 * A layout wrapper for the world view that provides header and footer elements
 * 
 * @param {WorldLayoutProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
const WorldLayout: React.FC<WorldLayoutProps> = ({ children }) => {
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
