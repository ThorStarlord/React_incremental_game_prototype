import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import MainMenu from './pages/MainMenu';
import Settings from './pages/Settings';
import MinionsPage from './pages/MinionsPage';
import TraitsPage from './pages/TraitsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={MainMenu} />
          <Route path="/settings" component={Settings} />
          <Route path="/minions" component={MinionsPage} />
          <Route path="/traits" component={TraitsPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;