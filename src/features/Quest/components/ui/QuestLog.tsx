import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { Quest } from '../../state/QuestTypes';

interface QuestLogProps {
  quests: Quest[];
}

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
                    <li key={objective.id}>
                      {objective.description} {objective.type === 'GATHER' && `(${objective.progress}/${objective.targetValue})`}
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
