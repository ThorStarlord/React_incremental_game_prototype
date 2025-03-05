import React, { useState, useEffect } from 'react';
import { useGameState } from '../context';
import { QUEST_ACTION_TYPES } from '../context/actions/questActions';
import styled from 'styled-components';
import {
  Panel,
  Button,
  Card,
  ProgressBar,
  Tabs,
  Tab,
  Icon,
  Badge
} from '../components/ui';

// Define interfaces for quest-related data
interface Quest {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'failed' | 'available';
  progress?: number;
  objectives?: Array<{
    id: string;
    description: string;
    current: number;
    target: number;
    completed: boolean;
  }>;
  reward?: {
    experience?: number;
    gold?: number;
    items?: Array<{
      id: string;
      name: string;
      quantity: number;
      icon?: string;
    }>;
    reputation?: Record<string, number>;
    essence?: number;
  };
  timeLimit?: number;
  startedAt?: number;
  expiresAt?: number;
  difficulty?: 'easy' | 'normal' | 'hard' | 'epic';
  type?: 'main' | 'side' | 'daily' | 'repeatable' | 'event';
  location?: string;
  giver?: string;
  requiredLevel?: number;
}

interface QuestsTabProps {
  quests: Quest[];
  activeQuestId: string | null;
  onSelectQuest: (questId: string) => void;
  onAbandonQuest: (questId: string) => void;
  onTrackQuest: (questId: string) => void;
}

interface QuestDetailsProps {
  quest: Quest;
  onTrackQuest: (questId: string) => void;
  onAbandonQuest: (questId: string) => void;
  onCompleteQuest?: (questId: string) => void;
}

const QuestsPage: React.FC = () => {
  const { state, dispatch } = useGameState();
  const [activeTab, setActiveTab] = useState<string>('active');
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [trackedQuestId, setTrackedQuestId] = useState<string | null>(null);

  // Get quests from state based on their status
  const activeQuests: Quest[] = state.player?.activeQuests || [];
  const completedQuestIds: string[] = state.player?.completedQuests || [];
  const availableQuests: Quest[] = state.quests?.available || [];
  const completedQuests: Quest[] = state.quests?.completed || [];

  // Select the first active quest by default if none is selected
  useEffect(() => {
    if (!selectedQuestId && activeQuests.length > 0) {
      setSelectedQuestId(activeQuests[0].id);
    }
  }, [activeQuests, selectedQuestId]);

  // Handle selecting a quest
  const handleSelectQuest = (questId: string): void => {
    setSelectedQuestId(questId);
  };

  // Handle tracking a quest (shows in HUD)
  const handleTrackQuest = (questId: string): void => {
    setTrackedQuestId(questId === trackedQuestId ? null : questId);
    
    dispatch({
      type: QUEST_ACTION_TYPES.SET_ACTIVE_QUEST,
      payload: { questId: questId === trackedQuestId ? null : questId }
    });
  };

  // Handle abandoning a quest
  const handleAbandonQuest = (questId: string): void => {
    if (confirm('Are you sure you want to abandon this quest? Any progress will be lost.')) {
      dispatch({
        type: QUEST_ACTION_TYPES.ABANDON_QUEST,
        payload: { questId }
      });
      
      // If the abandoned quest was selected or tracked, reset those states
      if (selectedQuestId === questId) {
        setSelectedQuestId(null);
      }
      if (trackedQuestId === questId) {
        setTrackedQuestId(null);
      }
    }
  };

  // Handle accepting a quest
  const handleAcceptQuest = (questId: string): void => {
    dispatch({
      type: QUEST_ACTION_TYPES.START_QUEST,
      payload: { questId }
    });
    setActiveTab('active');
    setSelectedQuestId(questId);
  };

  // Handle completing a quest
  const handleCompleteQuest = (questId: string): void => {
    dispatch({
      type: QUEST_ACTION_TYPES.COMPLETE_QUEST,
      payload: { questId }
    });
    
    if (trackedQuestId === questId) {
      setTrackedQuestId(null);
    }
  };

  // Get the selected quest object based on the active tab and selectedQuestId
  const getSelectedQuest = (): Quest | undefined => {
    let questPool: Quest[];
    
    switch (activeTab) {
      case 'active':
        questPool = activeQuests;
        break;
      case 'available':
        questPool = availableQuests;
        break;
      case 'completed':
        questPool = completedQuests;
        break;
      default:
        questPool = [];
    }
    
    return questPool.find(q => q.id === selectedQuestId);
  };

  // Render quest list component based on active tab
  const renderQuestsList = (): JSX.Element => {
    switch (activeTab) {
      case 'active':
        return (
          <QuestsListContainer>
            <h2>Active Quests ({activeQuests.length})</h2>
            {activeQuests.length === 0 ? (
              <EmptyState>No active quests. Visit NPCs in the world to find quests.</EmptyState>
            ) : (
              <QuestsList>
                {activeQuests.map(quest => (
                  <QuestCard
                    key={quest.id}
                    selected={selectedQuestId === quest.id}
                    onClick={() => handleSelectQuest(quest.id)}
                    difficulty={quest.difficulty}
                  >
                    <QuestTitle>{quest.name}</QuestTitle>
                    <QuestProgress>
                      <ProgressBar
                        value={quest.progress || 0}
                        max={100}
                        showLabel={true}
                        size="small"
                      />
                    </QuestProgress>
                    <QuestCardButtons>
                      <QuestButton
                        small
                        active={trackedQuestId === quest.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrackQuest(quest.id);
                        }}
                      >
                        <Icon name={trackedQuestId === quest.id ? "eye-fill" : "eye"} />
                      </QuestButton>
                      <QuestButton
                        small
                        danger
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAbandonQuest(quest.id);
                        }}
                      >
                        <Icon name="trash" />
                      </QuestButton>
                    </QuestCardButtons>
                  </QuestCard>
                ))}
              </QuestsList>
            )}
          </QuestsListContainer>
        );
        
      case 'available':
        return (
          <QuestsListContainer>
            <h2>Available Quests ({availableQuests.length})</h2>
            {availableQuests.length === 0 ? (
              <EmptyState>No quests available. Explore the world to discover new quests.</EmptyState>
            ) : (
              <QuestsList>
                {availableQuests.map(quest => (
                  <QuestCard
                    key={quest.id}
                    selected={selectedQuestId === quest.id}
                    onClick={() => handleSelectQuest(quest.id)}
                    difficulty={quest.difficulty}
                  >
                    <QuestTitle>{quest.name}</QuestTitle>
                    <QuestLocation>
                      <Icon name="map-pin" /> {quest.location || 'Unknown'}
                    </QuestLocation>
                    {quest.requiredLevel && (
                      <QuestRequiredLevel>
                        Required Level: {quest.requiredLevel}
                      </QuestRequiredLevel>
                    )}
                  </QuestCard>
                ))}
              </QuestsList>
            )}
          </QuestsListContainer>
        );
        
      case 'completed':
        return (
          <QuestsListContainer>
            <h2>Completed Quests ({completedQuests.length})</h2>
            {completedQuests.length === 0 ? (
              <EmptyState>You haven't completed any quests yet.</EmptyState>
            ) : (
              <QuestsList>
                {completedQuests.map(quest => (
                  <QuestCard
                    key={quest.id}
                    selected={selectedQuestId === quest.id}
                    onClick={() => handleSelectQuest(quest.id)}
                    completed
                  >
                    <QuestTitle>{quest.name}</QuestTitle>
                    <QuestType>
                      {quest.type && (
                        <Badge type={quest.type === 'main' ? 'primary' : 'secondary'}>
                          {quest.type}
                        </Badge>
                      )}
                    </QuestType>
                  </QuestCard>
                ))}
              </QuestsList>
            )}
          </QuestsListContainer>
        );
        
      default:
        return <div>Select a tab to view quests</div>;
    }
  };

  // Render details section for the selected quest
  const renderQuestDetails = (): JSX.Element | null => {
    const selectedQuest = getSelectedQuest();
    
    if (!selectedQuest) {
      return null;
    }
    
    return (
      <QuestDetailsPanel>
        <QuestDetailHeader difficulty={selectedQuest.difficulty}>
          <QuestDetailTitle>{selectedQuest.name}</QuestDetailTitle>
          {selectedQuest.type && (
            <QuestTypeBadge type={selectedQuest.type}>
              {selectedQuest.type}
            </QuestTypeBadge>
          )}
        </QuestDetailHeader>
        
        {selectedQuest.difficulty && (
          <QuestDifficulty>
            Difficulty: <DifficultyIndicator difficulty={selectedQuest.difficulty}>
              {selectedQuest.difficulty}
            </DifficultyIndicator>
          </QuestDifficulty>
        )}
        
        <QuestDescription>{selectedQuest.description}</QuestDescription>
        
        {selectedQuest.objectives && selectedQuest.objectives.length > 0 && (
          <QuestSection>
            <h3>Objectives</h3>
            <ObjectiveList>
              {selectedQuest.objectives.map(objective => (
                <ObjectiveItem key={objective.id} completed={objective.completed}>
                  <ObjectiveCheck completed={objective.completed}>
                    {objective.completed ? <Icon name="check-circle-fill" /> : <Icon name="circle" />}
                  </ObjectiveCheck>
                  <ObjectiveText>{objective.description}</ObjectiveText>
                  <ObjectiveProgress>
                    {objective.current}/{objective.target}
                  </ObjectiveProgress>
                </ObjectiveItem>
              ))}
            </ObjectiveList>
          </QuestSection>
        )}
        
        {selectedQuest.reward && (
          <QuestSection>
            <h3>Rewards</h3>
            <RewardsList>
              {selectedQuest.reward.experience && (
                <RewardItem>
                  <Icon name="star-fill" color="#FFD700" />
                  <RewardText>{selectedQuest.reward.experience} Experience</RewardText>
                </RewardItem>
              )}
              {selectedQuest.reward.gold && (
                <RewardItem>
                  <Icon name="coin" color="#FFD700" />
                  <RewardText>{selectedQuest.reward.gold} Gold</RewardText>
                </RewardItem>
              )}
              {selectedQuest.reward.essence && (
                <RewardItem>
                  <Icon name="gem" color="#9C27B0" />
                  <RewardText>{selectedQuest.reward.essence} Essence</RewardText>
                </RewardItem>
              )}
              {selectedQuest.reward.items && selectedQuest.reward.items.map(item => (
                <RewardItem key={item.id}>
                  <Icon name={item.icon || 'box'} color="#4CAF50" />
                  <RewardText>{item.quantity}x {item.name}</RewardText>
                </RewardItem>
              ))}
              {selectedQuest.reward.reputation && Object.entries(selectedQuest.reward.reputation).map(([faction, amount]) => (
                <RewardItem key={faction}>
                  <Icon name="people" color="#2196F3" />
                  <RewardText>{amount > 0 ? '+' : ''}{amount} Reputation with {faction}</RewardText>
                </RewardItem>
              ))}
            </RewardsList>
          </QuestSection>
        )}
        
        <QuestDetailActions>
          {activeTab === 'active' && (
            <>
              <ActionButton 
                onClick={() => handleTrackQuest(selectedQuest.id)}
                active={trackedQuestId === selectedQuest.id}
              >
                {trackedQuestId === selectedQuest.id ? 'Untrack Quest' : 'Track Quest'}
              </ActionButton>
              <ActionButton 
                danger
                onClick={() => handleAbandonQuest(selectedQuest.id)}
              >
                Abandon Quest
              </ActionButton>
              {selectedQuest.progress === 100 && (
                <ActionButton 
                  primary
                  onClick={() => handleCompleteQuest(selectedQuest.id)}
                >
                  Complete Quest
                </ActionButton>
              )}
            </>
          )}
          
          {activeTab === 'available' && (
            <ActionButton 
              primary
              onClick={() => handleAcceptQuest(selectedQuest.id)}
            >
              Accept Quest
            </ActionButton>
          )}
        </QuestDetailActions>
      </QuestDetailsPanel>
    );
  };

  return (
    <Container>
      <h1>Quests</h1>
      
      <TabsContainer>
        <Tabs activeTab={activeTab} onChange={setActiveTab}>
          <Tab id="active">Active ({activeQuests.length})</Tab>
          <Tab id="available">Available ({availableQuests.length})</Tab>
          <Tab id="completed">Completed ({completedQuests.length})</Tab>
        </Tabs>
      </TabsContainer>
      
      <ContentArea>
        {renderQuestsList()}
        {renderQuestDetails()}
      </ContentArea>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const TabsContainer = styled.div`
  margin-bottom: 20px;
`;

const ContentArea = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const QuestsListContainer = styled(Panel)`
  flex: 1;
  max-width: 400px;
  overflow: hidden;
`;

const QuestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 600px;
  overflow-y: auto;
  padding: 10px 0;
`;

const QuestCard = styled(Card)<{ selected?: boolean; difficulty?: string; completed?: boolean }>`
  padding: 15px;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
  border-color: ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  opacity: ${props => props.completed ? 0.7 : 1};
  
  &:hover {
    border-color: ${props => !props.selected ? props.theme.colors.border : props.theme.colors.primary};
  }
  
  ${props => props.difficulty === 'hard' && `
    border-left: 4px solid #F44336;
  `}
  
  ${props => props.difficulty === 'epic' && `
    border-left: 4px solid #9C27B0;
  `}
`;

const QuestTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
`;

const QuestProgress = styled.div`
  margin-bottom: 10px;
`;

const QuestLocation = styled.div`
  font-size: 14px;
  color: #aaa;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const QuestRequiredLevel = styled.div`
  font-size: 12px;
  color: #f44336;
  margin-top: 5px;
`;

const QuestCardButtons = styled.div`
  display: flex;
  gap: 5px;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const QuestButton = styled(Button)<{ active?: boolean }>`
  padding: 5px;
  min-width: 0;
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.backgroundAlt};
  }
`;

const QuestDetailsPanel = styled(Panel)`
  flex: 2;
`;

const QuestDetailHeader = styled.div<{ difficulty?: string }>`
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${props => {
    switch (props.difficulty) {
      case 'easy': return '#4CAF50';
      case 'normal': return '#2196F3';
      case 'hard': return '#F44336';
      case 'epic': return '#9C27B0';
      default: return props.theme.colors.border;
    }
  }};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QuestDetailTitle = styled.h2`
  margin: 0;
`;

const QuestTypeBadge = styled(Badge)`
  text-transform: capitalize;
`;

const QuestDifficulty = styled.div`
  margin-bottom: 15px;
  font-size: 14px;
`;

const DifficultyIndicator = styled.span<{ difficulty: string }>`
  text-transform: capitalize;
  font-weight: bold;
  color: ${props => {
    switch (props.difficulty) {
      case 'easy': return '#4CAF50';
      case 'normal': return '#2196F3';
      case 'hard': return '#F44336';
      case 'epic': return '#9C27B0';
      default: return 'inherit';
    }
  }};
`;

const QuestDescription = styled.p`
  line-height: 1.6;
  margin-bottom: 20px;
`;

const QuestSection = styled.div`
  margin-bottom: 20px;
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    padding-bottom: 5px;
  }
`;

const ObjectiveList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ObjectiveItem = styled.li<{ completed: boolean }>`
  display: flex;
  align-items: center;
  padding: 5px 0;
  opacity: ${props => props.completed ? 0.7 : 1};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const ObjectiveCheck = styled.div<{ completed: boolean }>`
  color: ${props => props.completed ? '#4CAF50' : '#aaa'};
  margin-right: 10px;
`;

const ObjectiveText = styled.div`
  flex: 1;
`;

const ObjectiveProgress = styled.div`
  font-size: 14px;
  color: #aaa;
`;

const RewardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RewardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RewardText = styled.div`
  font-size: 14px;
`;

const QuestDetailActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 30px;
  justify-content: flex-end;
`;

const ActionButton = styled(Button)<{ active?: boolean }>`
  background-color: ${props => props.active ? props.theme.colors.primary : ''};
`;

const QuestType = styled.div`
  margin-top: 5px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #aaa;
  font-style: italic;
`;

export default QuestsPage;
