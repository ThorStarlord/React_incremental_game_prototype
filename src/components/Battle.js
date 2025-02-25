import React, { useContext, useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Button, LinearProgress } from '@mui/material';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import Panel from './Panel';

const Battle = ({ dungeonId, onExplorationComplete }) => {
  const { player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const [enemy, setEnemy] = useState({
    name: 'Goblin',
    hp: 50,
    maxHp: 50,
    attack: 5,
    defense: 3
  });
  const [battleLog, setBattleLog] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const logRef = useRef(null);

  // Auto-scroll battle log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleLog]);

  const addLogEntry = (entry) => {
    setBattleLog(prev => [...prev, entry]);
  };

  const calculateDamage = (attacker, defender) => {
    const baseDamage = Math.max(1, attacker.attack - defender.defense);
    const variance = Math.floor(Math.random() * 3) - 1; // -1 to +1
    return Math.max(1, baseDamage + variance);
  };

  const handleAttack = () => {
    if (!isPlayerTurn) return;

    const damage = calculateDamage(player, enemy);
    const newEnemyHp = Math.max(0, enemy.hp - damage);
    
    addLogEntry({
      text: `${player.name} attacks ${enemy.name} for ${damage} damage!`,
      type: 'player-attack'
    });
    
    setEnemy(prev => ({ ...prev, hp: newEnemyHp }));

    if (newEnemyHp <= 0) {
      handleVictory();
    } else {
      setIsPlayerTurn(false);
      setTimeout(enemyTurn, 1000);
    }
  };

  const enemyTurn = () => {
    const damage = calculateDamage(enemy, player);
    
    addLogEntry({
      text: `${enemy.name} attacks ${player.name} for ${damage} damage!`,
      type: 'enemy-attack'
    });

    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        ...player,
        hp: Math.max(0, player.hp - damage)
      }
    });

    if (player.hp - damage <= 0) {
      handleDefeat();
    } else {
      setIsPlayerTurn(true);
    }
  };

  const handleVictory = () => {
    const reward = Math.floor(Math.random() * 10) + 5;
    addLogEntry({
      text: `Victory! Gained ${reward} gold and experience!`,
      type: 'victory'
    });
    
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        ...player,
        gold: player.gold + reward,
        experience: player.experience + reward
      }
    });

    if (onExplorationComplete) {
      setTimeout(onExplorationComplete, 2000);
    }
  };

  const handleDefeat = () => {
    addLogEntry({
      text: 'Defeat! You have been knocked out...',
      type: 'defeat'
    });
    
    if (onExplorationComplete) {
      setTimeout(onExplorationComplete, 2000);
    }
  };

  const getHealthColor = (current, max) => {
    const ratio = current / max;
    if (ratio > 0.6) return 'success.main';
    if (ratio > 0.3) return 'warning.main';
    return 'error.main';
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Panel title="Battle">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {player.name} vs {enemy.name}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>Player HP: {player.hp}/{player.maxHp}</Typography>
            <LinearProgress 
              variant="determinate" 
              value={(player.hp / player.maxHp) * 100}
              sx={{ 
                height: 10, 
                borderRadius: 1,
                backgroundColor: 'grey.300',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getHealthColor(player.hp, player.maxHp)
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>Enemy HP: {enemy.hp}/{enemy.maxHp}</Typography>
            <LinearProgress 
              variant="determinate" 
              value={(enemy.hp / enemy.maxHp) * 100}
              sx={{ 
                height: 10, 
                borderRadius: 1,
                backgroundColor: 'grey.300',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getHealthColor(enemy.hp, enemy.maxHp)
                }
              }}
            />
          </Box>
        </Box>

        <Button 
          variant="contained" 
          onClick={handleAttack}
          disabled={!isPlayerTurn}
          fullWidth
          sx={{ mb: 2 }}
        >
          Attack
        </Button>

        <Paper 
          elevation={1} 
          ref={logRef}
          sx={{ 
            p: 2, 
            maxHeight: 200, 
            overflow: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.03)'
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>Battle Log</Typography>
          <Box>
            {battleLog.map((entry, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  mb: 0.5,
                  color: entry.type === 'player-attack' ? 'success.main' :
                         entry.type === 'enemy-attack' ? 'error.main' :
                         entry.type === 'victory' ? 'primary.main' :
                         entry.type === 'defeat' ? 'error.dark' :
                         'text.primary',
                  fontWeight: ['victory', 'defeat'].includes(entry.type) ? 'bold' : 'normal'
                }}
              >
                {entry.text}
              </Typography>
            ))}
          </Box>
        </Paper>
      </Panel>
    </Box>
  );
};

export default Battle;