import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameState } from '../context';
import styled from 'styled-components';
import { saveGame, getSavedGames, deleteSave } from '../utils/saveUtils';
import { Button, Card, Dialog, Heading, Icon } from '../components/ui';

interface SavedGame {
  id: string;
  name: string;
  timestamp: number;
  playerLevel: number;
  screenshot?: string;
  playtime?: number;
}

interface MainMenuProps {
  onStartGame: (saveId?: string) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [saves, setSaves] = useState<SavedGame[]>([]);
  const [showLoadDialog, setShowLoadDialog] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [selectedSave, setSelectedSave] = useState<string | null>(null);
  const { state, resetGame } = useGameState();
  
  useEffect(() => {
    // Load saved games when component mounts
    const loadSaves = async (): Promise<void> => {
      const savedGames = await getSavedGames();
      setSaves(savedGames);
    };
    
    loadSaves();
  }, []);
  
  const handleNewGame = (): void => {
    resetGame();
    onStartGame();
  };
  
  const handleLoadGame = async (saveId: string): Promise<void> => {
    setShowLoadDialog(false);
    onStartGame(saveId);
  };
  
  const handleDeleteSave = async (saveId: string): Promise<void> => {
    await deleteSave(saveId);
    setSaves(saves.filter(save => save.id !== saveId));
    setShowDeleteConfirm(false);
    setSelectedSave(null);
  };
  
  const handleContinue = (): void => {
    // Find most recent save
    if (saves.length > 0) {
      const mostRecent = saves.reduce((latest, save) => 
        save.timestamp > latest.timestamp ? save : latest
      );
      onStartGame(mostRecent.id);
    } else {
      // No saves, start new game
      handleNewGame();
    }
  };
  
  return (
    <MainMenuContainer>
      <MenuCard>
        <Logo>Incremental RPG</Logo>
        <MenuOptions>
          {saves.length > 0 && (
            <MenuButton onClick={handleContinue}>
              Continue Game
            </MenuButton>
          )}
          <MenuButton onClick={handleNewGame}>
            New Game
          </MenuButton>
          <MenuButton onClick={() => setShowLoadDialog(true)}>
            Load Game
          </MenuButton>
          <MenuButton as={Link} to="/settings">
            Settings
          </MenuButton>
          <MenuButton as="a" href="https://github.com/yourusername/incremental-rpg" target="_blank">
            GitHub
          </MenuButton>
        </MenuOptions>
        <Version>Version 0.1.0</Version>
      </MenuCard>
      
      {/* Load Game Dialog */}
      <Dialog 
        isOpen={showLoadDialog}
        onClose={() => setShowLoadDialog(false)}
        title="Load Game"
      >
        <SaveList>
          {saves.length === 0 && (
            <EmptyMessage>No saved games found</EmptyMessage>
          )}
          
          {saves.map(save => (
            <SaveItem key={save.id}>
              <SaveInfo>
                <SaveTitle>{save.name}</SaveTitle>
                <SaveDetails>
                  Level {save.playerLevel} • {new Date(save.timestamp).toLocaleDateString()}
                </SaveDetails>
                {save.playtime && (
                  <SavePlaytime>
                    Playtime: {Math.floor(save.playtime / 3600)}h {Math.floor((save.playtime % 3600) / 60)}m
                  </SavePlaytime>
                )}
              </SaveInfo>
              <SaveActions>
                <ActionButton onClick={() => handleLoadGame(save.id)}>
                  <Icon name="play" /> Load
                </ActionButton>
                <ActionButton 
                  danger
                  onClick={() => {
                    setSelectedSave(save.id);
                    setShowDeleteConfirm(true);
                  }}
                >
                  <Icon name="trash" /> Delete
                </ActionButton>
              </SaveActions>
            </SaveItem>
          ))}
        </SaveList>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete this saved game? This cannot be undone.</p>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button danger onClick={() => selectedSave && handleDeleteSave(selectedSave)}>Delete</Button>
        </DialogActions>
      </Dialog>
    </MainMenuContainer>
  );
};

// Styled components
const MainMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: url('/assets/background/menu-bg.jpg') no-repeat center center;
  background-size: cover;
  padding: 20px;
`;

const MenuCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: rgba(0, 0, 0, 0.8);
`;

const Logo = styled(Heading)`
  font-size: 2.5rem;
  margin-bottom: 40px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const MenuOptions = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MenuButton = styled(Button)`
  margin-bottom: 15px;
  padding: 12px;
  font-size: 18px;
`;

const Version = styled.div`
  margin-top: 20px;
  font-size: 12px;
  opacity: 0.7;
`;

const SaveList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px 0;
`;

const SaveItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 5px;
  background-color: #2a2a2a;
  
  &:hover {
    background-color: #333;
  }
`;

const SaveInfo = styled.div`
  flex: 1;
`;

const SaveTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const SaveDetails = styled.div`
  font-size: 14px;
  opacity: 0.7;
  margin-top: 5px;
`;

const SavePlaytime = styled.div`
  font-size: 12px;
  opacity: 0.5;
`;

const SaveActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled(Button)`
  padding: 8px 12px;
  font-size: 14px;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  opacity: 0.7;
`;

export default MainMenu;
