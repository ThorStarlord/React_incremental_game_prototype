import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { TabId } from '../types/NavigationTypes';
import { EssencePage } from '../../pages/EssencePage';
import { SettingsPage } from '../../pages/SettingsPage';
import { CharacterPage } from '../../pages/CharacterPage';
import { TraitSystemWrapper } from '../../features/Traits';
import { NPCPanel } from '../../features/Npcs/components/containers/NPCPanel';
import { SaveLoadInterface } from '../../features/Meta';

// Styled components for consistent layout
const ContentContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const PageContainer = styled(Container)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  overflow: 'auto',
}));

const PlaceholderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.divider}`,
}));

/*

const DashboardPage: React.FC = () => (
  <PlaceholderPaper>
    <Typography variant="h4" gutterBottom>
      Dashboard
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Game overview, quick stats, and recent activity will be displayed here.
    </Typography>
  </PlaceholderPaper>
);

const TraitsPage: React.FC = () => (
  <PlaceholderPaper>
    <Typography variant="h4" gutterBottom>
      Traits System
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Trait management interface will be integrated here.
      This will connect to the existing TraitSystemWrapper component.
    </Typography>
  </PlaceholderPaper>
);

const NPCsPage: React.FC = () => (
  <PlaceholderPaper>
    <Typography variant="h4" gutterBottom>
      NPCs & Relationships
    </Typography>
    <Typography variant="body1" color="text.secondary">
      NPC interaction interface will be integrated here.
      This will connect to the existing NPCPanel and NPCListView components.
    </Typography>
  </PlaceholderPaper>
);

*/

// Placeholder page components for features not yet fully integrated
const DashboardPage: React.FC = () => (
  <PlaceholderPaper>
    <Typography variant="h4" gutterBottom>
      Dashboard
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Game overview, quick stats, and recent activity will be displayed here.
    </Typography>
  </PlaceholderPaper>
);

const CopiesPage: React.FC = () => (
  <PlaceholderPaper>
    <Typography variant="h4" gutterBottom>
      Copies Management
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Copy creation and management interface will be implemented here.
      This is a planned feature from the Copy System specification.
    </Typography>
  </PlaceholderPaper>
);

const QuestsPage: React.FC = () => (
  <PlaceholderPaper>
    <Typography variant="h4" gutterBottom>
      Quests & Objectives
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Quest log and objective tracking interface will be implemented here.
      This is a planned feature from the Quest System specification.
    </Typography>
  </PlaceholderPaper>
);

const InventoryPage: React.FC = () => (
  <PlaceholderPaper>
    <Typography variant="h4" gutterBottom>
      Inventory & Equipment
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Item management and equipment interface will be implemented here.
      This connects to the Player equipment system.
    </Typography>
  </PlaceholderPaper>
);

const DebugPage: React.FC = () => (
  <PlaceholderPaper>
    <Typography variant="h4" gutterBottom>
      Debug Tools
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Development tools and debug information will be displayed here.
      This includes game state inspection and testing utilities.
    </Typography>
  </PlaceholderPaper>
);

// Main content area props
interface MainContentAreaProps {
  activeTabId: TabId;
  className?: string;
}

/**
 * MainContentArea component renders the appropriate page content based on the active tab ID.
 * Uses a switch statement to determine which page component to display.
 * Provides consistent layout and styling for all page content.
 */
export const MainContentArea: React.FC<MainContentAreaProps> = React.memo(({
  activeTabId,
  className
}) => {
  // Render the appropriate page component based on active tab
  const renderPageContent = (): React.ReactNode => {
    switch (activeTabId) {
      case 'dashboard':
        return <DashboardPage />;
      
      case 'traits':
        return <TraitSystemWrapper />;
      
      case 'essence':
        return <EssencePage />;
      
      case 'npcs':
        return <NPCPanel />;
      
      case 'copies':
        return <CopiesPage />;
      
      case 'quests':
        return <QuestsPage />;
      
      case 'player':
        return <CharacterPage />;
      
      case 'inventory':
        return <InventoryPage />;
      
      case 'settings':
        return <SettingsPage />;
      
      case 'save-load':
        return <SaveLoadInterface />;
      
      case 'debug':
        return <DebugPage />;
      
      default:
        return (
          <PlaceholderPaper>
            <Typography variant="h4" gutterBottom color="error">
              Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The requested page "{activeTabId}" could not be found.
              Please select a valid navigation option.
            </Typography>
          </PlaceholderPaper>
        );
    }
  };

  return (
    <ContentContainer className={className}>
      <PageContainer maxWidth={false}>
        {renderPageContent()}
      </PageContainer>
    </ContentContainer>
  );
});

export default MainContentArea;
