import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AboutDialogProps {
  isOpen: boolean;
  version: string;
  onClose: () => void;
}

/**
 * AboutDialog Component
 * 
 * Displays information about the game including version and credits.
 * 
 * @param {boolean} isOpen - Whether the dialog is visible
 * @param {string} version - Current version of the application
 * @param {Function} onClose - Handler for closing the dialog
 * @returns {JSX.Element | null} The rendered component or null if not open
 */
export function AboutDialog({ isOpen, version, onClose }: AboutDialogProps) {
  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="about-dialog-title"
    >
      <DialogTitle id="about-dialog-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">About Incremental RPG</Typography>
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
        <Box textAlign="center" mb={2}>
          <Typography variant="h5" gutterBottom>
            Incremental RPG
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Version {version}
          </Typography>
        </Box>

        <Typography paragraph>
          Incremental RPG is a game that combines classic RPG elements with incremental game mechanics.
          Develop your character, build relationships with NPCs, and explore a rich fantasy world.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Credits
        </Typography>
        <List dense sx={{ mb: 2 }}>
          <ListItem>
            <ListItemText primary="Game Design & Development: Game Developer Team" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Art Assets: Various Artists" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Music & Sound: Audio Creator Team" />
          </ListItem>
        </List>

        <Typography variant="h6" gutterBottom>
          Special Thanks
        </Typography>
        <Typography paragraph color="textSecondary">
          To all players who provided feedback and suggestions during development.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box textAlign="center">
          <Typography variant="caption" color="textSecondary">
            © 2023 Incremental RPG Development Team. All rights reserved.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
