import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GameContainer from '../components/GameContainer';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GameContainer />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
}

export default AppRouter;