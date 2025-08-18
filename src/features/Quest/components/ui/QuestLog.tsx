import React from 'react';
import { Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Quest, QuestObjective } from '../../state/QuestTypes';

interface QuestLogProps {
  quests: Quest[];
  onSolvePuzzle: (questId: string, objectiveId: string) => void;
}

const QuestLog: React.FC<QuestLogProps> = ({ quests, onSolvePuzzle }) => {
  const renderObjective = (quest: Quest, objective: QuestObjective) => {
    const baseStyle = {
      textDecoration: objective.isComplete ? 'line-through' : 'none',
    };

    switch (objective.type) {
      case 'GATHER':
      case 'KILL':
        return (
          <span style={baseStyle}>
            {objective.description} ({objective.currentCount}/{objective.requiredCount})
          </span>
        );
      case 'REACH_LOCATION':
        return <span style={baseStyle}>{objective.description}</span>;
      case 'INTERACT_PUZZLE':
        return (
          <>
            <span style={baseStyle}>{objective.description}</span>
            {!objective.isComplete && (
              <Button onClick={() => onSolvePuzzle(quest.id, objective.objectiveId)}>Solve Puzzle</Button>
            )}
          </>
        );
      default:
        return <span style={baseStyle}>{objective.description}</span>;
    }
  };

  if (quests.length === 0) {
    return <Typography>No active quests.</Typography>;
  }

  return (
    <List>
      {quests.map((quest) => (
        <ListItem key={quest.id} alignItems="flex-start">
          <ListItemText
            primary={quest.title}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {quest.description}
                </Typography>
                <ul>
                  {quest.objectives.map((objective) => (
                    <li key={objective.objectiveId}>
                      {renderObjective(quest, objective)}
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default QuestLog;
