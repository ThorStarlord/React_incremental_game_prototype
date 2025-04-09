import React, { useState, useEffect } from 'react';
import { useGameState } from '../context';
import { MINION_ACTION_TYPES } from '../context/actions/minionsActions';
import useMinionSimulation from '../shared/hooks/useMinionSimulation';
import {
  Panel,
  Button,
  Card,
  ProgressBar,
  Tabs,
  Tab,
  ResourceIcon,
  IconButton
} from '../components/ui';
import styled from 'styled-components';

interface Minion {
  id: string;
  name: string;
  level: number;
  experience: number;
  assigned: string | null;
  status: string;
  type?: string;
  appearance?: Record<string, string>;
  stats: {
    strength: number;
    speed: number;
    efficiency: number;
    [key: string]: number;
  };
  collectInterval?: number;
}

interface MinionAssignment {
  id: string;
  name: string;
  resourceType: string;
  difficulty: number;
  targetArea: string;
}

interface MinionUpgradeCost {
  gold: number;
  resources?: Array<{
    id: string;
    quantity: number;
  }>;
}

const MINION_TYPES = [
  'gatherer',
  'miner',
  'hunter',
  'farmer'
];

const ASSIGNMENTS: MinionAssignment[] = [
  { id: 'wood_gathering', name: 'Gather Wood', resourceType: 'wood', difficulty: 1, targetArea: 'forest' },
  { id: 'stone_mining', name: 'Mine Stone', resourceType: 'stone', difficulty: 2, targetArea: 'mountains' },
  { id: 'herb_gathering', name: 'Collect Herbs', resourceType: 'herbs', difficulty: 1, targetArea: 'forest' },
  { id: 'ore_mining', name: 'Mine Ore', resourceType: 'ore', difficulty: 3, targetArea: 'mountains' },
  { id: 'hunting', name: 'Hunt', resourceType: 'meat', difficulty: 2, targetArea: 'forest' }
];

const calculateUpgradeCost = (minion: Minion, stat: string): MinionUpgradeCost => {
  const currentLevel = minion.stats[stat] || 1;
  const baseCost = Math.pow(currentLevel, 1.5) * 50;
  
  return {
    gold: Math.floor(baseCost),
    resources: [
      { id: 'essence', quantity: Math.floor(currentLevel * 5) }
    ]
  };
};

const MinionsPage: React.FC = () => {
  const { state, dispatch } = useGameState();
  const [activeTab, setActiveTab] = useState<string>('minions');
  const [selectedMinion, setSelectedMinion] = useState<string | null>(null);
  
  // Use the minion simulation hook
  useMinionSimulation();
  
  const minions = state.minions || [];
  const resources = state.resources || {};
  
  const handleHireMinion = (): void => {
    const minionType = MINION_TYPES[Math.floor(Math.random() * MINION_TYPES.length)];
    const names = ['Bob', 'Alice', 'Charlie', 'Diana', 'Edward', 'Fiona'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    const newMinion: Minion = {
      name: randomName,
      type: minionType,
      stats: {
        strength: 1,
        speed: 1,
        efficiency: 1
      },
      collectInterval: 300000, // 5 minutes default
      appearance: {
        hairColor: ['brown', 'black', 'blonde', 'red'][Math.floor(Math.random() * 4)],
        skinTone: ['light', 'medium', 'dark'][Math.floor(Math.random() * 3)]
      }
    } as Minion; // ID will be added by the reducer
    
    dispatch({
      type: MINION_ACTION_TYPES.HIRE_MINION,
      payload: newMinion
    });
  };
  
  const handleAssignMinion = (minionId: string, taskId: string): void => {
    dispatch({
      type: MINION_ACTION_TYPES.ASSIGN_MINION,
      payload: { minionId, taskId }
    });
  };
  
  const handleUnassignMinion = (minionId: string): void => {
    dispatch({
      type: MINION_ACTION_TYPES.UNASSIGN_MINION,
      payload: { minionId }
    });
  };
  
  const handleUpgradeMinion = (minionId: string, stat: string): void => {
    const minion = minions.find(m => m.id === minionId);
    if (!minion) return;
    
    const upgradeCost = calculateUpgradeCost(minion, stat);
    
    if (resources.gold < upgradeCost.gold) {
      // Not enough gold
      return;
    }
    
    // Deduct resources
    dispatch({
      type: 'resources/add',
      payload: { gold: -upgradeCost.gold }
    });
    
    // Upgrade minion stat
    dispatch({
      type: MINION_ACTION_TYPES.UPGRADE_MINION,
      payload: {
        minionId,
        upgrades: { [stat]: minion.stats[stat] + 1 }
      }
    });
  };
  
  const handleDismissMinion = (minionId: string): void => {
    dispatch({
      type: MINION_ACTION_TYPES.DISMISS_MINION,
      payload: { minionId }
    });
    
    if (selectedMinion === minionId) {
      setSelectedMinion(null);
    }
  };
  
  const handleCollectResources = (): void => {
    dispatch({
      type: MINION_ACTION_TYPES.COLLECT_MINION_RESOURCES
    });
  };
  
  const getMinionEfficiency = (minion: Minion): number => {
    if (!minion.assigned) return 0;
    
    const task = ASSIGNMENTS.find(a => a.id === minion.assigned);
    if (!task) return 0;
    
    let efficiency = minion.stats.efficiency;
    
    // Adjust efficiency based on minion type and task
    if (minion.type === 'gatherer' && ['wood_gathering', 'herb_gathering'].includes(task.id)) {
      efficiency *= 1.5;
    } else if (minion.type === 'miner' && ['stone_mining', 'ore_mining'].includes(task.id)) {
      efficiency *= 1.5;
    } else if (minion.type === 'hunter' && task.id === 'hunting') {
      efficiency *= 1.5;
    }
    
    return efficiency;
  };
  
  const renderMinionsList = (): JSX.Element => (
    <MinionsContainer>
      <HeaderSection>
        <h2>Your Minions ({minions.length})</h2>
        <Button onClick={handleHireMinion}>Hire New Minion</Button>
        <Button onClick={handleCollectResources}>Collect Resources</Button>
      </HeaderSection>
      
      {minions.length === 0 ? (
        <EmptyState>
          <p>You don't have any minions yet. Hire your first one!</p>
        </EmptyState>
      ) : (
        <MinionsGrid>
          {minions.map(minion => (
            <MinionCard 
              key={minion.id}
              isSelected={selectedMinion === minion.id}
              onClick={() => setSelectedMinion(minion.id)}
            >
              <MinionAvatar type={minion.type || 'gatherer'} />
              <MinionInfo>
                <MinionName>{minion.name} <MinionLevel>Lvl {minion.level}</MinionLevel></MinionName>
                <MinionType>{minion.type}</MinionType>
                <MinionStatus>
                  {minion.status === 'working' ? (
                    <>
                      <StatusDot status="working" /> 
                      Working on {ASSIGNMENTS.find(a => a.id === minion.assigned)?.name}
                    </>
                  ) : (
                    <>
                      <StatusDot status="idle" /> Idle
                    </>
                  )}
                </MinionStatus>
              </MinionInfo>
              {minion.assigned && (
                <UnassignButton onClick={(e) => {
                  e.stopPropagation();
                  handleUnassignMinion(minion.id);
                }}>
                  Unassign
                </UnassignButton>
              )}
            </MinionCard>
          ))}
        </MinionsGrid>
      )}
    </MinionsContainer>
  );
  
  const renderMinionDetails = (): JSX.Element | null => {
    const minion = minions.find(m => m.id === selectedMinion);
    if (!minion) return null;
    
    return (
      <DetailPanel>
        <DetailHeader>
          <h2>{minion.name}</h2>
          <IconButton 
            icon="trash" 
            variant="danger" 
            onClick={() => handleDismissMinion(minion.id)}
          >
            Dismiss
          </IconButton>
        </DetailHeader>
        
        <DetailSection>
          <h3>Stats</h3>
          <StatGrid>
            <Stat>
              <StatLabel>Strength</StatLabel>
              <StatValue>{minion.stats.strength}</StatValue>
              <Button small onClick={() => handleUpgradeMinion(minion.id, 'strength')}>
                Upgrade ({calculateUpgradeCost(minion, 'strength').gold} gold)
              </Button>
            </Stat>
            <Stat>
              <StatLabel>Speed</StatLabel>
              <StatValue>{minion.stats.speed}</StatValue>
              <Button small onClick={() => handleUpgradeMinion(minion.id, 'speed')}>
                Upgrade ({calculateUpgradeCost(minion, 'speed').gold} gold)
              </Button>
            </Stat>
            <Stat>
              <StatLabel>Efficiency</StatLabel>
              <StatValue>{minion.stats.efficiency}</StatValue>
              <Button small onClick={() => handleUpgradeMinion(minion.id, 'efficiency')}>
                Upgrade ({calculateUpgradeCost(minion, 'efficiency').gold} gold)
              </Button>
            </Stat>
          </StatGrid>
        </DetailSection>
        
        <DetailSection>
          <h3>Assign Task</h3>
          <TaskGrid>
            {ASSIGNMENTS.map(task => (
              <TaskCard 
                key={task.id}
                isActive={minion.assigned === task.id}
                onClick={() => handleAssignMinion(minion.id, task.id)}
              >
                <ResourceIcon type={task.resourceType} />
                <TaskName>{task.name}</TaskName>
                <TaskLocation>{task.targetArea}</TaskLocation>
                <EfficiencyBar>
                  <ProgressBar 
                    value={getMinionEfficiency(minion) / (task.difficulty * 2)}
                    max={10} 
                    label="Efficiency"
                  />
                </EfficiencyBar>
              </TaskCard>
            ))}
          </TaskGrid>
        </DetailSection>
      </DetailPanel>
    );
  };
  
  return (
    <Container>
      <h1>Minions Management</h1>
      
      <TabsContainer>
        <Tabs activeTab={activeTab} onChange={setActiveTab}>
          <Tab id="minions">Minions</Tab>
          <Tab id="tasks">Tasks</Tab>
          <Tab id="upgrades">Upgrades</Tab>
        </Tabs>
      </TabsContainer>
      
      <ContentArea>
        {activeTab === 'minions' && renderMinionsList()}
        {selectedMinion && renderMinionDetails()}
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

const MinionsContainer = styled(Panel)`
  flex: 2;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const MinionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
`;

const MinionCard = styled(Card)<{ isSelected: boolean }>`
  display: flex;
  padding: 15px;
  cursor: pointer;
  border: 2px solid ${props => props.isSelected ? props.theme.colors.primary : 'transparent'};
  
  &:hover {
    background-color: ${props => props.theme.colors.backgroundAlt};
  }
`;

const MinionAvatar = styled.div<{ type: string }>`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${props => {
    switch(props.type) {
      case 'gatherer': return '#4CAF50';
      case 'miner': return '#607D8B';
      case 'hunter': return '#FF5722';
      case 'farmer': return '#8BC34A';
      default: return '#9E9E9E';
    }
  }};
  margin-right: 15px;
`;

const MinionInfo = styled.div`
  flex: 1;
`;

const MinionName = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const MinionLevel = styled.span`
  font-size: 0.8em;
  background-color: #37474F;
  color: white;
  padding: 2px 5px;
  border-radius: 10px;
  margin-left: 5px;
`;

const MinionType = styled.div`
  font-size: 0.8rem;
  color: #aaa;
  text-transform: capitalize;
`;

const MinionStatus = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  margin-top: 5px;
`;

const StatusDot = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.status === 'working' ? '#4CAF50' : '#FFC107'};
  margin-right: 5px;
`;

const UnassignButton = styled.button`
  background: none;
  border: none;
  color: #F44336;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DetailPanel = styled(Panel)`
  flex: 1;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DetailSection = styled.div`
  margin-bottom: 20px;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
`;

const Stat = styled(Card)`
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #aaa;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 10px 0;
`;

const TaskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
`;

const TaskCard = styled(Card)<{ isActive: boolean }>`
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border: 2px solid ${props => props.isActive ? props.theme.colors.primary : 'transparent'};
  
  &:hover {
    background-color: ${props => props.theme.colors.backgroundAlt};
  }
`;

const TaskName = styled.div`
  font-weight: bold;
  margin: 10px 0 5px;
`;

const TaskLocation = styled.div`
  font-size: 0.8rem;
  color: #aaa;
  margin-bottom: 10px;
`;

const EfficiencyBar = styled.div`
  width: 100%;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #aaa;
`;

export default MinionsPage;
