import React, { useContext, useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Button, LinearProgress, useTheme, Grid, Divider } from '@mui/material';
import { GameStateContext, GameDispatchContext } from '../../../../context/GameStateContext';
import useTraitEffects from '../../hooks/useTraitEffects';
import Panel from './Panel';
import useThemeUtils from '../../hooks/useThemeUtils';
import TraitEffectDialog from './TraitEffectDialog';
import TraitEffectAnimation from './TraitEffectAnimation';
import combatInitialState from '../../combatInitialState';

/**
 * Battle component that handles combat encounters
 * @param {Object} props Component props
 * @param {string} props.dungeonId ID of the current dungeon
 * @param {Function} props.onExplorationComplete Callback for when battle ends
 */
const Battle = ({ dungeonId, onExplorationComplete }) => {
  const { player, gameState } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const { modifiers, calculatedStats } = useTraitEffects();
  const theme = useTheme();
  const { getProgressColor } = useThemeUtils();
  
  // Initialize combat state
  const [combatState, setCombatState] = useState({
    ...combatInitialState,
    active: true,
    playerTurn: true,
    player: {
      ...combatInitialState.player,
      currentHealth: player.hp,
      maxHealth: player.maxHp,
      currentMana: player.mana || 50,
      maxMana: player.maxMana || 50
    },
    enemy: {
      ...combatInitialState.enemy,
      name: 'Goblin',
      level: 1,
      currentHealth: 50,
      maxHealth: 50,
      attack: 5,
      defense: 3,
      imageUrl: '/assets/enemies/goblin.png',
      experience: 10,
      gold: 5
    }
  });

  // UI state
  const [traitEffect, setTraitEffect] = useState(null);
  const [animationEffect, setAnimationEffect] = useState(null);
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });
  const logRef = useRef(null);

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
  }, [combatState.log]);

  /**
   * Adds a new entry to the combat log
   * @param {Object} entry Log entry with text and type
   */
  const addLogEntry = (entry) => {
    setCombatState(prev => ({
      ...prev,
      log: [...prev.log, {
        timestamp: new Date().toISOString(),
        message: entry.text,
        type: entry.type,
        importance: entry.type === 'victory' || entry.type === 'defeat' ? 'high' : 'normal'
      }]
    }));
  };

  /**
   * Calculates damage based on attacker and defender stats
   */
  const calculateDamage = (isPlayerAttacking = true) => {
    const attackerStats = isPlayerAttacking ? 
      { attack: calculatedStats.attack } : 
      { attack: combatState.enemy.attack };
      
    const defenderStats = isPlayerAttacking ? 
      { defense: combatState.enemy.defense } : 
      { defense: calculatedStats.defense };
    
    const baseDamage = Math.max(1, attackerStats.attack - defenderStats.defense);
    const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
    return Math.max(1, baseDamage + variance);
  };

  /**
   * Displays trait effect animation and dialog
   */
  const showTraitEffect = (effect) => {
    setTraitEffect(effect);
    setAnimationEffect(effect);
    setTimeout(() => setAnimationEffect(null), 1500);
  };

  /**
   * Handles player attack action
   */
  const handleAttack = () => {
    if (!combatState.playerTurn || !combatState.active) return;

    const damage = calculateDamage(true);
    const newEnemyHealth = Math.max(0, combatState.enemy.currentHealth - damage);
    
    addLogEntry({
      text: `${player.name} attacks ${combatState.enemy.name} for ${damage} damage!`,
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
    
    setCombatState(prev => ({
      ...prev,
      enemy: {
        ...prev.enemy,
        currentHealth: newEnemyHealth
      },
      playerTurn: newEnemyHealth <= 0 ? true : false,
      round: prev.round + (newEnemyHealth <= 0 ? 0 : 0.5) // Increment half a round (full round after enemy turn)
    }));

    if (newEnemyHealth <= 0) {
      handleVictory();
    } else {
      // Enemy turn after delay
      setTimeout(enemyTurn, 1000);
    }
  };

  /**
   * Execute enemy's turn in combat
   */
  const enemyTurn = () => {
    const damage = calculateDamage(false);
    const newPlayerHealth = Math.max(0, combatState.player.currentHealth - damage);
    
    addLogEntry({
      text: `${combatState.enemy.name} attacks ${player.name} for ${damage} damage!`,
      type: 'enemy-attack'
    });

    setCombatState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        currentHealth: newPlayerHealth
      },
      playerTurn: true,
      round: prev.round + 0.5 // Complete the round
    }));

    // Also update the main player state
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        ...player,
        hp: newPlayerHealth
      }
    });

    if (newPlayerHealth <= 0) {
      handleDefeat();
    }
  };

  /**
   * Handle player victory
   */
  const handleVictory = () => {
    const { experience, gold } = combatState.enemy;
    
    // Apply XP multiplier from traits
    const xpReward = Math.floor(experience * modifiers.xpMultiplier);
    const goldReward = gold;

    setCombatState(prev => ({
      ...prev,
      active: false,
      rewards: {
        experience: xpReward,
        gold: goldReward,
        items: [] // Could be populated based on enemy loot tables
      }
    }));

    addLogEntry({
      text: `Victory! Gained ${goldReward} gold and ${xpReward} experience!`,
      type: 'victory'
    });
    
    if (modifiers.xpMultiplier > 1) {
      const bonusXP = Math.floor(experience * (modifiers.xpMultiplier - 1));
      setTimeout(() => {
        showTraitEffect({
          traitName: 'Quick Learner',
          description: 'Your trait granted bonus experience!',
          value: `+${bonusXP} XP`
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

  /**
   * Handle player defeat
   */
  const handleDefeat = () => {
    setCombatState(prev => ({
      ...prev,
      active: false
    }));

    addLogEntry({
      text: 'Defeat! You have been knocked out...',
      type: 'defeat'
    });
    
    if (onExplorationComplete) {
      setTimeout(onExplorationComplete, 2000);
    }
  };

  /**
   * Get appropriate color for log message
   */
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

  /**
   * Handle skill usage in combat
   */
  const handleUseSkill = (skill) => {
    if (!combatState.playerTurn || !combatState.active) return;
    
    // Implementation for skills would go here
    addLogEntry({
      text: `${player.name} uses ${skill.name}!`,
      type: 'player-skill'
    });

    // Handle skill effects, mana cost, etc.
    // For now just do a basic attack
    handleAttack();
  };

  /**
   * Handle item usage in combat
   */
  const handleUseItem = (item) => {
    if (!combatState.active) return;
    
    addLogEntry({
      text: `${player.name} uses ${item.name}!`,
      type: 'player-item'
    });

    // Handle item effects
    // Then continue combat if it was enemy turn, or wait for player input if player turn
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
      
      <Panel title={`Battle - Round ${Math.ceil(combatState.round)}`}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                {player.name} vs {combatState.enemy.name}
              </Typography>
              
              <Grid container spacing={2}>
                {/* Player stats */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Player Stats
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom display="flex" justifyContent="space-between">
                      <span>HP:</span>
                      <span>{combatState.player.currentHealth}/{combatState.player.maxHealth}</span>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(combatState.player.currentHealth / combatState.player.maxHealth) * 100}
                      sx={{ 
                        height: 10, 
                        borderRadius: 1,
                        backgroundColor: theme.palette.grey[300],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getProgressColor(combatState.player.currentHealth, combatState.player.maxHealth)
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom display="flex" justifyContent="space-between">
                      <span>Mana:</span>
                      <span>{combatState.player.currentMana}/{combatState.player.maxMana}</span>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(combatState.player.currentMana / combatState.player.maxMana) * 100}
                      sx={{ 
                        height: 8, 
                        borderRadius: 1,
                        backgroundColor: theme.palette.grey[300],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.info.main
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Attack: {calculatedStats.attack}
                  </Typography>
                  <Typography variant="body2">
                    Defense: {calculatedStats.defense}
                  </Typography>
                </Grid>
                
                {/* Enemy stats */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {combatState.enemy.name} (Level {combatState.enemy.level})
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom display="flex" justifyContent="space-between">
                      <span>HP:</span>
                      <span>{combatState.enemy.currentHealth}/{combatState.enemy.maxHealth}</span>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(combatState.enemy.currentHealth / combatState.enemy.maxHealth) * 100}
                      sx={{ 
                        height: 10, 
                        borderRadius: 1,
                        backgroundColor: theme.palette.grey[300],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getProgressColor(combatState.enemy.currentHealth, combatState.enemy.maxHealth)
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Attack: {combatState.enemy.attack}
                  </Typography>
                  <Typography variant="body2">
                    Defense: {combatState.enemy.defense}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Combat actions */}
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={4}>
                <Button 
                  variant="contained" 
                  onClick={handleAttack}
                  disabled={!combatState.playerTurn || !combatState.active}
                  fullWidth
                  sx={{ 
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
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button 
                  variant="outlined" 
                  disabled={!combatState.playerTurn || !combatState.active}
                  fullWidth
                  onClick={() => handleUseSkill({ name: 'Fireball' })}
                >
                  Skill
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  disabled={!combatState.active}
                  onClick={() => handleUseItem({ name: 'Health Potion' })}
                >
                  Item
                </Button>
              </Grid>
            </Grid>
          </Grid>
          
          {/* Battle log */}
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={1} 
              ref={logRef}
              sx={{ 
                p: 2, 
                height: 300, 
                overflow: 'auto',
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }} color="primary">
                Battle Log
              </Typography>
              <Box>
                {combatState.log.map((entry, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{
                      mb: 0.5,
                      color: getMessageColor(entry.type),
                      fontWeight: entry.importance === 'high' ? 'bold' : 'normal'
                    }}
                  >
                    {entry.message}
                  </Typography>
                ))}
                {combatState.log.length === 0 && (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    Combat begins...
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {!combatState.active && (
            <Button 
              variant="contained" 
              color={combatState.player.currentHealth > 0 ? "success" : "error"}
              onClick={onExplorationComplete}
            >
              {combatState.player.currentHealth > 0 ? "Continue Adventure" : "Return to Town"}
            </Button>
          )}
        </Box>
      </Panel>
    </Box>
  );
};

export default Battle;