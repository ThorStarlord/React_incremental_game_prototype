import React, { useContext, useState } from 'react';
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
  Stack
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import InfoIcon from '@mui/icons-material/Info';
import { useGameState } from '../../../../context/index';
import Panel from '../../../../shared/components/layout/Panel';
import { CopyableTrait } from '../../data/traits';
// TraitCard and TraitBrowser imports removed

/**
 * Interface for the trait object with ID included
 */
interface TraitWithId extends CopyableTrait {
  id: string;
}

/**
 * Props for the IntegratedTraitsPanel component
 */
interface IntegratedTraitsPanelProps {
  /** Function to close the panel */
  onClose: () => void;
}

/**
 * IntegratedTraitsPanel - Comprehensive panel for managing character traits
 * 
 * Allows players to view, equip, and manage their character traits in a single interface.
 * Provides information about trait effects and requirements.
 */
const IntegratedTraitsPanel: React.FC<IntegratedTraitsPanelProps> = ({ onClose }) => {
  // State and context hooks
  const { player, traits: traitData, dispatch } = useGameState();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedTrait, setSelectedTrait] = useState<TraitWithId | null>(null);
  
  // Get player's traits data
  const equippedTraitIds = player?.equippedTraits || [];
  const permanentTraitIds = player?.permanentTraits || [];
  const acquiredTraitIds = player?.acquiredTraits || [];
  
  // Calculate available slots
  const usedSlots = equippedTraitIds.length;
  const totalSlots = player?.traitSlots || 0;
  
  /**
   * Function to get trait object by ID
   * @param traitId - ID of the trait to retrieve
   * @returns Trait object with ID included, or null if not found
   */
  const getTraitById = (traitId: string): TraitWithId | null => {
    if (!traitData?.copyableTraits || !traitId) return null;
    const trait = traitData.copyableTraits[traitId];
    return trait ? { id: traitId, ...trait } : null;
  };
  
  // Get trait objects from IDs
  const equippedTraits: TraitWithId[] = equippedTraitIds
    .map(id => getTraitById(id))
    .filter((trait): trait is TraitWithId => trait !== null);
    
  const permanentTraits: TraitWithId[] = permanentTraitIds
    .map(id => getTraitById(id))
    .filter((trait): trait is TraitWithId => trait !== null);
    
  const acquiredTraits: TraitWithId[] = acquiredTraitIds
    .map(id => getTraitById(id))
    .filter((trait): trait is TraitWithId => trait !== null);
  
  // Available traits (acquired but not equipped or permanent)
  const availableTraits = acquiredTraits.filter(
    trait => !equippedTraitIds.includes(trait.id) && !permanentTraitIds.includes(trait.id)
  );
  
  /**
   * Handle tab change
   * @param event - The event triggering the tab change
   * @param newValue - The new tab index
   */
  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue);
    setSelectedTrait(null);
  };
  
  /**
   * Trait selection for details view
   * @param trait - The selected trait
   */
  const handleSelectTrait = (trait: TraitWithId): void => {
    setSelectedTrait(trait);
  };
  
  /**
   * Simple trait item component to replace TraitCard
   */
  const TraitItem: React.FC<{
    trait: TraitWithId;
    isEquipped?: boolean;
    isPermanent?: boolean;
  }> = ({ trait, isEquipped = false, isPermanent = false }) => (
    <Paper 
      elevation={1}
      sx={{ 
        p: 2, 
        cursor: 'pointer',
        border: selectedTrait?.id === trait.id ? '2px solid' : '1px solid',
        borderColor: selectedTrait?.id === trait.id ? 'primary.main' : 'divider',
        bgcolor: isPermanent ? 'rgba(76, 175, 80, 0.08)' : 'background.paper'
      }}
      onClick={() => handleSelectTrait(trait)}
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
      
      {/* Tab content */}
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
          
          {selectedTrait.requirements && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="warning.main" gutterBottom>Requirements:</Typography>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {Object.entries(selectedTrait.requirements).map(([key, value], index) => (
                  <li key={index}>
                    <Typography variant="body2">
                      {key}: {value}
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
              dispatch({
                type: 'EQUIP_TRAIT',
                payload: { traitId: selectedTrait.id }
              });
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
              dispatch({
                type: 'UNEQUIP_TRAIT',
                payload: { traitId: selectedTrait.id }
              });
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
