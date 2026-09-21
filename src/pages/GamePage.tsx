import React, { useCallback } from 'react';
import { Typography, Grid, Stack, Chip, Button } from '@mui/material';
import { useAppSelector } from '../app/hooks';

// Shared components
import Panel from '../shared/components/layout/Panel';
import { GameControlPanel } from '../features/GameLoop';
import { PlayerStatsContainer } from '../features/Player/components/containers/PlayerStatsContainer';

/**
 * Main Game Page Content Component
 * 
 * Renders the specific content for the main gameplay screen.
 * Assumes layout (header, columns) is provided by GameContainer via Outlet.
 */
const GamePage: React.FC = () => {
  const player = useAppSelector(state => state.player);
  const activeQuestCount = useAppSelector(state =>
    Object.values(state.quest.quests).filter(quest => quest.status === 'IN_PROGRESS').length
  );
  // Handler to reset the game: clear storage and reload
  const handleResetGame = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  return (
    <> 
      <Typography variant="h4" component="h1" gutterBottom>
        Game Control Center
      </Typography>
      
      <Grid container spacing={3}>
        {/* Game Controls Section */}
        <Grid item xs={12}>
          <Panel title="Game Loop Controls">
            <GameControlPanel />
          </Panel>
        </Grid>

        {/* World Content */}
        <Grid item xs={12}>
          <Panel title="Game World Interface">
            <Stack spacing={2}>
              <Typography variant="body1">
                You are present in <strong>{player.location.replace(/^location_/, '').replace(/_/g, ' ')}</strong>.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={`${Math.round(player.stats.health)} / ${Math.round(player.stats.maxHealth)} health`} color="success" />
                <Chip label={`${Math.round(player.stats.mana)} / ${Math.round(player.stats.maxMana)} mana`} color="info" />
                <Chip label={`${activeQuestCount} active quest${activeQuestCount === 1 ? '' : 's'}`} />
                <Chip label={`${player.statusEffects.length} status effect${player.statusEffects.length === 1 ? '' : 's'}`} />
              </Stack>
              <PlayerStatsContainer showDetails={false} />
              <Button variant="outlined" onClick={handleResetGame} sx={{ alignSelf: 'flex-start' }}>
                Reset local game
              </Button>
            </Stack>
          </Panel>
        </Grid>
      </Grid>
    </>
  );
};

export default GamePage;
