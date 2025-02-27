import React from 'react';
import { Box, Tooltip, IconButton, Paper } from '@mui/material';
import { styled } from '@mui/system';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import PersonIcon from '@mui/icons-material/Person';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const TabBarContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  boxShadow: theme.shadows[3],
  zIndex: 1000,
}));

const TabBarButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0.5, 0),
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const CharacterTabBar = ({ onOpenDrawer }) => {
  return (
    <TabBarContainer elevation={3}>
      <Tooltip title="Characters" placement="left" arrow>
        <TabBarButton onClick={() => onOpenDrawer(0)}>
          <SportsKabaddiIcon />
        </TabBarButton>
      </Tooltip>
      
      <Tooltip title="NPCs" placement="left" arrow>
        <TabBarButton onClick={() => onOpenDrawer(1)}>
          <PersonIcon />
        </TabBarButton>
      </Tooltip>
      
      <Tooltip title="Traits" placement="left" arrow>
        <TabBarButton onClick={() => onOpenDrawer(2)}>
          <AutoFixHighIcon />
        </TabBarButton>
      </Tooltip>
    </TabBarContainer>
  );
};

export default CharacterTabBar;