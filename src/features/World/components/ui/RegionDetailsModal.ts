import React from 'react';
import { Modal, Box, Typography, Button, Paper } from '@mui/material';
import { regions, towns } from '../modules/data';

const RegionDetailsModal = ({ open, onClose, regionId, onTownSelect }) => {
  const region = regions.find((r) => r.id === regionId);
  const regionTowns = towns.filter((t) => t.regionId === regionId);

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      aria-labelledby="region-details-title"
    >
      <Paper sx={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        p: 4,
        bgcolor: 'background.paper',
        borderRadius: 2,
        maxWidth: 400,
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <Typography variant="h5" id="region-details-title" gutterBottom>
          {region?.name}
        </Typography>
        
        <Typography sx={{ mt: 2, mb: 3 }}>
          {region?.description}
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          Towns:
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {regionTowns.map((town) => (
            <Button
              key={town.id}
              onClick={() => {
                onTownSelect(town.id);
                onClose();
              }}
              variant="outlined"
              fullWidth
            >
              {town.name}
            </Button>
          ))}
        </Box>
        
        <Button 
          onClick={onClose} 
          sx={{ mt: 3 }}
          variant="contained"
          fullWidth
        >
          Close
        </Button>
      </Paper>
    </Modal>
  );
};

export default RegionDetailsModal;