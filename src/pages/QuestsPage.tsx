import React from 'react';
import { Container, Typography, Card, CardContent } from '@mui/material';
import { useAppSelector } from '../app/hooks';
import { selectActiveQuests } from '../features/Quest/state/QuestSelectors';
import QuestLog from '../features/Quest/components/ui/QuestLog';

const QuestsPage: React.FC = () => {
  const activeQuests = useAppSelector(selectActiveQuests);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quests
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Active Quests</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You have {activeQuests.length} active quest(s).
          </Typography>
          <QuestLog quests={activeQuests} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default QuestsPage;
