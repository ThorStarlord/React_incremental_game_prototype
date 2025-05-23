import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  CompleteTabLayout,
  TabProvider,
  useTabContext,
  createPrimaryNavigationTabs,
  createTraitSystemTabs,
  createEssenceSystemTabs,
  createNPCSystemTabs,
  createCopySystemTabs,
  createQuestSystemTabs,
  createSettingsTabs,
} from '../index';

/**
 * Example component demonstrating complete tab layout usage
 * This serves as a reference implementation for the standardized tab system
 */
const TabLayoutExample: React.FC = () => {
  const {
    primaryTab,
    secondaryTab,
    primaryTabs,
    secondaryTabsMap,
    setPrimaryTab,
    setSecondaryTab,
  } = useTabContext();

  const renderContent = () => {
    const contentMap: Record<string, Record<string, React.ReactNode>> = {
      game: {
        overview: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Game Overview
            </Typography>
            <Typography variant="body1">
              Welcome to the main game overview. This is where players can see their overall progress,
              current status, and quick access to key game features.
            </Typography>
          </Box>
        ),
        world: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              World Exploration
            </Typography>
            <Typography variant="body1">
              Explore the game world, interact with NPCs, and discover new locations and opportunities.
            </Typography>
          </Box>
        ),
        combat: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Combat System
            </Typography>
            <Typography variant="body1">
              Engage in tactical combat encounters using your acquired traits and abilities.
            </Typography>
          </Box>
        ),
      },
      traits: {
        overview: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Trait System Overview
            </Typography>
            <Typography variant="body1">
              Manage your character's traits through emotional resonance and strategic customization.
            </Typography>
          </Box>
        ),
        acquired: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Acquired Traits
            </Typography>
            <Typography variant="body1">
              View all traits you've acquired through emotional connections and resonance.
            </Typography>
          </Box>
        ),
        equipped: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Equipped Traits
            </Typography>
            <Typography variant="body1">
              Manage your currently active trait loadout and swap between different configurations.
            </Typography>
          </Box>
        ),
        permanent: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Permanent Traits
            </Typography>
            <Typography variant="body1">
              View traits that have been made permanent through significant essence investment.
            </Typography>
          </Box>
        ),
        codex: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Trait Codex
            </Typography>
            <Typography variant="body1">
              Browse all discovered traits and learn about their effects and acquisition methods.
            </Typography>
          </Box>
        ),
      },
      essence: {
        overview: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Essence Overview
            </Typography>
            <Typography variant="body1">
              Monitor your essence generation, spending, and overall metaphysical resource management.
            </Typography>
          </Box>
        ),
        connections: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Emotional Connections
            </Typography>
            <Typography variant="body1">
              Manage your emotional connections with NPCs and track their contribution to essence generation.
            </Typography>
          </Box>
        ),
        generation: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Essence Generation
            </Typography>
            <Typography variant="body1">
              Analyze your passive essence generation rates and optimize your connection strategy.
            </Typography>
          </Box>
        ),
        spending: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Essence Spending
            </Typography>
            <Typography variant="body1">
              Plan and execute essence expenditures for trait acquisition, copy acceleration, and influence.
            </Typography>
          </Box>
        ),
      },
      npcs: {
        overview: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              NPC System Overview
            </Typography>
            <Typography variant="body1">
              Overview of all NPCs you've encountered and your relationships with them.
            </Typography>
          </Box>
        ),
        relationships: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Relationship Management
            </Typography>
            <Typography variant="body1">
              Track and manage your relationships with various NPCs across the game world.
            </Typography>
          </Box>
        ),
        interactions: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              NPC Interactions
            </Typography>
            <Typography variant="body1">
              Review past interactions and plan future engagement strategies with NPCs.
            </Typography>
          </Box>
        ),
        directory: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              NPC Directory
            </Typography>
            <Typography variant="body1">
              Browse a comprehensive directory of all discovered NPCs and their information.
            </Typography>
          </Box>
        ),
      },
      copies: {
        overview: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Copy System Overview
            </Typography>
            <Typography variant="body1">
              Manage your created copies and their various roles in your expanding influence.
            </Typography>
          </Box>
        ),
        active: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Active Copies
            </Typography>
            <Typography variant="body1">
              Monitor and command your currently active copies across different tasks and locations.
            </Typography>
          </Box>
        ),
        creation: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Copy Creation
            </Typography>
            <Typography variant="body1">
              Create new copies through seduction interactions and manage their growth paths.
            </Typography>
          </Box>
        ),
        management: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Copy Management
            </Typography>
            <Typography variant="body1">
              Advanced copy management including trait sharing, task assignment, and loyalty maintenance.
            </Typography>
          </Box>
        ),
      },
      quests: {
        active: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Active Quests
            </Typography>
            <Typography variant="body1">
              Track progress on your currently active quests and objectives.
            </Typography>
          </Box>
        ),
        completed: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Completed Quests
            </Typography>
            <Typography variant="body1">
              Review your quest achievements and the rewards you've earned.
            </Typography>
          </Box>
        ),
        available: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Available Quests
            </Typography>
            <Typography variant="body1">
              Discover new quests and opportunities for advancement and rewards.
            </Typography>
          </Box>
        ),
        log: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Quest Log
            </Typography>
            <Typography variant="body1">
              Complete quest journal with detailed information about all discovered quests.
            </Typography>
          </Box>
        ),
      },
      settings: {
        gameplay: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Gameplay Settings
            </Typography>
            <Typography variant="body1">
              Configure gameplay options, difficulty settings, and game mechanics preferences.
            </Typography>
          </Box>
        ),
        display: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Display Settings
            </Typography>
            <Typography variant="body1">
              Customize visual preferences, theme selection, and UI layout options.
            </Typography>
          </Box>
        ),
        audio: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Audio Settings
            </Typography>
            <Typography variant="body1">
              Adjust volume levels, sound effects, and music preferences.
            </Typography>
          </Box>
        ),
        controls: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Control Settings
            </Typography>
            <Typography variant="body1">
              Configure keyboard shortcuts, input preferences, and accessibility options.
            </Typography>
          </Box>
        ),
        saves: (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Save Management
            </Typography>
            <Typography variant="body1">
              Manage save files, export/import game data, and configure auto-save settings.
            </Typography>
          </Box>
        ),
      },
    };

    return contentMap[primaryTab]?.[secondaryTab] || (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Content Not Found
        </Typography>
        <Typography variant="body1">
          No content defined for {primaryTab} → {secondaryTab}
        </Typography>
      </Box>
    );
  };

  const activeSecondaryTabs = Object.keys(secondaryTabsMap).reduce(
    (acc, key) => {
      const tabs = secondaryTabsMap[key];
      acc[key] = key === primaryTab ? secondaryTab : (tabs[0]?.id || '');
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <CompleteTabLayout
      primaryTabs={primaryTabs}
      activePrimaryTab={primaryTab}
      onPrimaryTabChange={setPrimaryTab}
      secondaryTabsMap={secondaryTabsMap}
      activeSecondaryTabs={activeSecondaryTabs}
      onSecondaryTabChange={(_, secondaryTabId) => setSecondaryTab(secondaryTabId)}
      sx={{ height: '100vh' }}
    >
      {renderContent()}
    </CompleteTabLayout>
  );
};

/**
 * Main example component with TabProvider wrapper
 */
export const CompleteTabExample: React.FC = () => {
  const secondaryTabsMap = {
    game: [
      { id: 'overview', label: 'Overview' },
      { id: 'world', label: 'World' },
      { id: 'combat', label: 'Combat' },
    ],
    traits: createTraitSystemTabs(),
    essence: createEssenceSystemTabs(),
    npcs: createNPCSystemTabs(),
    copies: createCopySystemTabs(),
    quests: createQuestSystemTabs(),
    settings: createSettingsTabs(),
  };

  return (
    <TabProvider
      persistKey="example"
      defaultPrimaryTab="game"
      customPrimaryTabs={createPrimaryNavigationTabs()}
      customSecondaryTabsMap={secondaryTabsMap}
    >
      <Paper sx={{ height: '100vh', overflow: 'hidden' }}>
        <TabLayoutExample />
      </Paper>
    </TabProvider>
  );
};
