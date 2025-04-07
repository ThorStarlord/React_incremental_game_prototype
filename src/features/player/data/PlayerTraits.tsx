import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Chip, Stack, Grid, Tooltip, IconButton } from '@mui/material';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { getUITraitById, calculateTraitStatBonuses, UITrait } from '../../../shared/utils/traitUtils';
import InfoIcon from '@mui/icons-material/Info';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import { equipTrait, unequipTrait } from '../state/PlayerSlice';
import { selectPlayerTraits, selectPlayerTraitSlots, selectPlayerAttribute } from '../state/playerSelectors';

// Types
type ActiveTab = 'traits' | 'stats';

// Component interfaces
interface TraitCardProps {
  trait: UITrait;
  isEquipped: boolean;
  canEquip: boolean;
  onToggle?: (traitId: string) => void;
}

interface StatBonusChipsProps {
  statBonuses: Record<string, number>;
  compact?: boolean;
}

interface TabSelectorProps {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}

interface TraitTabProps {
  acquiredTraits: string[];
  equippedTraits: string[];
  traitSlots: number;
  traitsData: Record<string, any>;
  onToggleTrait?: (traitId: string) => void;
}

interface StatTabProps {
  bonuses: Record<string, number>;
}

// Trait card component
const TraitCard: React.FC<TraitCardProps> = ({ trait, isEquipped, canEquip, onToggle }) => {
  const handleClick = () => {
    if (onToggle) {
      onToggle(trait.id);
    }
  };

  return (
    <Paper 
      elevation={isEquipped ? 3 : 1}
      sx={{
        p: 1.5,
        borderLeft: '4px solid',
        borderColor: isEquipped ? 'primary.main' : 'divider',
        backgroundColor: isEquipped ? 'action.selected' : 'background.paper',
        cursor: onToggle ? 'pointer' : 'default',
        transition: 'all 0.2s',
        '&:hover': onToggle ? {
          backgroundColor: isEquipped ? 'action.hover' : 'action.hover',
          transform: 'translateY(-2px)'
        } : {}
      }}
      onClick={handleClick}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="subtitle2" component="div" sx={{ fontWeight: 'bold' }}>
          {trait.name}
        </Typography>
        <Chip 
          size="small" 
          color={isEquipped ? 'primary' : 'default'}
          label={isEquipped ? 'Equipped' : (canEquip ? 'Available' : 'Inactive')}
          variant={isEquipped ? 'filled' : 'outlined'}
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
        {trait.description}
      </Typography>
      
      {trait.statBonuses && Object.keys(trait.statBonuses).length > 0 && (
        <Box sx={{ mt: 1 }}>
          <StatBonusChips statBonuses={trait.statBonuses} />
        </Box>
      )}
    </Paper>
  );
};

// Stat bonus display as chips
const StatBonusChips: React.FC<StatBonusChipsProps> = ({ statBonuses, compact = false }) => {
  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap">
      {Object.entries(statBonuses).map(([stat, value]) => {
        const numValue = Number(value);
        if (numValue === 0) return null;
        
        return (
          <Chip
            key={stat}
            size="small"
            label={`${stat}: ${numValue > 0 ? '+' : ''}${numValue}`}
            color={numValue > 0 ? 'success' : 'error'}
            variant="outlined"
            sx={{ mb: 0.5, fontSize: compact ? '0.7rem' : '0.75rem' }}
          />
        );
      })}
    </Stack>
  );
};

// Stats tab content
const TraitStatBonusesTab: React.FC<StatTabProps> = ({ bonuses }) => {
  const hasAnyBonus = Object.values(bonuses).some(value => value !== 0);

  if (!hasAnyBonus) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography color="text.secondary">
          No stat bonuses from equipped traits
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Equip traits to receive stat bonuses
        </Typography>
      </Box>
    );
  }

  // Group bonuses by positive and negative
  const positiveBonuses: Record<string, number> = {};
  const negativeBonuses: Record<string, number> = {};
  
  Object.entries(bonuses).forEach(([stat, value]) => {
    if (value > 0) positiveBonuses[stat] = value;
    else if (value < 0) negativeBonuses[stat] = value;
  });

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2">
          Trait Bonuses
        </Typography>
        <Tooltip title="These bonuses are applied to your base stats">
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {Object.keys(positiveBonuses).length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="success.main" gutterBottom>
            Positive Effects
          </Typography>
          <Grid container spacing={1}>
            {Object.entries(positiveBonuses).map(([stat, value]) => (
              <Grid item xs={6} key={stat}>
                <Chip
                  label={`${stat}: +${value}`}
                  color="success"
                  size="small"
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      {Object.keys(negativeBonuses).length > 0 && (
        <Box>
          <Typography variant="body2" color="error.main" gutterBottom>
            Negative Effects
          </Typography>
          <Grid container spacing={1}>
            {Object.entries(negativeBonuses).map(([stat, value]) => (
              <Grid item xs={6} key={stat}>
                <Chip
                  label={`${stat}: ${value}`}
                  color="error"
                  size="small"
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
};

// Traits tab content
const AcquiredTraitsTab: React.FC<TraitTabProps> = ({ 
  acquiredTraits,
  equippedTraits,
  traitSlots,
  traitsData,
  onToggleTrait
}) => {
  if (!acquiredTraits || !acquiredTraits.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography color="text.secondary">
          No traits acquired yet
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Complete quests to earn traits
        </Typography>
      </Box>
    );
  }

  // Sort traits: equipped first, then alphabetically
  const sortedTraits = [...acquiredTraits].sort((a, b) => {
    const aEquipped = equippedTraits?.includes(a) || false;
    const bEquipped = equippedTraits?.includes(b) || false;
    
    if (aEquipped && !bEquipped) return -1;
    if (!aEquipped && bEquipped) return 1;
    
    const aName = traitsData[a]?.name || '';
    const bName = traitsData[b]?.name || '';
    return aName.localeCompare(bName);
  });

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2">
          Trait Slots: {equippedTraits?.length || 0}/{traitSlots || 0}
        </Typography>
        <Tooltip title="Click on a trait to equip or unequip it">
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Stack spacing={1}>
        {sortedTraits.map(traitId => {
          const trait = getUITraitById(traitsData, traitId);
          if (!trait) return null;
          
          const isEquipped = equippedTraits?.includes(traitId);
          const canEquip = !isEquipped && traitSlots > (equippedTraits?.length || 0);
          
          return (
            <TraitCard 
              key={traitId}
              trait={trait}
              isEquipped={isEquipped}
              canEquip={canEquip}
              onToggle={onToggleTrait}
            />
          );
        })}
      </Stack>
    </>
  );
};

// Tab selector component
const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onChange }) => {
  return (
    <Box sx={{ display: 'flex', mt: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box 
        onClick={() => onChange('traits')} 
        sx={{ 
          flex: 1, 
          textAlign: 'center', 
          p: 1,
          borderBottom: '2px solid',
          borderColor: activeTab === 'traits' ? 'primary.main' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: activeTab === 'traits' ? 'bold' : 'normal' }}>
          Traits
        </Typography>
      </Box>
      <Box 
        onClick={() => onChange('stats')} 
        sx={{ 
          flex: 1, 
          textAlign: 'center', 
          p: 1,
          borderBottom: '2px solid',
          borderColor: activeTab === 'stats' ? 'primary.main' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: activeTab === 'stats' ? 'bold' : 'normal' }}>
          Stats
        </Typography>
      </Box>
    </Box>
  );
};

// Main component
const PlayerTraits: React.FC = () => {
  // Replace gameState context with Redux selectors
  const dispatch = useDispatch();
  
  // Get player traits data from Redux store
  const acquiredTraits = useSelector(state => selectPlayerTraits(state).acquiredTraits);
  const equippedTraits = useSelector(state => selectPlayerTraits(state).equipped);
  const traitSlots = useSelector(selectPlayerTraitSlots);
  
  // Get traits data
  const allTraits = useSelector((state: RootState) => state.traits?.traits || {});
  
  const [width, setWidth] = useState<number>(250);
  const [height, setHeight] = useState<number>(350);
  const [activeTab, setActiveTab] = useState<ActiveTab>('traits');

  // Handle resize events
  const handleResize = (_e: React.SyntheticEvent, data: any) => {
    setWidth(data.size.width);
    setHeight(data.size.height);
  };

  // Toggle equipping/unequipping a trait
  const handleToggleTrait = (traitId: string) => {
    const isEquipped = equippedTraits?.includes(traitId);
    
    if (isEquipped) {
      dispatch(unequipTrait({ traitId }));
    } else {
      dispatch(equipTrait({ traitId }));
    }
  };

  // Calculate trait stat bonuses
  const traitStatBonuses = useMemo(() => {
    return calculateTraitStatBonuses(equippedTraits, allTraits);
  }, [equippedTraits, allTraits]);

  // Get the current stat values for comparison
  const strength = useSelector((state: RootState) => selectPlayerAttribute(state, 'strength')?.value);
  const dexterity = useSelector((state: RootState) => selectPlayerAttribute(state, 'dexterity')?.value);
  const intelligence = useSelector((state: RootState) => selectPlayerAttribute(state, 'intelligence')?.value);
  const vitality = useSelector((state: RootState) => selectPlayerAttribute(state, 'vitality')?.value);

  return (
    <ResizableBox
      width={width}
      height={height}
      minConstraints={[200, 300]}
      maxConstraints={[500, 600]}
      onResize={handleResize}
      resizeHandles={['se']}
    >
      <Paper 
        elevation={3} 
        sx={{
          width: '100%', 
          height: '100%', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
          <Typography variant="h6" component="h2">
            Character Traits
          </Typography>
          <TabSelector 
            activeTab={activeTab} 
            onChange={setActiveTab} 
          />
        </Box>
        
        <Box sx={{ p: 2, overflowY: 'auto', flex:1 }}>
          {activeTab === 'traits' && (
            <AcquiredTraitsTab
              acquiredTraits={acquiredTraits || []}
              equippedTraits={equippedTraits || []}
              traitSlots={traitSlots || 0}
              traitsData={allTraits || {}}
              onToggleTrait={handleToggleTrait}
            />
          )}
          
          {activeTab === 'stats' && (
            <TraitStatBonusesTab bonuses={traitStatBonuses} />
          )}
        </Box>
      </Paper>
    </ResizableBox>
  );
};

export default PlayerTraits;
