import React from 'react';
import Header from './Header';
import PlayerStats from './PlayerStats';
import Inventory from './Inventory';
import QuestLog from './QuestLog';
import Shop from './Shop';
import Battle from './Battle';
import Footer from './Footer';

const GameContainer = () => {
    return (
        <div className="game-container">
            <Header />
            <PlayerStats />
            <Inventory />
            <QuestLog />
            <Shop />
            <Battle />
            <Footer />
        </div>
    );
}

export default GameContainer;