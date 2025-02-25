import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BreadcrumbNav from './BreadcrumbNav';
import NPCPanel from './NPCPanel';

const NPCEncounter = ({ npcId }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2 }}>
      <BreadcrumbNav />
      <Box sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} size="large">
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <NPCPanel npcId={npcId} />
    </Box>
  );
};

export default NPCEncounter;