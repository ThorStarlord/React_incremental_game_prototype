import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Fade } from '@mui/material';
import { GameStateContext, GameDispatchContext } from '../../../../context/GameStateContext';
import Battle from './Battle';
import Panel from './Panel';
import combatInitialState from '../../combatInitialState';

/**
 * Combat Manager Component
 * 
 * Manages the state and flow of combat encounters, including:
 * - Enemy generation based on area/dungeon
 * - Combat transitions
 * - Multiple enemy encounters
 * - Combat rewards and progression
 * 
 * @param {Object} props Component props
 * @param {string} props.areaId Current area/dungeon ID
 * @param {number} props.difficulty Difficulty multiplier for enemy stats
 * @param {boolean} props.isRandomEncounter Whether this is a random encounter
 * @param {Function} props.onComplete Callback for when all combat encounters are done
 * @param {Function} props.onRetreat Callback for when player retreats from combat
 */
const Combat = ({ 
  areaId = 'forest', 
  difficulty = 1, 
  isRandomEncounter = false, 
  onComplete, 
  onRetreat 
}) => {
  const { player, gameState } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  // Combat state
  const [loading, setLoading] = useState(true);
  const [encounters, setEncounters] = useState([]);
  const [currentEncounter, setCurrentEncounter] = useState(0);
  const [combatResult, setCombatResult] = useState(null);
  const [totalRewards, setTotalRewards] = useState({
    experience: 0,
    gold: 0,
    items: []
  });

  /**
   * Generate enemies appropriate for the current area and difficulty
   */
  const generateEncounters = useCallback(() => {
    setLoading(true);

    // For a real game, this data would come from a database or config file
    const areaEnemies = {
      forest: [
        { id: 'goblin', name: 'Goblin', baseHealth: 35, baseAttack: 4, baseDefense: 2, baseExperience: 8, baseGold: 5 },
        { id: 'wolf', name: 'Wolf', baseHealth: 30, baseAttack: 5, baseDefense: 1, baseExperience: 7, baseGold: 3 },
        { id: 'bandit', name: 'Bandit', baseHealth: 40, baseAttack: 4, baseDefense: 3, baseExperience: 10, baseGold: 8 }
      ],
      cave: [
        { id: 'bat', name: 'Giant Bat', baseHealth: 25, baseAttack: 3, baseDefense: 1, baseExperience: 5, baseGold: 2 },
        { id: 'slime', name: 'Cave Slime', baseHealth: 45, baseAttack: 2, baseDefense: 4, baseExperience: 8, baseGold: 4 },
        { id: 'troll', name: 'Cave Troll', baseHealth: 60, baseAttack: 7, baseDefense: 5, baseExperience: 15, baseGold: 12 }
      ],
      dungeon: [
        { id: 'skeleton', name: 'Skeleton', baseHealth: 40, baseAttack: 5, baseDefense: 2, baseExperience: 9, baseGold: 6 },
        { id: 'zombie', name: 'Zombie', baseHealth: 50, baseAttack: 4, baseDefense: 3, baseExperience: 11, baseGold: 7 },
        { id: 'necromancer', name: 'Necromancer', baseHealth: 35, baseAttack: 8, baseDefense: 1, baseExperience: 14, baseGold: 15 }
      ]
    };

    const enemiesForArea = areaEnemies[areaId] || areaEnemies.forest;
    
    // Calculate number of encounters based on random encounter or area exploration
    const numEncounters = isRandomEncounter ? 1 : Math.floor(Math.random() * 2) + 1;
    
    const newEncounters = [];
    for (let i = 0; i < numEncounters; i++) {
      // Pick a random enemy type for this area
      const randomIndex = Math.floor(Math.random() * enemiesForArea.length);
      const enemyTemplate = enemiesForArea[randomIndex];
      
      // Calculate level based on player's level and area difficulty
      const enemyLevel = Math.max(1, player.level - 1 + Math.floor(Math.random() * 3));
      
      // Scale enemy stats based on level and difficulty
      const levelMultiplier = 1 + (enemyLevel - 1) * 0.2;
      const difficultyMultiplier = difficulty;
      
      // Create enemy instance with scaled stats
      const enemy = {
        ...combatInitialState.enemy,
        id: enemyTemplate.id,
        name: enemyTemplate.name,
        level: enemyLevel,
        currentHealth: Math.floor(enemyTemplate.baseHealth * levelMultiplier * difficultyMultiplier),
        maxHealth: Math.floor(enemyTemplate.baseHealth * levelMultiplier * difficultyMultiplier),
        attack: Math.floor(enemyTemplate.baseAttack * levelMultiplier * difficultyMultiplier),
        defense: Math.floor(enemyTemplate.baseDefense * levelMultiplier * difficultyMultiplier),
        speed: Math.floor((Math.random() * 5) + 5),
        experience: Math.floor(enemyTemplate.baseExperience * levelMultiplier * difficultyMultiplier),
        gold: Math.floor(enemyTemplate.baseGold * levelMultiplier * difficultyMultiplier),
        imageUrl: `/assets/enemies/${enemyTemplate.id}.png`,
        // Add random loot based on enemy type
        loot: generateLoot(enemyTemplate.id)
      };
      
      newEncounters.push(enemy);
    }
    
    setEncounters(newEncounters);
    setCurrentEncounter(0);
    setLoading(false);
    
    return newEncounters;
  }, [areaId, difficulty, player.level, isRandomEncounter]);

  /**
   * Generate potential loot drops for an enemy
   * @param {string} enemyId - The enemy's ID to generate loot for
   * @returns {Array} Array of potential loot items
   */
  const generateLoot = (enemyId) => {
    // This would be expanded in a full game with proper loot tables
    const commonLoot = [
      { id: 'herb', name: 'Healing Herb', dropChance: 0.5, quantity: 1 },
      { id: 'cloth', name: 'Cloth Scrap', dropChance: 0.7, quantity: 1 }
    ];
    
    const specificLoot = {
      goblin: [
        { id: 'dagger', name: 'Rusty Dagger', dropChance: 0.1, quantity: 1 }
      ],
      wolf: [
        { id: 'pelt', name: 'Wolf Pelt', dropChance: 0.4, quantity: 1 }
      ],
      bandit: [
        { id: 'lockpick', name: 'Lockpick', dropChance: 0.3, quantity: 1 }
      ],
      // Add more enemy-specific loot here
    };
    
    return [...commonLoot, ...(specificLoot[enemyId] || [])];
  };

  // Initialize combat when component mounts
  useEffect(() => {
    generateEncounters();
  }, [generateEncounters]);

  /**
   * Handle when a battle is completed
   * @param {Object} result - Result of the battle
   * @param {boolean} result.victory - Whether the player won
   * @param {Object} result.rewards - Rewards earned from the battle
   */
  const handleBattleComplete = (result) => {
    if (result.victory) {
      // Add rewards from this encounter to total rewards
      setTotalRewards(prev => ({
        experience: prev.experience + result.rewards.experience,
        gold: prev.gold + result.rewards.gold,
        items: [...prev.items, ...result.rewards.items]
      }));
      
      // Check if there are more encounters
      if (currentEncounter < encounters.length - 1) {
        // Proceed to next encounter
        setTimeout(() => {
          setCurrentEncounter(prev => prev + 1);
        }, 1000);
      } else {
        // All encounters complete
        setCombatResult({ victory: true });
      }
    } else {
      // Player was defeated
      setCombatResult({ victory: false });
    }
  };

  /**
   * Handle retreat from combat
   */
  const handleRetreat = () => {
    // Calculate chance of successful retreat
    const retreatChance = 0.6; // Base chance
    if (Math.random() < retreatChance) {
      setCombatResult({ victory: false, retreat: true });
    } else {
      // Failed retreat - enemy gets a free attack
      // This would be handled in the Battle component
      dispatch({
        type: 'LOG_MESSAGE',
        payload: "You couldn't escape!"
      });
    }
  };

  /**
   * Complete all combat and return to previous screen
   */
  const handleFinish = () => {
    if (onComplete) {
      onComplete({
        victory: combatResult?.victory || false,
        rewards: totalRewards
      });
    }
  };

  /**
   * Retreat from combat and return to previous screen
   */
  const handleExitCombat = () => {
    if (onRetreat) {
      onRetreat();
    } else if (onComplete) {
      onComplete({
        victory: false,
        retreat: true
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="body1">Preparing for combat...</Typography>
      </Box>
    );
  }

  // Show combat results
  if (combatResult !== null) {
    return (
      <Fade in={true}>
        <Box sx={{ p: 2, height: '100%' }}>
          <Panel title="Combat Results">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 2 }}>
              <Typography variant="h5" color={combatResult.victory ? "primary" : "error"}>
                {combatResult.victory ? "Victory!" : combatResult.retreat ? "Retreated" : "Defeat!"}
              </Typography>
              
              {combatResult.victory && (
                <Box sx={{ width: '100%', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Rewards Earned:
                  </Typography>
                  <Typography variant="body1">
                    Experience: {totalRewards.experience}
                  </Typography>
                  <Typography variant="body1">
                    Gold: {totalRewards.gold}
                  </Typography>
                  {totalRewards.items.length > 0 && (
                    <>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        Items:
                      </Typography>
                      <ul style={{ marginTop: 4 }}>
                        {totalRewards.items.map((item, index) => (
                          <li key={index}>
                            {item.name} x{item.quantity}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </Box>
              )}
              
              <Button 
                variant="contained" 
                color={combatResult.victory ? "success" : "primary"}
                onClick={handleFinish}
                sx={{ mt: 2 }}
              >
                {combatResult.victory ? "Continue" : "Return to Town"}
              </Button>
            </Box>
          </Panel>
        </Box>
      </Fade>
    );
  }

  // Show battle interface
  return (
    <Box sx={{ height: '100%' }}>
      <Battle 
        enemy={encounters[currentEncounter]}
        dungeonId={areaId}
        encounter={currentEncounter + 1}
        totalEncounters={encounters.length}
        onExplorationComplete={handleBattleComplete}
        onRetreat={handleRetreat}
      />
      
      {/* Optional retreat button */}
      <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
        <Button 
          variant="outlined" 
          color="error" 
          size="small"
          onClick={handleExitCombat}
        >
          Retreat
        </Button>
      </Box>
    </Box>
  );
};

export default Combat;