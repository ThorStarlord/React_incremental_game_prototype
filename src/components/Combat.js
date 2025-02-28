import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import useTraitEffects from '../hooks/useTraitEffects';

const Combat = ({ enemyId }) => {
  const { player, enemies } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  
  // Get the enemy from the enemies list
  const enemy = enemies.find(e => e.id === enemyId);
  
  // Use the trait effects hook to get modifiers
  const { 
    modifiers, 
    getModifiedStat, 
    checkTraitEffectTrigger, 
    getEffectsForScenario 
  } = useTraitEffects();
  
  // Get combat-specific effects
  const combatEffects = getEffectsForScenario('combat');
  
  // Calculate modified player attack
  const playerAttack = getModifiedStat('attack', player.attack);
  
  // Player attack logic
  const handlePlayerAttack = () => {
    // Check if the player dodges (from trait effects)
    if (checkTraitEffectTrigger('dodge')) {
      // Show dodge message
      console.log('You dodged the attack!');
      return;
    }
    
    // Calculate damage with modifiers
    let damage = playerAttack - enemy.defense;
    
    // Check for critical hit
    const isCritical = checkTraitEffectTrigger('criticalHit');
    if (isCritical) {
      damage *= (1 + combatEffects.criticalDamage);
      console.log('Critical hit!');
    }
    
    // Ensure minimum damage
    damage = Math.max(1, Math.round(damage));
    
    // Deal damage to enemy
    dispatch({
      type: 'DAMAGE_ENEMY',
      payload: {
        enemyId,
        amount: damage
      }
    });
    
    // Check if essence siphon triggers
    if (checkTraitEffectTrigger('essenceSiphon')) {
      const essenceGained = Math.ceil(damage * 0.2);
      dispatch({
        type: 'GAIN_ESSENCE',
        payload: essenceGained
      });
      
      console.log(`Siphoned ${essenceGained} essence!`);
    }
  };
  
  return (
    <Box>
      <Typography variant="h5">Combat</Typography>
      
      {/* Player stats with modifiers */}
      <Box>
        <Typography>
          Attack: {player.attack} 
          {combatEffects.attackBonus > 0 && (
            <span style={{ color: 'green' }}> (+{Math.round(player.attack * combatEffects.attackBonus)})</span>
          )}
        </Typography>
        
        <Typography>
          Defense: {player.defense}
          {combatEffects.defenseBonus > 0 && (
            <span style={{ color: 'green' }}> (+{Math.round(player.defense * combatEffects.defenseBonus)})</span>
          )}
        </Typography>
        
        {combatEffects.dodgeChance > 0 && (
          <Typography>
            Dodge Chance: {Math.round(combatEffects.dodgeChance * 100)}%
          </Typography>
        )}
        
        {combatEffects.criticalChance > 0 && (
          <Typography>
            Critical Chance: {Math.round(combatEffects.criticalChance * 100)}%
          </Typography>
        )}
      </Box>
      
      {/* Combat actions */}
      <Button onClick={handlePlayerAttack}>Attack</Button>
    </Box>
  );
};

export default Combat;