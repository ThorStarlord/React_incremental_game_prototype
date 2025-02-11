import React, { useContext, useState, useEffect } from 'react';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import '../styles/Battle.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const Battle = () => {
  const { enemies, player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const [selectedMonsterId, setSelectedMonsterId] = useState(null);
  const [battleStarted, setBattleStarted] = useState(false);
  const [playerHP, setPlayerHP] = useState(null);
  const [enemyHP, setEnemyHP] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [currentMonster, setCurrentMonster] = useState(null);

  const handleSelectMonster = (id) => {
    setSelectedMonsterId(id);
  };

  // Start the battle by initializing HP and log details.
  const handleStartBattle = () => {
    if (!selectedMonsterId) {
      alert("Please select a monster first.");
      return;
    }
    const monster = enemies.find(enemy => enemy.id === selectedMonsterId);
    setCurrentMonster(monster);
    setPlayerHP(player.hp);
    setEnemyHP(monster.hp);
    setBattleLog([
      `Battle Started! ${player.name} (HP: ${player.hp}, Attack: ${player.attack}, Defense: ${player.defense}) vs ${monster.name} (HP: ${monster.hp}, Attack: ${monster.attack}, Defense: ${monster.defense})`
    ]);
    setBattleStarted(true);
  };

  // Execute one cycle of attack where both sides take turns.
  const handleAttack = () => {
    if (!battleStarted || !currentMonster) return;

    // Player attacks monster.
    const playerDamage = Math.max(0, player.attack - currentMonster.defense);
    const newEnemyHP = Math.max(0, enemyHP - playerDamage);
    let logEntry = `${player.name} attacks ${currentMonster.name} for ${playerDamage} damage. ${currentMonster.name} HP: ${newEnemyHP}`;
    setBattleLog(prevLog => [...prevLog, logEntry]);
    setEnemyHP(newEnemyHP);

    // Check if the monster is defeated.
    if (newEnemyHP === 0) {
      setBattleLog(prevLog => [
        ...prevLog,
        `${currentMonster.name} has been defeated! You gain 1 stat point.`
      ]);
      // Player gains 1 stat point.
      const updatedPlayer = { ...player, statPoints: player.statPoints + 1 };
      dispatch({ type: 'UPDATE_PLAYER', payload: updatedPlayer });
      setBattleStarted(false);
      return;
    }

    // Monster attacks player.
    const enemyDamage = Math.max(0, currentMonster.attack - player.defense);
    const newPlayerHP = Math.max(0, playerHP - enemyDamage);
    logEntry = `${currentMonster.name} attacks ${player.name} for ${enemyDamage} damage. ${player.name} HP: ${newPlayerHP}`;
    setBattleLog(prevLog => [...prevLog, logEntry]);
    setPlayerHP(newPlayerHP);

    // Check if the player is defeated.
    if (newPlayerHP === 0) {
      setBattleLog(prevLog => [
        ...prevLog,
        `${player.name} has been defeated!`
      ]);
      setBattleStarted(false);
    }
  };

  // Auto-attack loop runs while the battle is active.
  useEffect(() => {
    if (battleStarted) {
      const intervalId = setInterval(() => {
        handleAttack();
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [battleStarted, enemyHP, playerHP]);

  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        {!battleStarted ? (
          <div>
            <h3>Select a Monster</h3>
            {enemies && enemies.length > 0 ? (
              <ul>
                {enemies.map((enemy) => (
                  <li key={enemy.id}>
                    <label>
                      <input
                        type="radio"
                        name="selectedMonster"
                        value={enemy.id}
                        onChange={() => handleSelectMonster(enemy.id)}
                        checked={selectedMonsterId === enemy.id}
                      />
                      {enemy.name} (HP: {enemy.hp}, Attack: {enemy.attack}, Defense: {enemy.defense})
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No enemies available!</p>
            )}
            <Button variant="contained" onClick={handleStartBattle}>Start Battle</Button>
          </div>
        ) : null}
      </Grid>
      <Grid item xs={12} md={6}>
        {battleStarted ? (
          <div>
            <h3>Battle in Progress</h3>
            <p>
              {player.name}: {playerHP} HP | {currentMonster.name}: {enemyHP} HP
            </p>
            <div className="battle-log">
              <h4>Battle Log</h4>
              {battleLog.map((entry, index) => (
                <p key={index}>{entry}</p>
              ))}
            </div>
          </div>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default Battle;