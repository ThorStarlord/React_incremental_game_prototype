import React, { useContext, useState, useEffect } from 'react';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import '../styles/Battle.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';

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

  const handleStartBattle = () => {
    if (!selectedMonsterId) {
      alert("Please select a monster first.");
      return;
    }
    const monster = enemies.find((enemy) => enemy.id === selectedMonsterId);
    setCurrentMonster(monster);
    setPlayerHP(player.hp);
    setEnemyHP(monster.hp);
    setBattleLog([
      `Battle Started! ${player.name} (HP: ${player.hp}, Attack: ${player.attack}, Defense: ${player.defense}) vs ${monster.name} (HP: ${monster.hp}, Attack: ${monster.attack}, Defense: ${monster.defense})`,
    ]);
    setBattleStarted(true);
  };

  const handleAttack = () => {
    if (!battleStarted || !currentMonster) return;

    // Player attacks monster.
    const playerDamage = Math.max(0, player.attack - currentMonster.defense);
    const newEnemyHP = Math.max(0, enemyHP - playerDamage);
    let logEntry = `${player.name} attacks ${currentMonster.name} for ${playerDamage} damage. ${currentMonster.name} HP: ${newEnemyHP}`;
    setBattleLog((prevLog) => [...prevLog, logEntry]);
    setEnemyHP(newEnemyHP);

    // Check if the monster is defeated.
    if (newEnemyHP === 0) {
      setBattleLog((prevLog) => [
        ...prevLog,
        `${currentMonster.name} has been defeated! You gain 1 stat point.`,
      ]);
      const updatedPlayer = { ...player, statPoints: player.statPoints + 1 };
      dispatch({ type: 'UPDATE_PLAYER', payload: updatedPlayer });
      setBattleStarted(false);
      return;
    }

    // Monster attacks player.
    const enemyDamage = Math.max(0, currentMonster.attack - player.defense);
    const newPlayerHP = Math.max(0, playerHP - enemyDamage);
    logEntry = `${currentMonster.name} attacks ${player.name} for ${enemyDamage} damage. ${player.name} HP: ${newPlayerHP}`;
    setBattleLog((prevLog) => [...prevLog, logEntry]);
    setPlayerHP(newPlayerHP);

    // Check if the player is defeated.
    if (newPlayerHP === 0) {
      setBattleLog((prevLog) => [
        ...prevLog,
        `${player.name} has been defeated!`,
      ]);
      setBattleStarted(false);
    }
  };

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
      {/* Left Section */}
      <Grid item xs={3}>
        <Box sx={{
          padding: 2,
          backgroundColor: '#e0f7fa',
          border: '1px solid #9e9e9e',
          borderRadius: '8px',
          height: '100%', // Ensure it stretches vertically
        }}>
          {!battleStarted ? (
            <div>
              <Typography variant="h5" component="h3">Select a Monster</Typography>
              {enemies && enemies.length > 0 ? (
                <List>
                  {enemies.map((enemy) => (
                    <ListItem key={enemy.id}>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={selectedMonsterId === enemy.id}
                            onChange={() => handleSelectMonster(enemy.id)}
                            value={enemy.id}
                            name="selectedMonster"
                          />
                        }
                        label={`${enemy.name} (HP: ${enemy.hp}, Attack: ${enemy.attack}, Defense: ${enemy.defense})`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No enemies available!</Typography>
              )}
              <Button variant="contained" color="success" onClick={handleStartBattle}>Start Battle</Button>
            </div>
          ) : null}
        </Box>
      </Grid>

      {/* Center Section */}
      <Grid item xs={6}>
        <Box sx={{
          padding: 2,
          backgroundColor: '#f5f5f5',
          border: '1px solid lightgray',
          borderRadius: '8px',
          textAlign: 'center', // Center-align text inside
          margin: '0 auto', // Center the box horizontally
        }}>
          {battleStarted ? (
            <div>
              <Typography variant="h5" component="h3">Battle in Progress</Typography>
              <Typography>
                {player.name}: {playerHP} HP | {currentMonster.name}: {enemyHP} HP
              </Typography>
              <div className="battle-log">
                <Typography variant="h6" component="h4">Battle Log</Typography>
                {battleLog.map((entry, index) => (
                  <Typography key={index} variant="body2" sx={{ color: '#424242' }}>{entry}</Typography>
                ))}
              </div>
            </div>
          ) : null}
        </Box>
      </Grid>

      {/* Right Section */}
      <Grid item xs={3}>
        <Box sx={{
          padding: 2,
          backgroundColor: '#e0e0e0',
          border: '1px solid #9e9e9e',
          borderRadius: '8px',
          height: '100%', // Ensure it stretches vertically
        }}>
          <Typography variant="h5" component="h3">Player Stats</Typography>
          <Typography>HP: {player.hp}</Typography>
          <Typography>Attack: {player.attack}</Typography>
          <Typography>Defense: {player.defense}</Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Battle;