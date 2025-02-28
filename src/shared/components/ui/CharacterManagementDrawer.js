import React, { useState, useContext, useEffect } from 'react';
import { 
  Drawer, 
  Tabs, 
  Tab, 
  Box, 
  Badge, 
  IconButton,
  Divider,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PersonIcon from '@mui/icons-material/Person';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import IntegratedTraitsPanel from '../../../features/Traits/components/containers/IntegratedTraitsPanel';
import NPCPanel from './npcs/NPCPanel';
import CharactersPanel from '../../../features/Minions/components/ui/CharactersPanel';
import { GameStateContext } from '../../../context/GameStateContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`drawer-tabpanel-${index}`}
      aria-labelledby={`drawer-tab-${index}`}
      style={{ height: '100%', overflow: 'auto' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ height: '100%', p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CharacterManagementDrawer = ({ open, onClose, initialTab = 0 }) => {
  const [tabValue, setTabValue] = useState(initialTab);
  const { player, discoveryProgress } = useContext(GameStateContext);
  
  // Update tab value when initialTab prop changes
  useEffect(() => {
    setTabValue(initialTab);
  }, [initialTab]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Get counts for badges
  const controlledCharacterCount = player?.controlledCharacters?.length || 0;
  const metNPCCount = discoveryProgress?.metNPCCount || 0;
  const traitCount = player?.acquiredTraits?.length || 0;
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: '450px' }, maxWidth: '100%' }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%' 
      }}>
        {/* Header with close button */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="h6">
            {tabValue === 0 ? 'Characters' : 
             tabValue === 1 ? 'NPCs' : 'Traits'}
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Tabs */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={
              <Badge 
                badgeContent={controlledCharacterCount} 
                color="success" 
                max={99}
                showZero={false}
              >
                <SportsKabaddiIcon />
              </Badge>
            } 
            label="Characters" 
          />
          <Tab 
            icon={
              <Badge 
                badgeContent={metNPCCount} 
                color="primary" 
                max={99}
                showZero={false}
              >
                <PersonIcon />
              </Badge>
            } 
            label="NPCs" 
          />
          <Tab 
            icon={
              <Badge 
                badgeContent={traitCount} 
                color="secondary" 
                max={99}
                showZero={false}
              >
                <AutoFixHighIcon />
              </Badge>
            } 
            label="Traits" 
          />
        </Tabs>
        
        {/* Tab panels - with flexGrow to take remaining height */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <TabPanel value={tabValue} index={0}>
            <CharactersPanel />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <NPCPanel />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <IntegratedTraitsPanel />
          </TabPanel>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CharacterManagementDrawer;