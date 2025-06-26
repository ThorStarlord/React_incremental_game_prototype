import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  LinearProgress,
} from '@mui/material';
import { ContentCopy as CopiesIcon, Person as PersonIcon, Loyalty as LoyaltyIcon } from '@mui/icons-material';
import { useAppSelector } from '../app/hooks';
import { selectAllCopies } from '../features/Copy/state/CopySelectors';
import { Copy } from '../features/Copy/state/CopyTypes';

const CopyStat: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 0.5 }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

/**
 * CopiesPage component.
 * 
 * This page serves as the main UI for the Copy System, allowing players
 * to view, manage, and interact with their created Copies.
 */
export const CopiesPage: React.FC = React.memo(() => {
  const copies = useAppSelector(selectAllCopies);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <CopiesIcon color="primary" sx={{ fontSize: '2.5rem' }} />
        <Box>
          <Typography variant="h4" component="h1">
            Copy Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage your created Copies. Assign tasks and develop their abilities.
          </Typography>
        </Box>
      </Box>

      {copies.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>No Copies Created</AlertTitle>
          You have not created any Copies yet. Explore the world and build deep connections to unlock this potential.
        </Alert>
      ) : (
        <Paper sx={{ p: 2 }}>
          <List disablePadding>
            {copies.map((copy, index) => (
              <React.Fragment key={copy.id}>
                <ListItem sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start', gap: 2, py: 2 }}>
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <Typography variant="h6" component="div">{copy.name}</Typography>
                    <Typography variant="caption" color="text.secondary">ID: {copy.id}</Typography>
                    {copy.currentTask && <Chip label={`Task: ${copy.currentTask}`} size="small" sx={{ mt: 1 }}/>}
                  </Box>
                  <Box sx={{ flex: 2, width: '100%' }}>
                    <CopyStat label="Maturity" value={`${copy.maturity}%`} />
                    <LinearProgress variant="determinate" value={copy.maturity} sx={{ mb: 1 }} />
                    <CopyStat label="Loyalty" value={`${copy.loyalty}%`} />
                    <LinearProgress variant="determinate" value={copy.loyalty} color="secondary" sx={{ mb: 2 }} />
                    <CopyStat label="Location" value={copy.location} />
                    <CopyStat label="Parent NPC" value={copy.parentNPCId} />
                  </Box>
                </ListItem>
                {index < copies.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

    </Container>
  );
});

CopiesPage.displayName = 'CopiesPage';

export default CopiesPage;