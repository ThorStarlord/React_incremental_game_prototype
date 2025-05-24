import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PersonIcon,
  StarIcon,
  InventoryIcon,
  TrendingUpIcon,
} from '@mui/icons-material';
import { PlayerStats, PlayerTraits, PlayerEquipment } from '../features/Player';
import { PlaceholderPage } from '../shared/components/PlaceholderPage/PlaceholderPage';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`character-tabpanel-${index}`}
    aria-labelledby={`character-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const tabProps = (index: number) => ({
  id: `character-tab-${index}`,
  'aria-controls': `character-tabpanel-${index}`,
});

/**
 * CharacterPage provides comprehensive character management interface
 * with tabbed navigation for different aspects of character progression.
 */
export const CharacterPage: React.FC = React.memo(() => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    },
    []
  );

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Character Management
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your character's stats, traits, equipment, and progression.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          allowScrollButtonsMobile
          aria-label="character management tabs"
        >
          <Tab
            icon={<PersonIcon />}
            label="Stats"
            iconPosition="start"
            {...tabProps(0)}
          />
          <Tab
            icon={<StarIcon />}
            label="Traits"
            iconPosition="start"
            {...tabProps(1)}
          />
          <Tab
            icon={<InventoryIcon />}
            label="Equipment"
            iconPosition="start"
            {...tabProps(2)}
          />
          <Tab
            icon={<TrendingUpIcon />}
            label="Skills"
            iconPosition="start"
            {...tabProps(3)}
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <PlayerStats />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <PlayerTraits />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <PlayerEquipment />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <PlaceholderPage
          title="Skills System"
          description="Skill trees and ability progression system for character development."
          status="planned"
          estimatedCompletion="Phase 4"
          features={[
            'Skill Trees - Multiple progression paths for different playstyles',
            'Active Abilities - Combat and utility skills with cooldowns',
            'Passive Abilities - Permanent stat bonuses and special effects',
            'Skill Points - Earned through leveling and quest completion',
            'Specialization - Focus on combat, social, or utility skill branches',
            'Skill Synergies - Combinations that provide additional bonuses',
          ]}
          technicalNotes={[
            'Integration with player progression system',
            'Skill effect calculation and application',
            'UI for skill tree visualization and management',
            'Balance system for skill costs and effectiveness',
          ]}
        />
      </TabPanel>
    </Container>
  );
});

CharacterPage.displayName = 'CharacterPage';

export default CharacterPage;
