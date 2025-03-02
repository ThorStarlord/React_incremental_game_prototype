import React, { useContext, useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Container,
  Grid,
  Divider,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { GameStateContext, GameDispatchContext, ACTION_TYPES } from '../../../context/GameStateContext';
import QuestItem from './QuestItem';
import Panel from '../../../components/common/Panel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

/**
 * @file QuestsPage.js
 * @description Main page for displaying and managing quests in the game
 * @module features/Quests/components
 */

const QuestsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const { quests, questProgress } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  
  // Group quests by status
  const questsByStatus = Object.values(quests.quests || {}).reduce((acc, quest) => {
    if (!acc[quest.status]) acc[quest.status] = [];
    acc[quest.status].push(quest);
    return acc;
  }, {});
  
  const activeQuests = questsByStatus['active'] || [];
  const completedQuests = questsByStatus['completed'] || [];
  const availableQuests = questsByStatus['not_started'] || [];
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleAcceptQuest = (questId) => {
    dispatch({
      type: ACTION_TYPES.ACCEPT_QUEST,
      payload: { questId }
    });
  };
  
  const handleAbandonQuest = (questId) => {
    if (window.confirm("Are you sure you want to abandon this quest? All progress will be lost.")) {
      dispatch({
        type: ACTION_TYPES.ABANDON_QUEST,
        payload: { questId }
      });
    }
  };
  
  const handleCompleteQuest = (questId) => {
    dispatch({
      type: ACTION_TYPES.COMPLETE_QUEST,
      payload: { questId }
    });
  };

  // Getting the appropriate icon for each tab
  const getTabIcon = (index) => {
    switch(index) {
      case 0: return <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />;
      case 1: return <HourglassEmptyIcon fontSize="small" sx={{ mr: 1 }} />;
      case 2: return <TaskAltIcon fontSize="small" sx={{ mr: 1 }} />;
      default: return null;
    }
  };

  // Render the appropriate content for the selected tab
  const renderTabContent = () => {
    switch(tabValue) {
      case 0: // Active Quests Tab
        return (
          <>
            {activeQuests.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                You have no active quests. Check available quests or speak with NPCs to find new quests.
              </Alert>
            ) : (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {activeQuests.map(quest => (
                  <Grid item xs={12} key={quest.id}>
                    <QuestItem 
                      quest={quest}
                      progress={questProgress[quest.id] || {}}
                      onAbandon={handleAbandonQuest}
                      onComplete={handleCompleteQuest}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        );
      
      case 1: // Available Quests Tab
        return (
          <>
            {availableQuests.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                There are no available quests at the moment. Explore the world to unlock more quests.
              </Alert>
            ) : (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {availableQuests.map(quest => (
                  <Grid item xs={12} md={6} lg={4} key={quest.id}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <QuestItem 
                          quest={quest}
                          onAccept={handleAcceptQuest}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        );
      
      case 2: // Completed Quests Tab
        return (
          <>
            {completedQuests.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                You haven't completed any quests yet. Complete active quests to see them here.
              </Alert>
            ) : (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {completedQuests.map(quest => (
                  <Grid item xs={12} key={quest.id}>
                    <QuestItem 
                      quest={quest}
                      progress={questProgress[quest.id] || {}}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Panel title="Quest Journal">
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            aria-label="quest tabs"
          >
            <Tab 
              icon={getTabIcon(0)} 
              iconPosition="start" 
              label={`Active (${activeQuests.length})`}
              id="quest-tab-0"
              aria-controls="quest-tabpanel-0" 
            />
            <Tab 
              icon={getTabIcon(1)} 
              iconPosition="start" 
              label={`Available (${availableQuests.length})`} 
              id="quest-tab-1"
              aria-controls="quest-tabpanel-1"
            />
            <Tab 
              icon={getTabIcon(2)} 
              iconPosition="start" 
              label={`Completed (${completedQuests.length})`}
              id="quest-tab-2"
              aria-controls="quest-tabpanel-2" 
            />
          </Tabs>
        </Box>
        
        <Box
          role="tabpanel"
          id={`quest-tabpanel-${tabValue}`}
          aria-labelledby={`quest-tab-${tabValue}`}
          sx={{ py: 3 }}
        >
          {renderTabContent()}
        </Box>
        
        <Divider sx={{ mt: 4, mb: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Game Stats
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Active Quests
                </Typography>
                <Typography variant="h4" component="div">
                  {activeQuests.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Available Quests
                </Typography>
                <Typography variant="h4" component="div">
                  {availableQuests.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Completed Quests
                </Typography>
                <Typography variant="h4" component="div">
                  {completedQuests.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Completion Rate
                </Typography>
                <Typography variant="h4" component="div">
                  {completedQuests.length > 0 
                    ? Math.round((completedQuests.length / (completedQuests.length + activeQuests.length + availableQuests.length)) * 100)
                    : 0}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Panel>
  );
};

export default QuestsPage;