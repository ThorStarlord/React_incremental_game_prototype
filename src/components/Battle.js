import React, { useContext, useState, useEffect, useRef } from 'react';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import { dungeons } from '../modules/data/dungeons';
import { dungeonEnemies } from '../modules/data/dungeonEnemies';
import { UPDATE_INTERVALS } from '../config/gameConstants';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { 
    Button, 
    Grid, 
    Typography, 
    List, 
    ListItem, 
    Radio, 
    FormControlLabel, 
    Box,
    Chip,
    Stack,
    Tooltip,
    Paper
} from '@mui/material';
import './Battle.css';  // Updated import path

const DUNGEON_BATTLES = 3;

const EnemyDisplay = ({ enemy, selected, onSelect, traits }) => {
    return (
        <ListItem>
            <FormControlLabel
                control={
                    <Radio
                        checked={selected}
                        onChange={() => onSelect(enemy.id)}
                        value={enemy.id}
                        name="selectedMonster"
                    />
                }
                label={
                    <Box>
                        <Typography>{enemy.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            HP: {enemy.hp}, Attack: {enemy.attack}, Defense: {enemy.defense}
                        </Typography>
                        <Stack direction="row" spacing={1} mt={1}>
                            {enemy.traits.map(traitId => {
                                const trait = traits.monsterTraits[traitId];
                                return (
                                    <Tooltip key={traitId} title={trait.description}>
                                        <Chip
                                            size="small"
                                            label={trait.name}
                                            variant="outlined"
                                            color="secondary"
                                            icon={<HelpOutlineIcon />}
                                        />
                                    </Tooltip>
                                );
                            })}
                        </Stack>
                    </Box>
                }
            />
        </ListItem>
    );
};

const Battle = ({ dungeonId, onExplorationComplete }) => {
    const { enemies: regularEnemies, player, traits } = useContext(GameStateContext);
    const dispatch = useContext(GameDispatchContext);
    const [selectedMonsterId, setSelectedMonsterId] = useState(null);
    const [battleStarted, setBattleStarted] = useState(false);
    const [playerHP, setPlayerHP] = useState(null);
    const [enemyHP, setEnemyHP] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const [currentMonster, setCurrentMonster] = useState(null);
    const [dungeonProgress, setDungeonProgress] = useState(0);
    const [dungeonRewards, setDungeonRewards] = useState([]);
    const [dungeonCompleted, setDungeonCompleted] = useState(false);
    const lastHpUpdate = useRef({ player: null, enemy: null });

    const dungeon = dungeonId ? dungeons.find(d => d.id === dungeonId) : null;
    const isDungeonBattle = !!dungeon;
    
    const availableEnemies = isDungeonBattle ? 
        dungeonEnemies[dungeonId] : 
        regularEnemies;

    const handleSelectMonster = (id) => {
        setSelectedMonsterId(id);
    };

    const handleStartBattle = () => {
        if (!selectedMonsterId) {
            alert("Please select a monster first.");
            return;
        }
        const monster = availableEnemies.find((enemy) => enemy.id === selectedMonsterId);
        setCurrentMonster(monster);
        setPlayerHP(player.hp);
        setEnemyHP(monster.hp);
        setBattleLog([
            isDungeonBattle ? 
                `${dungeon.name} - Battle ${dungeonProgress + 1} of ${DUNGEON_BATTLES}!` : 
                'Battle Started!',
            `${player.name} (HP: ${player.hp}, Attack: ${player.attack}, Defense: ${player.defense}) vs ${monster.name} (HP: ${monster.hp}, Attack: ${monster.attack}, Defense: ${monster.defense})`,
        ]);
        setBattleStarted(true);
    };

    const validateBattleState = (newHp, type, logEntry) => {
        const lastUpdate = lastHpUpdate.current[type];
        if (lastUpdate !== null && Math.abs(lastUpdate - newHp) > 100) {
            console.warn(`Possible race condition detected in battle log:
                Type: ${type}
                Previous HP: ${lastUpdate}
                New HP: ${newHp}
                Log Entry: ${logEntry}
            `);
        }
        lastHpUpdate.current[type] = newHp;
    };

    const handleAttack = () => {
        if (!battleStarted || !currentMonster) return;

        /**
         * @TECHNICAL_DEBT: Battle Log Race Conditions
         * 
         * Current Implementation:
         * - HP updates and battle log entries are handled as separate setState calls
         * - This can lead to potential race conditions in React's batch updates
         * - Log entries might not perfectly sync with actual game state
         * 
         * Current Status:
         * - Acceptable for prototype phase since:
         *   1. Visual delay is minimal due to React's batching
         *   2. Core gameplay isn't affected
         *   3. Battle outcome remains deterministic
         * 
         * Future Solutions (when log accuracy becomes crucial):
         * 1. Atomic State Updates:
         *    - Use useReducer to handle HP and log updates in a single action
         *    - Example structure:
         *      type BattleAction = {
         *        type: 'ATTACK'
         *        payload: {
         *          damage: number,
         *          newHp: number,
         *          logEntry: string
         *        }
         *      }
         * 
         * 2. Robust Battle Log System:
         *    - Implement timestamped entries
         *    - Store battle state with each log entry
         *    - Enable log replay/verification
         * 
         * 3. State Synchronization:
         *    - Create a BattleState type combining HP and logs
         *    - Update both in a single transaction
         *    - Add verification layer between state updates
         */

        const playerDamage = Math.max(0, player.attack - currentMonster.defense);
        const newEnemyHP = Math.max(0, enemyHP - playerDamage);
        let logEntry = `${player.name} attacks ${currentMonster.name} for ${playerDamage} damage. ${currentMonster.name} HP: ${newEnemyHP}`;
        
        validateBattleState(newEnemyHP, 'enemy', logEntry);
        setBattleLog((prevLog) => [...prevLog, logEntry]);
        setEnemyHP(newEnemyHP);

        if (newEnemyHP === 0) {
            const earnedEssence = currentMonster.essenceDrop;
            const earnedGold = currentMonster.goldDrop;
            const updatedPlayer = { 
                ...player, 
                statPoints: player.statPoints + 1,
                essence: player.essence + earnedEssence,
                gold: player.gold + earnedGold
            };
            
            setBattleLog((prevLog) => [
                ...prevLog,
                `${currentMonster.name} has been defeated!`,
                `You gained ${earnedEssence} Essence and ${earnedGold} Gold!`,
                `You gained 1 stat point.`
            ]);
            
            dispatch({ type: 'UPDATE_PLAYER', payload: updatedPlayer });
            setBattleStarted(false);

            if (isDungeonBattle) {
                const newProgress = dungeonProgress + 1;
                setDungeonProgress(newProgress);

                if (newProgress >= DUNGEON_BATTLES) {
                    /**
                     * @GAME_DESIGN: Dungeon Reward System
                     * Currently using slice(0, 2) to limit rewards to 2 items per dungeon completion.
                     * This is an intentional design choice for game balance to:
                     * 1. Prevent players from getting too powerful too quickly
                     * 2. Encourage multiple dungeon runs for different rewards
                     * 3. Maintain game progression curve
                     * 
                     * Future Enhancements Planned:
                     * - Scale number of rewards based on dungeon difficulty
                     * - Add rare chance for bonus rewards
                     * - Implement reward selection based on player progress
                     */
                    const rewards = dungeon.rewards.slice(0, 2);
                    setDungeonRewards(rewards);
                    setBattleLog((prevLog) => [
                        ...prevLog,
                        `Dungeon Completed! You found:`,
                        ...rewards.map(reward => `- ${reward}`)
                    ]);
                    
                    setDungeonCompleted(true);
                }
            }
            return;
        }

        const enemyDamage = Math.max(0, currentMonster.attack - player.defense);
        const newPlayerHP = Math.max(0, playerHP - enemyDamage);
        logEntry = `${currentMonster.name} attacks ${player.name} for ${enemyDamage} damage. ${player.name} HP: ${newPlayerHP}`;
        
        validateBattleState(newPlayerHP, 'player', logEntry);
        setBattleLog((prevLog) => [...prevLog, logEntry]);
        setPlayerHP(newPlayerHP);

        if (newPlayerHP === 0) {
            setBattleLog((prevLog) => [
                ...prevLog,
                `${player.name} has been defeated!`,
                isDungeonBattle ? 'You retreat from the dungeon...' : ''
            ]);
            setBattleStarted(false);
            if (isDungeonBattle && onExplorationComplete) {
                setTimeout(onExplorationComplete, 3000);
            }
        }
    };

    useEffect(() => {
        if (battleStarted) {
            lastHpUpdate.current = { player: null, enemy: null };
        }
    }, [battleStarted]);

    useEffect(() => {
        if (battleStarted) {
            const intervalId = setInterval(() => {
                handleAttack();
            }, UPDATE_INTERVALS.BATTLE_ATTACK);
            return () => clearInterval(intervalId);
        }
    }, [battleStarted, enemyHP, playerHP]);

    useEffect(() => {
        if (dungeonCompleted && onExplorationComplete) {
            onExplorationComplete();
        }
    }, [dungeonCompleted, onExplorationComplete]);

    return (
        <Box sx={{
            height: '100%',
            overflow: 'auto',
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1
        }}>
            <Grid container spacing={2}>
                {isDungeonBattle && (
                    <Grid item xs={12}>
                        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6">
                                {dungeon.name} - Progress: {dungeonProgress}/{DUNGEON_BATTLES}
                            </Typography>
                            <Box sx={{
                                height: 10,
                                bgcolor: 'grey.200',
                                borderRadius: 5,
                                mt: 1
                            }}>
                                <Box sx={{
                                    height: '100%',
                                    width: `${(dungeonProgress / DUNGEON_BATTLES) * 100}%`,
                                    bgcolor: 'primary.main',
                                    borderRadius: 5,
                                    transition: 'width 0.3s ease'
                                }} />
                            </Box>
                        </Paper>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                        {!battleStarted ? (
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    {isDungeonBattle ? `Choose your next opponent in ${dungeon.name}` : 'Select an Enemy'}
                                </Typography>
                                {availableEnemies && availableEnemies.length > 0 ? (
                                    <List sx={{ mb: 2 }}>
                                        {availableEnemies.map((enemy) => (
                                            <EnemyDisplay
                                                key={enemy.id}
                                                enemy={enemy}
                                                selected={selectedMonsterId === enemy.id}
                                                onSelect={handleSelectMonster}
                                                traits={traits}
                                            />
                                        ))}
                                    </List>
                                ) : (
                                    <Typography>No enemies available!</Typography>
                                )}
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handleStartBattle}
                                    disabled={!selectedMonsterId}
                                    fullWidth
                                >
                                    {isDungeonBattle ? 'Continue Exploration' : 'Start Battle'}
                                </Button>
                            </Box>
                        ) : (
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>Battle in Progress</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography>
                                        {player.name}: {playerHP} HP | {currentMonster.name}: {enemyHP} HP
                                    </Typography>
                                    {currentMonster.traits.length > 0 && (
                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                            {currentMonster.traits.map(traitId => {
                                                const trait = traits.monsterTraits[traitId];
                                                return (
                                                    <Tooltip key={traitId} title={trait.description}>
                                                        <Chip
                                                            size="small"
                                                            label={trait.name}
                                                            variant="outlined"
                                                            color="secondary"
                                                        />
                                                    </Tooltip>
                                                );
                                            })}
                                        </Stack>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper elevation={1} sx={{ 
                        p: 2,
                        maxHeight: 200,
                        overflow: 'auto'
                    }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Battle Log</Typography>
                        <Box sx={{ 
                            display: 'flex',
                            flexDirection: 'column-reverse'
                        }}>
                            {battleLog.map((entry, index) => (
                                <Typography 
                                    key={index} 
                                    variant="body2" 
                                    sx={{ mb: 0.5 }}
                                >
                                    {entry}
                                </Typography>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {dungeonRewards.length > 0 && (
                    <Grid item xs={12}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Dungeon Rewards</Typography>
                            <Stack 
                                direction="row" 
                                spacing={1} 
                                justifyContent="center" 
                                flexWrap="wrap"
                                sx={{ gap: 1 }}
                            >
                                {dungeonRewards.map((reward, index) => (
                                    <Chip
                                        key={index}
                                        label={reward}
                                        color="success"
                                    />
                                ))}
                            </Stack>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default Battle;