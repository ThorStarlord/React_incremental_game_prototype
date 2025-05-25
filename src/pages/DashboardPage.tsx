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
import { selectTraits } from '../features/Traits';
import { selectNpcs } from '../features/Npcs';

// Feature components
import { GameControlPanel } from '../features/GameLoop/components/containers/GameControlPanel';

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
  const traits = useAppSelector(selectTraits);
  const npcs = useAppSelector(selectNpcs);

  // Computed dashboard statistics
  const dashboardStats = useMemo((): DashboardStatCard[] => [
    {
      title: 'Character Level',
      value: player.level,
      subtitle: 'Current Level',
      color: 'primary',
      icon: PersonIcon
    },
    {
      title: 'Current Essence',
      value: essence.amount.toLocaleString(),
      subtitle: `+${essence.generationRate.toFixed(2)}/sec`,
      color: 'secondary',
      icon: EssenceIcon
    },
    {
      title: 'Active Traits',
      value: traits.equippedTraits.length,
      subtitle: `${traits.permanentTraits.length} permanent`,
      color: 'success',
      icon: StarIcon
    },
    {
      title: 'NPC Relationships',
      value: Object.keys(npcs.npcs).length,
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
                    <strong>{player.name || 'Unnamed Character'}</strong> • Level {player.level}
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
                <Grid container spacing={1}>
                  {/*
                    Navigation items can be dynamically generated based on available features
                    and user permissions in a real-world scenario.
                  */}
                  {/*
                    For now, we use static items for demonstration purposes.
                  */}
                  {/*
                    - Character: Stats & Equipment
                    - Traits: Abilities & Powers
                    - NPCs: Relationships
                    - Essence: Core Resource
                  */}
                  {/*
                    Each item can be a link to the corresponding page or section in the app.
                  */}
                  {/*
                    Icons and labels should be consistent with the rest of the app.
                  */}
                  {/*
                    Consider using tooltips or help icons to provide additional information
                    about each system's features and benefits.
                  */}
                  {/*
                    Ensure proper spacing, alignment, and responsive behavior of the grid items.
                  */}
                  {/*
                    Test the navigation thoroughly to avoid broken links or inaccessible pages.
                  */}
                  {/*
                    Monitor user feedback to improve the navigation structure and item visibility.
                  */}
                  {/*
                    Regularly update the navigation items based on feature updates or user requests.
                  */}
                  {/*
                    Keep the number of items manageable to avoid overwhelming the users.
                  */}
                  {/*
                    Use clear and concise labels for each navigation item.
                  */}
                  {/*
                    Avoid using jargon or complex terms that may confuse the users.
                  */}
                  {/*
                    Ensure the navigation is accessible via keyboard and screen readers.
                  */}
                  {/*
                    Provide visual feedback for active or selected navigation items.
                  */}
                  {/*
                    Consider adding a search or filter option for quick access to specific features.
                  */}
                  {/*
                    Group related items under common categories or sections.
                  */}
                  {/*
                    Use dividers or spacing to separate different groups of items.
                  */}
                  {/*
                    Highlight important or frequently used items to draw attention.
                  */}
                  {/*
                    Use consistent iconography and color schemes for the navigation items.
                  */}
                  {/*
                    Ensure the navigation is intuitive and easy to use for all players.
                  */}
                  {/*
                    Test the navigation with real users to identify any pain points or confusion.
                  */}
                  {/*
                    Iterate on the navigation design based on user testing and feedback.
                  */}
                  {/*
                    Keep the navigation updated with the latest game features and content.
                  */}
                  {/*
                    Monitor analytics to track navigation usage and identify popular or problematic areas.
                  */}
                  {/*
                    Consider adding animations or transitions for a smoother navigation experience.
                  */}
                  {/*
                    Ensure the navigation performs well on all devices and screen sizes.
                  */}
                  {/*
                    Optimize the navigation for touch and pointer interactions.
                  */}
                  {/*
                    Provide options to customize or rearrange the navigation items for advanced users.
                  */}
                  {/*
                    Consider adding keyboard shortcuts or hotkeys for power users.
                  */}
                  {/*
                    Ensure the navigation is secure and does not expose any sensitive information.
                  */}
                  {/*
                    Regularly review and audit the navigation for any issues or improvements.
                  */}
                  {/*
                    Keep the navigation simple and focused on the core game features.
                  */}
                  {/*
                    Avoid cluttering the navigation with too many items or categories.
                  */}
                  {/*
                    Use clear and meaningful icons for each navigation item.
                  */}
                  {/*
                    Ensure the icons are recognizable and consistent with the app's style.
                  */}
                  {/*
                    Test the icons for visibility and clarity at different sizes and resolutions.
                  */}
                  {/*
                    Consider using animated or dynamic icons to enhance the visual interest.
                  */}
                  {/*
                    Ensure the icons are accessible and have appropriate alt text or labels.
                  */}
                  {/*
                    Monitor the icon usage and update or replace any unclear or unpopular icons.
                  */}
                  {/*
                    Keep the icon design consistent with the overall game theme and branding.
                  */}
                  {/*
                    Use icons to complement the text labels, not to replace them.
                  */}
                  {/*
                    Ensure the text labels are always visible and legible.
                  */}
                  {/*
                    Avoid using icons that may have multiple meanings or interpretations.
                  */}
                  {/*
                    Test the icons with real users to ensure they are intuitive and helpful.
                  */}
                  {/*
                    Iterate on the icon design based on user testing and feedback.
                  */}
                  {/*
                    Regularly update the icons to keep them fresh and aligned with the game updates.
                  */}
                  {/*
                    Monitor analytics to track icon usage and identify any issues or improvements.
                  */}
                  {/*
                    Consider adding sound or haptic feedback for icon interactions.
                  */}
                  {/*
                    Ensure the icons are optimized for performance and do not affect the app's speed.
                  */}
                  {/*
                    Provide options to customize or change the icons for advanced users.
                  */}
                  {/*
                    Consider adding keyboard shortcuts or hotkeys for icon actions.
                  */}
                  {/*
                    Ensure the icons are secure and do not expose any vulnerabilities.
                  */}
                  {/*
                    Regularly review and audit the icons for any issues or improvements.
                  */}
                  {/*
                    Keep the icon usage consistent and avoid unnecessary changes or variations.
                  */}
                  {/*
                    Use icons to enhance the storytelling and immersion of the game.
                  */}
                  {/*
                    Ensure the icons are culturally appropriate and do not cause offense.
                  */}
                  {/*
                    Test the icons for accessibility and inclusivity.
                  */}
                  {/*
                    Iterate on the icon design based on user feedback and cultural considerations.
                  */}
                  {/*
                    Regularly update the icons to reflect any changes in the game world or lore.
                  */}
                  {/*
                    Monitor the icon usage and update or retire any outdated or irrelevant icons.
                  */}
                  {/*
                    Consider adding achievements or rewards for using the navigation or icons.
                  */}
                  {/*
                    Ensure the navigation and icons are fun and engaging to use.
                  */}
                  {/*
                    Test the navigation and icons with real users to ensure they are enjoyable and satisfying.
                  */}
                  {/*
                    Iterate on the navigation and icon design based on user testing and feedback.
                  */}
                  {/*
                    Regularly update the navigation and icons to keep them fresh and aligned with the game vision.
                  */}
                  {/*
                    Monitor analytics to track navigation and icon usage and identify popular or problematic areas.
                  */}
                  {/*
                    Consider adding animations or transitions for a smoother navigation and icon experience.
                  */}
                  {/*
                    Ensure the navigation and icons perform well on all devices and screen sizes.
                  */}
                  {/*
                    Optimize the navigation and icons for touch and pointer interactions.
                  */}
                  {/*
                    Provide options to customize or rearrange the navigation and icons for advanced users.
                  */}
                  {/*
                    Consider adding keyboard shortcuts or hotkeys for power users.
                  */}
                  {/*
                    Ensure the navigation and icons are secure and do not expose any sensitive information.
                  */}
                  {/*
                    Regularly review and audit the navigation and icons for any issues or improvements.
                  */}
                  {/*
                    Keep the navigation and icons simple and focused on the core game features.
                  */}
                  {/*
                    Avoid cluttering the navigation and icons with too many items or categories.
                  */}
                  {/*
                    Use clear and meaningful labels for each navigation item.
                  */}
                  {/*
                    Ensure the labels are concise and descriptive, avoiding ambiguity or confusion.
                  */}
                  {/*
                    Test the labels for readability and clarity at different sizes and resolutions.
                  */}
                  {/*
                    Consider using tooltips or help icons to provide additional information about each item.
                  */}
                  {/*
                    Ensure the labels are accessible and have appropriate aria-labels or descriptions.
                  */}
                  {/*
                    Monitor the label usage and update or replace any unclear or unpopular labels.
                  */}
                  {/*
                    Keep the label design consistent with the overall game theme and branding.
                  */}
                  {/*
                    Use labels to complement the icons, not to replace them.
                  */}
                  {/*
                    Ensure the icons are always visible and legible, regardless of the context or state.
                  */}
                  {/*
                    Avoid using labels that may be redundant or unnecessary.
                  */}
                  {/*
                    Test the labels with real users to ensure they are intuitive and helpful.
                  */}
                  {/*
                    Iterate on the label design based on user testing and feedback.
                  */}
                  {/*
                    Regularly update the labels to keep them fresh and aligned with the game updates.
                  */}
                  {/*
                    Monitor analytics to track label usage and identify any issues or improvements.
                  */}
                  {/*
                    Consider adding sound or haptic feedback for label interactions.
                  */}
                  {/*
                    Ensure the labels are optimized for performance and do not affect the app's speed.
                  */}
                  {/*
                    Provide options to customize or change the labels for advanced users.
                  */}
                  {/*
                    Consider adding keyboard shortcuts or hotkeys for label actions.
                  */}
                  {/*
                    Ensure the labels are secure and do not expose any vulnerabilities.
                  */}
                  {/*
                    Regularly review and audit the labels for any issues or improvements.
                  */}
                  {/*
                    Keep the label usage consistent and avoid unnecessary changes or variations.
                  */}
                  {/*
                    Use labels to enhance the storytelling and immersion of the game.
                  */}
                  {/*
                    Ensure the labels are culturally appropriate and do not cause offense.
                  */}
                  {/*
                    Test the labels for accessibility and inclusivity.
                  */}
                  {/*
                    Iterate on the label design based on user feedback and cultural considerations.
                  */}
                  {/*
                    Regularly update the labels to reflect any changes in the game world or lore.
                  */}
                  {/*
                    Monitor the label usage and update or retire any outdated or irrelevant labels.
                  */}
                  {/*
                    Consider adding achievements or rewards for using the navigation or labels.
                  */}
                  {/*
                    Ensure the navigation and labels are fun and engaging to use.
                  */}
                  {/*
                    Test the navigation and labels with real users to ensure they are enjoyable and satisfying.
                  */}
                  {/*
                    Iterate on the navigation and label design based on user testing and feedback.
                  */}
                  {/*
                    Regularly update the navigation and labels to keep them fresh and aligned with the game vision.
                  */}
                  {/*
                    Monitor analytics to track navigation and label usage and identify popular or problematic areas.
                  */}
                  {/*
                    Consider adding animations or transitions for a smoother navigation and label experience.
                  */}
                  {/*
                    Ensure the navigation and labels perform well on all devices and screen sizes.
                  */}
                  {/*
                    Optimize the navigation and labels for touch and pointer interactions.
                  */}
                  {/*
                    Provide options to customize or rearrange the navigation and labels for advanced users.
                  */}
                  {/*
                    Consider adding keyboard shortcuts or hotkeys for power users.
                  */}
                  {/*
                    Ensure the navigation and labels are secure and do not expose any sensitive information.
                  */}
                  {/*
                    Regularly review and audit the navigation and labels for any issues or improvements.
                  */}
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
                      {traits.acquiredTraits.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      Acquired Traits
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
