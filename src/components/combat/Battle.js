import React, { useContext, useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Button, LinearProgress, useTheme } from '@mui/material';
import { GameStateContext, GameDispatchContext } from '../../context/GameStateContext';
import useTraitEffects from '../../hooks/useTraitEffects';
import Panel from './Panel';
import useThemeUtils from '../../hooks/useThemeUtils';
import TraitEffectDialog from './TraitEffectDialog';
import TraitEffectAnimation from './TraitEffectAnimation';

const Battle = ({ dungeonId, onExplorationComplete }) => {
  const { player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const { modifiers, calculatedStats } = useTraitEffects();
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
  const [traitEffect, setTraitEffect] = useState(null);
  const [animationEffect, setAnimationEffect] = useState(null);
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

  const theme = useTheme();
  const { getProgressColor } = useThemeUtils();

  // Track mouse position for effect animations
  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top
    });
  };

  // Auto-scroll battle log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleLog]);

  const addLogEntry = (entry) => {
    setBattleLog(prev => [...prev, entry]);
  };

  const calculateDamage = (attacker, defender, isPlayer = false) => {
    let attack = isPlayer ? calculatedStats.attack : attacker.attack;
    let defense = isPlayer ? defender.defense : calculatedStats.defense;
    
    const baseDamage = Math.max(1, attack - defense);
    const variance = Math.floor(Math.random() * 3) - 1; // -1 to +1
    return Math.max(1, baseDamage + variance);
  };

  const showTraitEffect = (effect) => {
    setTraitEffect(effect);
    setAnimationEffect(effect);
    setTimeout(() => setAnimationEffect(null), 1500);
  };

  const handleAttack = () => {
    if (!isPlayerTurn) return;

    const damage = calculateDamage(player, enemy, true);
    const newEnemyHp = Math.max(0, enemy.hp - damage);
    
    addLogEntry({
      text: `${player.name} attacks ${enemy.name} for ${damage} damage!`,
      type: 'player-attack'
    });

    // Check for trait activations
    if (modifiers.attackBonus > 0) {
      const bonusDamage = Math.floor(damage * modifiers.attackBonus);
      showTraitEffect({
        traitName: 'Battle Hardened',
        description: 'Your combat experience grants bonus damage!',
        value: bonusDamage
      });
    }

    // Check for essence siphon proc
    if (modifiers.essenceSiphonChance > 0 && Math.random() < modifiers.essenceSiphonChance) {
      const essenceGained = Math.floor(Math.random() * 3) + 1;
      dispatch({ type: 'GAIN_ESSENCE', payload: essenceGained });
      addLogEntry({
        text: `Essence Siphon activated! Gained ${essenceGained} essence!`,
        type: 'essence-gain'
      });
      
      setTimeout(() => {
        showTraitEffect({
          traitName: 'Essence Siphon',
          description: 'Your attack siphoned magical essence!',
          value: `${essenceGained} Essence`
        });
      }, 500);
    }
    
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
    // Apply XP multiplier from traits
    const baseReward = Math.floor(Math.random() * 10) + 5;
    const xpReward = Math.floor(baseReward * modifiers.xpMultiplier);
    const goldReward = baseReward;

    addLogEntry({
      text: `Victory! Gained ${goldReward} gold and ${xpReward} experience!`,
      type: 'victory'
    });
    
    if (modifiers.xpMultiplier > 1) {
      const bonusXP = Math.floor(baseReward * (modifiers.xpMultiplier - 1));
      setTimeout(() => {
        showTraitEffect({
          traitName: 'Quick Learner',
          description: 'Your trait granted bonus experience!',
          value: bonusXP
        });
      }, 500);
    }

    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        ...player,
        gold: player.gold + goldReward,
        experience: player.experience + xpReward
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

  const getMessageColor = (type) => {
    switch (type) {
      case 'player-attack':
        return theme.palette.success.main;
      case 'enemy-attack':
        return theme.palette.error.main;
      case 'victory':
        return theme.palette.primary.main;
      case 'defeat':
        return theme.palette.error.dark;
      case 'essence-gain':
        return theme.palette.secondary.main;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Box 
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}
      onMouseMove={handleMouseMove}
    >
      <TraitEffectDialog 
        open={Boolean(traitEffect)}
        onClose={() => setTraitEffect(null)}
        effect={traitEffect}
      />
      
      {animationEffect && (
        <TraitEffectAnimation 
          effect={animationEffect}
          position={mousePos}
        />
      )}
      
      <Panel title="Battle">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            {player.name} vs {enemy.name}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Player HP: {player.hp}/{player.maxHp}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(player.hp / player.maxHp) * 100}
              sx={{ 
                height: 10, 
                borderRadius: 1,
                backgroundColor: theme.palette.grey[300],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getProgressColor(player.hp, player.maxHp)
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Enemy HP: {enemy.hp}/{enemy.maxHp}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(enemy.hp / enemy.maxHp) * 100}
              sx={{ 
                height: 10, 
                borderRadius: 1,
                backgroundColor: theme.palette.grey[300],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getProgressColor(enemy.hp, enemy.maxHp)
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
          sx={{ 
            mb: 2,
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
            '&:disabled': {
              bgcolor: theme.palette.action.disabledBackground,
            }
          }}
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
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }} color="primary">
            Battle Log
          </Typography>
          <Box>
            {battleLog.map((entry, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  mb: 0.5,
                  color: getMessageColor(entry.type),
                  fontWeight: ['victory', 'defeat', 'essence-gain'].includes(entry.type) ? 'bold' : 'normal'
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