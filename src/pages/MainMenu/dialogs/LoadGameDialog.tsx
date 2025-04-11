import React from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { SavedGame } from '../../../hooks/useSavedGames';

interface LoadGameDialogProps {
  isOpen: boolean;
  savedGames: SavedGame[];
  isLoading: boolean;
  onLoad: (saveId: string) => void;
  onDelete: (saveId: string) => void;
  onClose: () => void;
}

/**
 * LoadGameDialog Component
 * 
 * Displays a modal dialog with a list of saved games that can be loaded.
 * Also provides the option to delete saved games.
 * 
 * @param {boolean} isOpen - Whether the dialog is visible
 * @param {SavedGame[]} savedGames - Array of saved game data
 * @param {boolean} isLoading - Whether loading action is in progress
 * @param {Function} onLoad - Handler for loading a game
 * @param {Function} onDelete - Handler for deleting a game
 * @param {Function} onClose - Handler for closing the dialog
 */
export function LoadGameDialog({
  isOpen,
  savedGames,
  isLoading,
  onLoad,
  onDelete,
  onClose
}: LoadGameDialogProps) {
  const theme = useTheme();

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="load-game-dialog-title"
    >
      <DialogTitle id="load-game-dialog-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Load Saved Game</Typography>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={onClose} 
            aria-label="close"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
          </Box>
        ) : savedGames.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="textSecondary">
              No saved games found.
            </Typography>
          </Box>
        ) : (
          <List>
            {savedGames.map((game, index) => (
              <React.Fragment key={game.id}>
                {index > 0 && <Divider variant="fullWidth" />}
                <ListItem sx={{ p: 0 }}>
                  <ListItemButton
                    onClick={() => onLoad(game.id)}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      py: 2,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" component="span" fontWeight="medium">
                          {game.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(game.timestamp)}
                          </Typography>
                          {/* Display character level if it exists in the data property */}
                          {game.data?.characterLevel && (
                            <Typography variant="body2" color="textSecondary">
                              Level {game.data.characterLevel}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => onDelete(game.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
