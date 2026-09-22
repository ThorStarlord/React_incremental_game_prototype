import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Person,
  Star,
} from '@mui/icons-material';
import { PlayerStatsContainer } from '../features/Player/components/containers/PlayerStatsContainer';
import { PlayerTraitsContainer } from '../features/Player/components/containers/PlayerTraitsContainer';

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
 * with focused tabs for the currently shipped character progression surfaces.
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

  // Keep the page aligned with the shipped navigation scope.
  const tabs = [
    { label: 'Statistics', icon: Person },
    { label: 'Traits', icon: Star },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main,
            mb: 2,
          }}
        >
          Character Management
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Manage your character's statistics, traits, and relationship-derived capabilities
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="character management tabs"
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              },
            }}
          >
            {tabs.map((tab, index) => {
              const IconComponent = tab.icon;
              return (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={<IconComponent />}
                  iconPosition="start"
                  {...tabProps(index)}
                  sx={{
                    '& .MuiTab-iconWrapper': {
                      marginBottom: 0,
                      marginRight: 1,
                    },
                  }}
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/* Statistics Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mb: 3 }}
              >
                Character Statistics
              </Typography>
              <PlayerStatsContainer showDetails={true} />
            </Box>
          </TabPanel>

          {/* Traits Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mb: 3 }}
              >
                Trait Management
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                <AlertTitle>Traits and Capabilities</AlertTitle>
                Equip active traits, review permanent traits, and follow the capabilities your character has learned through the campaign. Visit Traits for acquisition and Resonance details.
              </Alert>
              <PlayerTraitsContainer />
            </Box>
          </TabPanel>

        </Box>
      </Paper>

      {/* Character Development Guide */}
      <Box sx={{ mt: 4 }}>
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            Character Development Guide
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Your character progresses through attributes, traits, relationship history, and authored capabilities rather than traditional leveling.
            Focus on meaningful interactions and the evidence they create.
          </Typography>
          <Box component="ul" sx={{ mt: 2, pl: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              <strong>Statistics:</strong> Monitor your vital stats, combat capabilities, and performance metrics
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              <strong>Traits:</strong> Equip traits for active benefits or make them permanent to free up slots
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              <strong>Capabilities:</strong> Build relationship-derived traits and routines that change which work you can perform
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
});

CharacterPage.displayName = 'CharacterPage';

export default CharacterPage;
