import React from 'react';
import './styles/Header.css';

const Header = () => {
    return (
        <header className="header">
            <h1 className="header-title">Incremental Game</h1>
            <nav className="header-nav">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/minions">Minions</a></li>
                    <li><a href="/traits">Traits</a></li>
                    <li><a href="/settings">Settings</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;