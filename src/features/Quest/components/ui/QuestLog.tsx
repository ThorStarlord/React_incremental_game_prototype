import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { Quest, QuestObjective } from '../../state/QuestTypes';

interface QuestLogProps {
  quests: Quest[];
}

const renderObjective = (objective: QuestObjective) => {
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
    default:
      return <span style={baseStyle}>{objective.description}</span>;
  }
};

const QuestLog: React.FC<QuestLogProps> = ({ quests }) => {
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
                      {renderObjective(objective)}
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
