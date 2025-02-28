import React from 'react';
import { Link } from 'react-router-dom';
import './MainMenu.css';

const MainMenu = () => {
    return (
        <div className="main-menu">
            <h1>Welcome to the Incremental Game!</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/traits">Traits</Link>
                    </li>
                    <li>
                        <Link to="/minions">Minions</Link>
                    </li>
                    <li>
                        <Link to="/quests">Quests</Link>
                    </li>
                    <li>
                        <Link to="/settings">Settings</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default MainMenu;