import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography
} from '@mui/material';
import { 
  RestartAlt, 
  FileDownload, 
  FileUpload, 
  Settings 
} from '@mui/icons-material';

/**
 * Props for SettingsActions component
 */
interface SettingsActionsProps {
  onReset: () => void;
  onExport: () => void;
  onImport: () => void;
}

/**
 * SettingsActions - Interface for settings management actions
 * 
 * Features:
 * - Reset to defaults with confirmation
 * - Export settings functionality
 * - Import settings functionality
 * - Confirmation dialogs for destructive actions
 */
export const SettingsActions: React.FC<SettingsActionsProps> = ({
  onReset,
  onExport,
  onImport
}) => {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleResetClick = () => {
    setResetDialogOpen(true);
  };

  const handleResetConfirm = () => {
    onReset();
    setResetDialogOpen(false);
  };

  const handleResetCancel = () => {
    setResetDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader
          avatar={<Settings color="primary" />}
          title="Settings Management"
          subheader="Manage your settings configuration"
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Use these actions to manage your settings configuration:
            </Typography>

            {/* Reset Settings */}
            <Button
              variant="outlined"
              color="warning"
              startIcon={<RestartAlt />}
              onClick={handleResetClick}
              fullWidth
            >
              Reset to Defaults
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Export Settings */}
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={onExport}
                fullWidth
              >
                Export Settings
              </Button>

              {/* Import Settings */}
              <Button
                variant="outlined"
                startIcon={<FileUpload />}
                onClick={onImport}
                fullWidth
              >
                Import Settings
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={handleResetCancel}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title">
          Reset Settings to Defaults?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description">
            This action will reset all settings to their default values. 
            Your current configuration will be lost. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleResetConfirm} color="warning" variant="contained">
            Reset Settings
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsActions;
