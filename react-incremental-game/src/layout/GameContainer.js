import React from 'react';
import './styles/GameContainer.css';

const GameContainer = ({ children }) => {
    return (
        <div className="game-container">
            {children}
        </div>
    );
};

export default GameContainer;