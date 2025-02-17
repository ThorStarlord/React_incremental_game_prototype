import React, { useContext, useState, useEffect } from 'react';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import { dungeons } from '../modules/data/dungeons';
import { dungeonEnemies } from '../modules/data/dungeonEnemies';
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
    IconButton 
} from '@mui/material';
import '../styles/Battle.css';

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

    const handleAttack = () => {
        if (!battleStarted || !currentMonster) return;

        const playerDamage = Math.max(0, player.attack - currentMonster.defense);
        const newEnemyHP = Math.max(0, enemyHP - playerDamage);
        let logEntry = `${player.name} attacks ${currentMonster.name} for ${playerDamage} damage. ${currentMonster.name} HP: ${newEnemyHP}`;
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
                    const rewards = dungeon.rewards.slice(0, 2);
                    setDungeonRewards(rewards);
                    setBattleLog((prevLog) => [
                        ...prevLog,
                        `Dungeon Completed! You found:`,
                        ...rewards.map(reward => `- ${reward}`)
                    ]);
                    
                    setTimeout(() => {
                        if (onExplorationComplete) {
                            onExplorationComplete();
                        }
                    }, 5000);
                }
            }
            return;
        }

        const enemyDamage = Math.max(0, currentMonster.attack - player.defense);
        const newPlayerHP = Math.max(0, playerHP - enemyDamage);
        logEntry = `${currentMonster.name} attacks ${player.name} for ${enemyDamage} damage. ${player.name} HP: ${newPlayerHP}`;
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
            const intervalId = setInterval(() => {
                handleAttack();
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [battleStarted, enemyHP, playerHP]);

    return (
        <Grid container spacing={2}>
            {isDungeonBattle && (
                <Grid item xs={12}>
                    <Box className="dungeon-progress">
                        <Typography variant="h6">
                            {dungeon.name} - Progress: {dungeonProgress}/{DUNGEON_BATTLES}
                        </Typography>
                        <Box className="dungeon-progress-bar">
                            <div 
                                className="dungeon-progress-fill" 
                                style={{ width: `${(dungeonProgress / DUNGEON_BATTLES) * 100}%` }} 
                            />
                        </Box>
                    </Box>
                </Grid>
            )}

            <Grid item xs={12}>
                <Box className="enemy-info">
                    {!battleStarted ? (
                        <div>
                            <Typography variant="h6">
                                {isDungeonBattle ? `Choose your next opponent in ${dungeon.name}` : 'Select an Enemy'}
                            </Typography>
                            {availableEnemies && availableEnemies.length > 0 ? (
                                <List>
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
                        </div>
                    ) : (
                        <div>
                            <Typography variant="h6">Battle in Progress</Typography>
                            <Box mb={2}>
                                <Typography>
                                    {player.name}: {playerHP} HP | {currentMonster.name}: {enemyHP} HP
                                </Typography>
                                {currentMonster.traits.length > 0 && (
                                    <Stack direction="row" spacing={1} mt={1}>
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
                        </div>
                    )}
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Box className="battle-log">
                    <Typography variant="h6">Battle Log</Typography>
                    {battleLog.map((entry, index) => (
                        <Typography key={index} variant="body2">{entry}</Typography>
                    ))}
                </Box>
            </Grid>

            {dungeonRewards.length > 0 && (
                <Grid item xs={12}>
                    <Box className="battle-rewards">
                        <Typography variant="h6">Dungeon Rewards</Typography>
                        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                            {dungeonRewards.map((reward, index) => (
                                <Chip
                                    key={index}
                                    label={reward}
                                    color="success"
                                    className="reward-chip"
                                />
                            ))}
                        </Stack>
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

export default Battle;