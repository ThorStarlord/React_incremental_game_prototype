import React, { useState } from 'react';
import { 
  useTheme, 
  Tabs, 
  Tab, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText,
  Avatar,
  Box,
  Chip,
  Divider
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useGameState } from '../../../context/GameStateExports';
import Panel from '../../../shared/components/layout/Panel';
import DialogueHistory from '../dialogue/DialogueHistory';

/**
 * Interface for an interaction history entry
 */
interface InteractionHistoryEntry {
  /** NPC ID */
  npcId: string;
  /** NPC name */
  npcName: string;
  /** Location of the interaction */
  location: string;
  /** Type of interaction */
  interactionType: string;
  /** Timestamp of interaction */
  timestamp: number;
  /** Additional details */
  details?: string;
}

/**
 * Interface for a quest history entry
 */
interface QuestHistoryEntry {
  /** Quest ID */
  questId: string;
  /** Quest title */
  title: string;
  /** NPC that gave the quest */
  givenBy: string;
  /** When the quest was accepted */
  acceptedTimestamp: number;
  /** When the quest was completed */
  completedTimestamp?: number;
  /** Quest status */
  status: 'active' | 'completed' | 'failed';
}

/**
 * Interface for an area discovery entry
 */
interface DiscoveryEntry {
  /** Location ID */
  locationId: string;
  /** Display name of location */
  locationName: string;
  /** When it was discovered */
  discoveredTimestamp: number;
  /** Whether this was a significant discovery */
  isSignificant: boolean;
}

/**
 * Interface for the history data in game state
 */
interface GameHistory {
  interactionHistory: InteractionHistoryEntry[];
  questHistory: QuestHistoryEntry[];
  discoveryHistory: DiscoveryEntry[];
}

/**
 * Interface for HistoryTab component props
 */
interface HistoryTabProps {
  /** Optional NPC ID to filter history */
  npcId?: string;
}

/**
 * Formats a timestamp for display
 * @param timestamp - Unix timestamp
 * @returns Formatted date and time
 */
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * HistoryTab Component
 * 
 * Displays player history including NPC interactions, dialogue history,
 * quest completions, and area discoveries.
 * 
 * @component
 * @param props - Component props
 * @param props.npcId - Optional NPC ID to filter history
 * 
 * @returns Rendered HistoryTab component
 */
const HistoryTab: React.FC<HistoryTabProps> = ({ npcId }) => {
  const theme = useTheme();
  const gameState = useGameState();
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue);
  };

  // Get history data with safeguards for missing properties
  // Access history data from the appropriate location in gameState
  const historyData = (gameState as any).history as GameHistory || {};
  const interactionHistory = historyData?.interactionHistory || [];
  const questHistory = historyData?.questHistory || [];

  // Filter histories based on npcId if provided
  const filteredInteractions = npcId 
    ? interactionHistory.filter((entry: InteractionHistoryEntry) => entry?.npcId === npcId)
    : interactionHistory;
    
  const filteredQuests = npcId
    ? questHistory.filter((entry: QuestHistoryEntry) => entry?.givenBy === npcId)
    : questHistory;

  return (
    <Panel title="History" icon={<HistoryIcon />}>
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        indicatorColor="primary" 
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="Dialogues" icon={<AutoStoriesIcon fontSize="small" />} />
        <Tab label="Interactions" icon={<MeetingRoomIcon fontSize="small" />} />
        <Tab label="Quests" icon={<EmojiEventsIcon fontSize="small" />} />
      </Tabs>
      
      {activeTab === 0 && (
        <DialogueHistory 
          filterNpcId={npcId} 
          maxMessages={100} 
        />
      )}
      
      {activeTab === 1 && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Interaction History
          </Typography>
          
          {filteredInteractions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center', fontStyle: 'italic' }}>
              No interaction history found
            </Typography>
          ) : (
            <List sx={{ bgcolor: theme.palette.background.paper, borderRadius: 1 }}>
              {filteredInteractions.map((entry: InteractionHistoryEntry, index: number) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <MeetingRoomIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={entry.npcName}
                      secondary={(
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {entry.interactionType} at {entry.location}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {formatTimestamp(entry.timestamp)}
                          </Typography>
                          {entry.details && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {entry.details}
                            </Typography>
                          )}
                        </>
                      )}
                    />
                  </ListItem>
                  {index < filteredInteractions.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </>
      )}
      
      {activeTab === 2 && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Quest History
          </Typography>
          
          {filteredQuests.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center', fontStyle: 'italic' }}>
              No quest history found
            </Typography>
          ) : (
            <List sx={{ bgcolor: theme.palette.background.paper, borderRadius: 1 }}>
              {filteredQuests.map((quest: QuestHistoryEntry, index: number) => (
                <React.Fragment key={quest.questId}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                        <EmojiEventsIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={(
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {quest.title}
                          <Chip 
                            size="small"
                            label={quest.status}
                            color={quest.status === 'completed' ? 'success' : quest.status === 'active' ? 'primary' : 'error'}
                          />
                        </Box>
                      )}
                      secondary={(
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            Given by: {quest.givenBy}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Accepted: {formatTimestamp(quest.acceptedTimestamp)}
                          </Typography>
                          {quest.completedTimestamp && (
                            <Typography variant="caption" display="block">
                              Completed: {formatTimestamp(quest.completedTimestamp)}
                            </Typography>
                          )}
                        </>
                      )}
                    />
                  </ListItem>
                  {index < filteredQuests.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </>
      )}
    </Panel>
  );
};

export default HistoryTab;
