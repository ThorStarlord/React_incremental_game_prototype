import React, { useEffect, ReactNode } from 'react';
import { useGameState } from '../GameStateContext';
import { useGameDispatch } from '../GameDispatchContext';
import { ACTION_TYPES } from '../actions/actionTypes';
import { getSimplifiedTier } from '../../config/relationshipConstants';
import { GameState } from '../initialState';

/**
 * Interface for NPC object in the game state
 */
interface NPC {
  id: string;
  name: string;
  relationship: number;
  [key: string]: any; // For other NPC properties
}

/**
 * Interface for area object in the game state
 */
interface GameArea {
  id: string;
  name?: string;
  dangerLevel: number;
  possibleEnemies: string[];
  [key: string]: any; // For other area properties
}

/**
 * Interface for in-game time tracking
 */
interface GameTime {
  day: number;
  period: 'MORNING' | 'DAY' | 'EVENING' | 'NIGHT';
  hour?: number;
  minute?: number;
}

/**
 * Interface for quest objectives
 */
interface QuestObjective {
  id: string;
  type: string;
  description?: string;
  completed: boolean;
  progress?: number;
  target?: number;
  [key: string]: any;
}

/**
 * Interface for active quests
 */
interface Quest {
  id: string;
  title?: string;
  description?: string;
  objectives?: QuestObjective[];
  rewards?: any[];
  status?: string;
  [key: string]: any;
}

/**
 * Props for GameLoop component
 */
interface GameLoopProps {
  children: ReactNode;
}

/**
 * Extended GameState with additional properties used in GameLoop
 */
interface ExtendedGameState extends GameState {
  npcs?: NPC[];
  gameTime?: GameTime;
  inCombat?: boolean;
  currentArea?: GameArea;
  activeQuests?: Quest[];
}

/**
 * GameLoop Component
 * 
 * Purpose: Manages recurring game mechanics and time-based events.
 * 
 * This component:
 * 1. Sets up interval timers for various game systems
 * 2. Handles relationship changes over time
 * 3. Processes NPC interactions based on relationship tiers
 * 4. Applies passive trait effects at regular intervals
 * 5. Manages resource generation and consumption cycles
 * 6. Processes player stat progression over time
 * 7. Handles random encounter generation
 * 8. Updates quest and mission progress automatically
 * 9. Simulates environmental and world condition changes
 * 
 * Each game system is isolated in its own useEffect for maintainability
 * and to allow for incremental addition of new systems.
 */
const GameLoop: React.FC<GameLoopProps> = ({ children }) => {
  const gameState = useGameState() as ExtendedGameState;
  const dispatch = useGameDispatch();

  // Relationship system loop - handles NPC relationships and interactions
  useEffect(() => {
    const relationshipInterval = setInterval(() => {
      // Apply natural relationship decay over time
      dispatch({ type: ACTION_TYPES.DECAY_RELATIONSHIPS });
      
      // Apply trait effects that modify relationships
      const hasGrowingAffinity = gameState.player.equippedTraits?.includes('GrowingAffinity');
      if (hasGrowingAffinity) {
        dispatch({ 
          type: ACTION_TYPES.UPDATE_NPC_RELATIONSHIP, 
          payload: {
            npcId: 'all',
            changeAmount: 1,
            source: 'GrowingAffinity'
          }
        });
      }
      
      // Process NPC interactions based on relationship tiers
      gameState.npcs?.forEach(npc => {
        const tier = getSimplifiedTier(npc.relationship || 0);
        
        // ENEMY tier effects
        if (tier === "ENEMY" && Math.random() < 0.05) {
          // 5% chance for negative events from enemies
          dispatch({
            type: ACTION_TYPES.ADD_NOTIFICATION,
            payload: {
              message: `${npc.name} is spreading rumors about you!`,
              type: 'negative',
              duration: 5000
            }
          });
          
          // Additional enemy actions could be implemented here
        }
        
        // ALLY tier effects
        if (tier === "ALLY" && Math.random() < 0.1) {
          // 10% chance for gifts from allies
          const essenceAmount = Math.floor(Math.random() * 5) + 1;
            
          dispatch({ 
            type: ACTION_TYPES.GAIN_ESSENCE, 
            payload: { amount: essenceAmount }
          });
          
          dispatch({
            type: ACTION_TYPES.ADD_NOTIFICATION,
            payload: {
              message: `${npc.name} sent you ${essenceAmount} essence as a gift!`,
              type: 'positive',
              duration: 5000
            }
          });
        }
        
        // FRIEND tier effects
        if (tier === "FRIEND" && Math.random() < 0.08) {
          // 8% chance for information from friends
          dispatch({
            type: ACTION_TYPES.ADD_NOTIFICATION,
            payload: {
              message: `${npc.name} shared some useful information with you.`,
              type: 'info',
              duration: 5000
            }
          });
          
          // Additional friend-based events could be implemented here
        }
      });
    }, 60000); // Run every minute
    
    return () => clearInterval(relationshipInterval);
  }, [dispatch, gameState.player.equippedTraits, gameState.npcs]);

  // Resource generation loop
  useEffect(() => {
    const resourceInterval = setInterval(() => {
      // Generate passive resources based on player stats/buildings/etc
      const passiveGold = (gameState.player as any).goldPerMinute || 0;
      if (passiveGold > 0) {
        dispatch({
          type: ACTION_TYPES.GAIN_GOLD,
          payload: { amount: passiveGold }
        });
      }
      
      // Additional resource generation logic can be added here
    }, 60000); // Run every minute
    
    return () => clearInterval(resourceInterval);
  }, [dispatch, gameState.player]);

  // Time progression loop
  useEffect(() => {
    const timeInterval = setInterval(() => {
      // Advance game time
      dispatch({ type: ACTION_TYPES.ADVANCE_TIME });
      
      // Check for time-based events
      const { day, period } = gameState.gameTime || { day: 1, period: 'DAY' };
      if (period === 'NIGHT') {
        // Night-time specific events
        dispatch({
          type: ACTION_TYPES.ADD_NOTIFICATION,
          payload: {
            message: `Day ${day} has ended. It's now night time.`,
            type: 'info',
            duration: 3000
          }
        });
      }
    }, 300000); // Run every 5 minutes
    
    return () => clearInterval(timeInterval);
  }, [dispatch, gameState.gameTime]);

  // Player Stats Progression System
  useEffect(() => {
    const statsInterval = setInterval(() => {
      // Apply passive skill experience gain
      if ((gameState.player as any).skills) {
        const passiveSkillGain = (gameState.player as any).passiveSkillGainRate || 0;
        
        if (passiveSkillGain > 0 && (gameState.player as any).activeSkill) {
          dispatch({
            type: ACTION_TYPES.GAIN_SKILL_EXPERIENCE,
            payload: {
              skillId: (gameState.player as any).activeSkill,
              amount: passiveSkillGain
            }
          });
          
          // Notify on significant milestones
          const currentSkill = (gameState.player as any).skills.find(
            (s: any) => s.id === (gameState.player as any).activeSkill
          );
          
          if (currentSkill && Math.floor(currentSkill.experience) % 100 === 0) {
            dispatch({
              type: ACTION_TYPES.ADD_NOTIFICATION,
              payload: {
                message: `You've gained experience in ${currentSkill.name}!`,
                type: 'positive',
                duration: 3000
              }
            });
          }
        }
      }
      
      // Apply health regeneration if applicable
      const healthRegen = (gameState.player as any).healthRegenRate || 0;
      if (healthRegen > 0 && 
          (gameState.player as any).health < (gameState.player as any).maxHealth) {
        dispatch({
          type: ACTION_TYPES.UPDATE_HEALTH,
          payload: {
            health: Math.min(
              (gameState.player as any).health + healthRegen, 
              (gameState.player as any).maxHealth
            )
          }
        });
      }
    }, 30000); // Run every 30 seconds
    
    return () => clearInterval(statsInterval);
  }, [dispatch, gameState.player]);

  // Combat and Encounter System
  useEffect(() => {
    const encounterInterval = setInterval(() => {
      // Skip if player is already in combat
      if (gameState.inCombat) return;
      
      // Calculate encounter chance based on area danger level
      const currentArea = gameState.currentArea || { dangerLevel: 0, possibleEnemies: [] };
      const dangerLevel = currentArea.dangerLevel || 0;
      const encounterChance = dangerLevel * 0.05; // 5% per danger level
      
      if (Math.random() < encounterChance) {
        // Determine encounter type based on area
        const areaEnemies = currentArea.possibleEnemies || [];
        if (areaEnemies.length > 0) {
          const randomEnemyIndex = Math.floor(Math.random() * areaEnemies.length);
          
          dispatch({
            type: ACTION_TYPES.START_ENCOUNTER,
            payload: {
              enemyType: areaEnemies[randomEnemyIndex],
              area: currentArea.id
            }
          });
          
          dispatch({
            type: ACTION_TYPES.ADD_NOTIFICATION,
            payload: {
              message: `You've encountered a ${areaEnemies[randomEnemyIndex]}!`,
              type: 'warning',
              duration: 5000
            }
          });
        }
      }
    }, 120000); // Check for encounters every 2 minutes
    
    return () => clearInterval(encounterInterval);
  }, [dispatch, gameState.inCombat, gameState.currentArea]);

  // Quest Progression System
  useEffect(() => {
    const questInterval = setInterval(() => {
      // Update time-based quest objectives
      if (gameState.activeQuests?.length > 0) {
        gameState.activeQuests.forEach(quest => {
          if (quest.objectives) {
            // Check for time-based objectives
            const timeObjectives = quest.objectives.filter(obj => 
              obj.type === 'WAIT_TIME' && !obj.completed);
            
            if (timeObjectives.length > 0) {
              timeObjectives.forEach(objective => {
                // Update progress for time-based objectives
                dispatch({
                  type: ACTION_TYPES.UPDATE_QUEST_OBJECTIVE,
                  payload: {
                    questId: quest.id,
                    objectiveId: objective.id,
                    progress: (objective.progress || 0) + 1
                  }
                });
              });
            }
          }
        });
      }
    }, 60000); // Update quest timers every minute
    
    return () => clearInterval(questInterval);
  }, [dispatch, gameState.activeQuests]);

  // Environmental and World Conditions System
  useEffect(() => {
    const environmentInterval = setInterval(() => {
      // Change weather conditions randomly
      if (Math.random() < 0.2) { // 20% chance to change weather
        const weatherTypes = ['Clear', 'Rainy', 'Foggy', 'Stormy', 'Snowy'];
        const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        
        dispatch({
          type: ACTION_TYPES.UPDATE_WEATHER,
          payload: { weather: newWeather }
        });
        
        // Apply weather effects based on type
        if (newWeather === 'Stormy') {
          dispatch({
            type: ACTION_TYPES.ADD_NOTIFICATION,
            payload: {
              message: "A storm is brewing. Some areas may be more dangerous!",
              type: 'warning',
              duration: 5000
            }
          });
        }
      }
      
      // Update world events
      const worldEventChance = 0.05; // 5% chance for a world event
      if (Math.random() < worldEventChance) {
        const possibleEvents = [
          'Merchant Festival', 
          'Monster Invasion', 
          'Resource Abundance',
          'Magical Anomaly'
        ];
        
        const newEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
        
        dispatch({
          type: ACTION_TYPES.TRIGGER_WORLD_EVENT,
          payload: {
            eventType: newEvent,
            duration: Math.floor(Math.random() * 3) + 1 // 1-3 day duration
          }
        });
        
        dispatch({
          type: ACTION_TYPES.ADD_NOTIFICATION,
          payload: {
            message: `World Event: ${newEvent} has begun!`,
            type: 'info',
            duration: 10000
          }
        });
      }
    }, 300000); // Check every 5 minutes
    
    return () => clearInterval(environmentInterval);
  }, [dispatch]);

  return <>{children}</>;
};

export default GameLoop;
