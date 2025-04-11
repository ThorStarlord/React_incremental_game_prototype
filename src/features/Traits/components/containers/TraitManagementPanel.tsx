import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
  Divider,
  Badge,
  Alert,
  Paper,
  Stack,
  CircularProgress
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import InfoIcon from '@mui/icons-material/Info';
import Panel from '../../../../shared/components/layout/Panel';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import {
  selectTraits,
  equipTrait,
  unequipTrait,
  selectTraitLoading,
  selectTraitError
} from '../../state/TraitsSlice';
import {
  selectEquippedTraitObjects,
  selectPermanentTraitObjects,
  selectAvailableTraitObjects
} from '../../state/TraitsSelectors';
import { selectPlayerTraitSlots } from '../../../Player/state/PlayerSelectors';
import { Trait } from '../../state/TraitsTypes';

/**
 * Props for the IntegratedTraitsPanel component
 */
interface IntegratedTraitsPanelProps {
  /** Function to close the panel */
  onClose: () => void;
}

/**
 * Props for the TraitItem component
 */
interface TraitItemProps {
  trait: Trait;
  isEquipped?: boolean;
  isPermanent?: boolean;
}

/**
 * IntegratedTraitsPanel - Comprehensive panel for managing character traits
 * 
 * Allows players to view, equip, and manage their character traits in a single interface.
 * Provides information about trait effects and requirements.
 */
const IntegratedTraitsPanel: React.FC<IntegratedTraitsPanelProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedTrait, setSelectedTrait] = useState<Trait | null>(null);

  // Select state including loading and error
  const allTraitsData = useAppSelector(selectTraits);
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);
  const totalSlots = useAppSelector(selectPlayerTraitSlots);

  // Use selectors that return full trait objects
  const equippedTraits = useAppSelector(selectEquippedTraitObjects);
  const permanentTraits = useAppSelector(selectPermanentTraitObjects);
  const availableTraits = useAppSelector(selectAvailableTraitObjects);

  const usedSlots = equippedTraits.length;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue);
    setSelectedTrait(null);
  };

  const TraitItem: React.FC<TraitItemProps> = ({ trait, isEquipped = false, isPermanent = false }) => (
    <Paper 
      elevation={1}
      sx={{ 
        p: 2, 
        cursor: 'pointer',
        border: selectedTrait?.id === trait.id ? '2px solid' : '1px solid',
        borderColor: selectedTrait?.id === trait.id ? 'primary.main' : 'divider',
        bgcolor: isPermanent ? 'rgba(76, 175, 80, 0.08)' : 'background.paper'
      }}
      onClick={() => setSelectedTrait(trait)}
    >
      <Typography variant="subtitle1" fontWeight="medium">{trait.name}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {trait.description?.substring(0, 60)}
        {trait.description?.length > 60 ? '...' : ''}
      </Typography>
      
      {isEquipped && (
        <Chip 
          label="Equipped" 
          color="primary" 
          size="small"
          sx={{ mr: 1 }} 
        />
      )}
      {isPermanent && (
        <Chip 
          label="Permanent" 
          color="success" 
          size="small" 
        />
      )}
    </Paper>
  );

  // --- Render Logic ---

  // Handle Loading State
  if (isLoading) {
    return (
      <Panel title={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AutoFixHighIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Character Traits</Typography>
        </Box>
      }>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, minHeight: '150px' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }} color="text.secondary">Loading Traits...</Typography>
        </Box>
      </Panel>
    );
  }

  // Handle Error State
  if (error) {
     return (
      <Panel title={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AutoFixHighIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Character Traits</Typography>
        </Box>
      }>
        <Alert severity="error" sx={{ m: 1 }}>
           Failed to load trait data: {error}
        </Alert>
      </Panel>
    );
  }

  // Handle Case Where Data Might Be Empty After Loading (optional but good)
  if (!isLoading && !error && Object.keys(allTraitsData).length === 0) {
     return (
      <Panel title={
         <Box sx={{ display: 'flex', alignItems: 'center' }}>
           <AutoFixHighIcon sx={{ mr: 1 }} />
           <Typography variant="h6">Character Traits</Typography>
         </Box>
      }>
        <Alert severity="warning" sx={{ m: 1 }}>No trait definitions loaded.</Alert>
      </Panel>
    );
  }

  return (
    <Panel 
      title={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AutoFixHighIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Character Traits</Typography>
          <Chip 
            size="small"
            label={`${usedSlots}/${totalSlots}`}
            color="primary"
            sx={{ ml: 2 }}
          />
        </Box>
      }
    >
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="Equipped" />
        <Tab label={
          <Badge badgeContent={availableTraits.length} color="secondary">
            Available
          </Badge>
        } />
      </Tabs>
      
      <Box role="tabpanel" hidden={activeTab !== 0}>
        {activeTab === 0 && (
          <>
            {equippedTraits.length > 0 ? (
              <Grid container spacing={2}>
                {equippedTraits.map(trait => (
                  <Grid item xs={12} sm={6} md={4} key={trait.id}>
                    <TraitItem trait={trait} isEquipped={true} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                You don't have any traits equipped. Equip traits to gain special abilities and bonuses.
              </Alert>
            )}
            
            {permanentTraits.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Permanent Traits" />
                </Divider>
                
                <Grid container spacing={2}>
                  {permanentTraits.map(trait => (
                    <Grid item xs={12} sm={6} md={4} key={trait.id}>
                      <TraitItem trait={trait} isPermanent={true} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </>
        )}
      </Box>
      
      <Box role="tabpanel" hidden={activeTab !== 1}>
        {activeTab === 1 && (
          <>
            {availableTraits.length > 0 ? (
              <Grid container spacing={2}>
                {availableTraits.map(trait => (
                  <Grid item xs={12} sm={6} md={4} key={trait.id}>
                    <TraitItem trait={trait} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                You don't have any additional traits to equip. Discover more traits through gameplay.
              </Alert>
            )}
          </>
        )}
      </Box>
      
      {selectedTrait && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon sx={{ mr: 1, color: 'info.main' }} />
            <Typography variant="h6">{selectedTrait.name} Details</Typography>
          </Box>
          <Typography variant="body1" gutterBottom>{selectedTrait.description}</Typography>
          
          {selectedTrait.effects && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Effects:</Typography>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {Object.entries(selectedTrait.effects).map(([key, value], index) => (
                  <li key={index}>
                    <Typography variant="body2">
                      {key}: {typeof value === 'number' ? (value > 0 ? '+' : '') + value : value}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}
          
          {selectedTrait.requirements && Object.keys(selectedTrait.requirements).length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="warning.main" gutterBottom>Requirements:</Typography>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {Object.entries(selectedTrait.requirements).map(([key, value], index) => (
                  <li key={index}>
                    <Typography variant="body2">
                      {`${key}: ${value}`}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      )}
      
      <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
        {selectedTrait && activeTab === 1 && usedSlots < totalSlots && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              dispatch(equipTrait({ traitId: selectedTrait.id }));
              setSelectedTrait(null);
            }}
          >
            Equip Selected
          </Button>
        )}
        
        {selectedTrait && activeTab === 0 && !permanentTraits.some(t => t.id === selectedTrait.id) && (
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={() => {
              dispatch(unequipTrait(selectedTrait.id));
              setSelectedTrait(null);
            }}
          >
            Unequip Selected
          </Button>
        )}
        
        <Button onClick={onClose} variant="outlined">Close</Button>
      </Stack>
    </Panel>
  );
};

export default IntegratedTraitsPanel;
