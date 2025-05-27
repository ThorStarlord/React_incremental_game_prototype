import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Alert, 
  AlertTitle,
  Chip,
  LinearProgress,
  Stack,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { 
  Person as PersonIcon,
  Star as StarIcon,
  Group as GroupIcon,
  AutoAwesome as EssenceIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// App hooks and selectors
import { useAppSelector } from '../app/hooks';
import { selectPlayer } from '../features/Player';
import { selectEssence } from '../features/Essence';
import { selectGameLoop } from '../features/GameLoop';
import { selectEquippedTraitObjects } from '../features/Traits'; // Fixed import
import { selectNPCs } from '../features/NPCs'; // Fixed import

// Feature components
import { GameControlPanel } from '../features/GameLoop/components/ui/GameControlPanel';

/**
 * Interface for dashboard stat cards
 */
interface DashboardStatCard {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  icon?: React.ElementType;
  progress?: number;
}

/**
 * Interface for quick action items
 */
interface QuickActionItem {
  label: string;
  value: string;
  icon: React.ElementType;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

/**
 * DashboardPage component - Main overview page displaying key game information
 * 
 * Features:
 * - Player status overview with vital stats and progression
 * - Resource summaries with generation rates
 * - Game controls with timing information
 * - Quick navigation to other systems
 * - Performance metrics and achievements
 * - Recent activity summary
 */
export const DashboardPage: React.FC = React.memo(() => {
  const theme = useTheme();
  
  // Redux state selection
  const player = useAppSelector(selectPlayer);
  const essence = useAppSelector(selectEssence);
  const gameLoop = useAppSelector(selectGameLoop);
  const traits = useAppSelector(selectEquippedTraitObjects); // Fixed usage
  const npcs = useAppSelector(selectNPCs); // Fixed usage

  // Computed dashboard statistics
  const dashboardStats = useMemo((): DashboardStatCard[] => [
    {
      title: 'Current Essence',
      value: essence.amount.toLocaleString(),
      subtitle: `+${essence.generationRate.toFixed(2)}/sec`,
      color: 'secondary',
      icon: EssenceIcon
    },
    {
      title: 'Active Traits',
      value: traits.length,
      subtitle: `${traits.length} equipped`,
      color: 'success',
      icon: StarIcon
    },
    {
      title: 'NPC Relationships',
      value: Object.keys(npcs).length,
      subtitle: `${essence.npcConnections} connections`,
      color: 'warning',
      icon: GroupIcon
    }
  ], [player, essence, traits, npcs]);

  // Quick action items
  const quickActions = useMemo((): QuickActionItem[] => [
    {
      label: 'Health',
      value: `${player.stats.health}/${player.stats.maxHealth}`,
      icon: TrendingUpIcon,
      color: player.stats.health < player.stats.maxHealth * 0.3 ? 'error' : 'success'
    },
    {
      label: 'Mana',
      value: `${player.stats.mana}/${player.stats.maxMana}`,
      icon: TrendingUpIcon,
      color: player.stats.mana < player.stats.maxMana * 0.3 ? 'warning' : 'primary'
    },
    {
      label: 'Gold',
      value: player.gold.toLocaleString(),
      icon: TrendingUpIcon,
      color: 'warning'
    },
    {
      label: 'Game Time',
      value: formatGameTime(gameLoop.totalGameTime),
      icon: ScheduleIcon,
      color: 'secondary'
    }
  ], [player, gameLoop]);

  // Health percentage for progress bar
  const healthPercentage = useMemo(() => 
    (player.stats.health / player.stats.maxHealth) * 100,
    [player.stats.health, player.stats.maxHealth]
  );

  // Mana percentage for progress bar
  const manaPercentage = useMemo(() => 
    (player.stats.mana / player.stats.maxMana) * 100,
    [player.stats.mana, player.stats.maxMana]
  );

  return (
    <Box sx={{ py: 3 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          mb: 3,
          fontWeight: 600,
          color: theme.palette.primary.main
        }}
      >
        Game Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Game Controls Section */}
        <Grid item xs={12} lg={6}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <SettingsIcon color="primary" />
                <Typography variant="h6" component="h2">
                  Game Controls
                </Typography>
                <Chip 
                  label={gameLoop.isRunning ? 'Running' : 'Stopped'} 
                  color={gameLoop.isRunning ? 'success' : 'default'}
                  size="small"
                />
              </Stack>
              <GameControlPanel />
            </CardContent>
          </Card>
        </Grid>

        {/* Character Vitals Section */}
        <Grid item xs={12} lg={6}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6" component="h2">
                  Character Vitals
                </Typography>
                <Chip 
                  label={player.isAlive ? 'Alive' : 'Dead'} 
                  color={player.isAlive ? 'success' : 'error'}
                  size="small"
                />
              </Stack>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>{player.name || 'Unnamed Character'}</strong>
                  </Typography>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Health: {player.stats.health}/{player.stats.maxHealth} ({healthPercentage.toFixed(0)}%)
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={healthPercentage} 
                      color={healthPercentage < 30 ? 'error' : healthPercentage < 70 ? 'warning' : 'success'}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Mana: {player.stats.mana}/{player.stats.maxMana} ({manaPercentage.toFixed(0)}%)
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={manaPercentage} 
                      color="primary"
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Dashboard Statistics */}
        {dashboardStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={1} sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  {stat.icon && <stat.icon color={stat.color} fontSize="small" />}
                  <Typography variant="subtitle2" color="text.secondary" noWrap>
                    {stat.title}
                  </Typography>
                </Stack>
                
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  {stat.value}
                </Typography>
                
                {stat.subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {stat.subtitle}
                  </Typography>
                )}
                
                {stat.progress !== undefined && (
                  <LinearProgress 
                    variant="determinate" 
                    value={stat.progress} 
                    color={stat.color}
                    sx={{ mt: 1, height: 4, borderRadius: 1 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Resources Overview */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Resources Overview
              </Typography>
              
              <List dense>
                {quickActions.map((action, index) => (
                  <ListItem key={index} divider={index < quickActions.length - 1}>
                    <ListItemIcon>
                      <action.icon color={action.color} fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={action.label}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                    <ListItemSecondaryAction>
                      <Chip 
                        label={action.value} 
                        color={action.color}
                        size="small"
                        variant="outlined"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Navigation */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <SaveIcon color="primary" />
                <Typography variant="h6" component="h2">
                  Quick Navigation
                </Typography>
              </Stack>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>Navigation Guide</AlertTitle>
                Use the sidebar navigation to access different game systems:
              </Alert>
              
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Stack alignItems="center" spacing={1}>
                      <PersonIcon color="primary" fontSize="large" />
                      <Typography variant="caption" textAlign="center">
                        Character
                      </Typography>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Stats & Equipment
                      </Typography>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Stack alignItems="center" spacing={1}>
                      <StarIcon color="secondary" fontSize="large" />
                      <Typography variant="caption" textAlign="center">
                        Traits
                      </Typography>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Abilities & Powers
                      </Typography>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Stack alignItems="center" spacing={1}>
                      <GroupIcon color="warning" fontSize="large" />
                      <Typography variant="caption" textAlign="center">
                        NPCs
                      </Typography>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Relationships
                      </Typography>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Stack alignItems="center" spacing={1}>
                      <EssenceIcon color="info" fontSize="large" />
                      <Typography variant="caption" textAlign="center">
                        Essence
                      </Typography>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Core Resource
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Game Statistics */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Session Statistics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Stack alignItems="center" spacing={1}>
                    <Typography variant="h4" color="primary.main" fontWeight={600}>
                      {traits.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      Equipped Traits
                    </Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Stack alignItems="center" spacing={1}>
                    <Typography variant="h4" color="secondary.main" fontWeight={600}>
                      {essence.totalCollected.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      Total Essence Collected
                    </Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Stack alignItems="center" spacing={1}>
                    <Typography variant="h4" color="success.main" fontWeight={600}>
                      {gameLoop.currentTick.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      Game Ticks Elapsed
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

/**
 * Format game time from milliseconds to human-readable format
 */
function formatGameTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
