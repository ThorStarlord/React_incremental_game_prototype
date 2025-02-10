import React, { useContext } from 'react';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';

const PlayerStats = () => {
  const { player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  const handleUpgradeAttack = () => {
    const result = player.upgradeAttack();
    if (result.success) {
      dispatch({ type: 'UPDATE_PLAYER', payload: result.updatedStats });
    } else {
      alert(result.message);
    }
  };

  const handleUpgradeDefense = () => {
    const result = player.upgradeDefense();
    if (result.success) {
      dispatch({ type: 'UPDATE_PLAYER', payload: result.updatedStats });
    } else {
      alert(result.message);
    }
  };

  const handleUpgradeHp = () => {
    const result = player.upgradeHp();
    if (result.success) {
      dispatch({ type: 'UPDATE_PLAYER', payload: result.updatedStats });
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="player-stats">
      <h2>Player Stats</h2>
      <p>Name: Hero</p>
      <p>HP: {player.hp}</p>
      <p>Attack: {player.attack}</p>
      <p>Defense: {player.defense}</p>
      <p>Stat Points: {player.statPoints}</p>
      <div className="upgrade-buttons">
        <button onClick={handleUpgradeAttack}>Upgrade Attack</button>
        <button onClick={handleUpgradeDefense}>Upgrade Defense</button>
        <button onClick={handleUpgradeHp}>Upgrade HP</button>
      </div>
    </div>
  );
};

export default PlayerStats;