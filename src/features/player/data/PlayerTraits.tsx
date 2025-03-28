import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Chip, Stack, Grid } from '@mui/material';
import { useGameState } from '../../../context/GameStateExports';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { getUITraitById, calculateTraitStatBonuses, UITrait } from '../../../shared/utils/traitUtils';

// Remove the local module declaration since we now have a proper declaration file

/**
 * Type for active tab in the traits panel
 */
type ActiveTab = 'traits' | 'stats';

/**
 * Props for TraitCard component
 */
interface TraitCardProps {
  trait: UITrait;
  isEquipped: boolean;
  canEquip: boolean;
}

/**
 * A card displaying a single trait
 */
const TraitCard: React.FC<TraitCardProps> = ({ trait, isEquipped, canEquip }) => {
  return (
    <Paper 
      elevation={isEquipped ? 3 : 1}
      sx={{
        p: 1.5,
        borderLeft: '4px solid',
        borderColor: isEquipped ? 'primary.main' : 'divider',
        backgroundColor: isEquipped ? 'action.selected' : 'background.paper',
        cursor: 'pointer'
      }}
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

/**
 * Props for StatBonusChips component
 */
interface StatBonusChipsProps {
  statBonuses: Record<string, number>;
}

/**
 * Displays stat bonuses as chips
 */
const StatBonusChips: React.FC<StatBonusChipsProps> = ({ statBonuses }) => {
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
            sx={{ mb: 0.5 }}
          />
        );
      })}
    </Stack>
  );
};

/**
 * Tab content for trait stats
 */
const TraitStatBonusesTab: React.FC<{ bonuses: Record<string, number> }> = ({ bonuses }) => {
  const hasAnyBonus = Object.values(bonuses).some(value => value !== 0);

  if (!hasAnyBonus) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
        No stat bonuses from equipped traits
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="subtitle2">
        Stat Bonuses from Traits
      </Typography>
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {Object.entries(bonuses).map(([stat, value]) => {
          if (value === 0) return null;
          return (
            <Grid item xs={6} key={stat}>
              <Chip
                label={`${stat}: ${value > 0 ? '+' : ''}${value}`}
                color={value > 0 ? 'success' : 'error'}
                size="small"
                variant="outlined"
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

/**
 * Tab content for acquired traits
 */
const AcquiredTraitsTab: React.FC<{ 
  acquiredTraits: string[],
  equippedTraits: string[],
  traitSlots: number,
  traitsData: Record<string, any>
}> = ({ acquiredTraits, equippedTraits, traitSlots, traitsData }) => {
  if (!acquiredTraits || !acquiredTraits.length) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
        No traits acquired yet
      </Typography>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2">
          Trait Slots: {equippedTraits?.length || 0}/{traitSlots || 0}
        </Typography>
      </Box>
      <Stack spacing={1} sx={{ mt: 1 }}>
        {acquiredTraits.map(traitId => {
          // Use our new utility function to get a UI-compatible trait
          const trait = getUITraitById(traitsData, traitId);
          if (!trait) return null;
          
          const isEquipped = equippedTraits?.includes(traitId);
          const canEquip = traitSlots > (equippedTraits?.length || 0);
          
          return (
            <TraitCard 
              key={traitId}
              trait={trait}
              isEquipped={isEquipped}
              canEquip={canEquip}
            />
          );
        })}
      </Stack>
    </>
  );
};

/**
 * Custom tab selector component
 */
const TabSelector: React.FC<{
  activeTab: ActiveTab,
  onChange: (tab: ActiveTab) => void
}> = ({ activeTab, onChange }) => {
  return (
    <Box sx={{ display: 'flex', mt: 1 }}>
      <Box 
        onClick={() => onChange('traits')} 
        sx={{ 
          flex: 1, 
          textAlign: 'center', 
          p: 0.5, 
          borderBottom: '2px solid',
          borderColor: activeTab === 'traits' ? 'primary.main' : 'transparent',
          cursor: 'pointer'
        }}
      >
        <Typography variant="body2">Traits</Typography>
      </Box>
      <Box 
        onClick={() => onChange('stats')} 
        sx={{ 
          flex: 1, 
          textAlign: 'center', 
          p: 0.5, 
          borderBottom: '2px solid',
          borderColor: activeTab === 'stats' ? 'primary.main' : 'transparent',
          cursor: 'pointer'
        }}
      >
        <Typography variant="body2">Stats</Typography>
      </Box>
    </Box>
  );
};

/**
 * PlayerTraits Component
 * 
 * Displays the player's acquired traits and allows equipping them
 * Also shows stat bonuses provided by traits
 */
const PlayerTraits: React.FC = () => {
  const gameState = useGameState();
  const player = gameState.player;
  const traits = gameState.traits;
  
  const [width, setWidth] = useState<number>(250);
  const [height, setHeight] = useState<number>(350);
  const [activeTab, setActiveTab] = useState<ActiveTab>('traits');

  /**
   * Handle resize events for the resizable box
   */
  const handleResize = (_e: React.SyntheticEvent, data: any) => {
    setWidth(data.size.width);
    setHeight(data.size.height);
  };

  /**
   * Calculate the total stat bonuses from equipped traits
   * @returns Record of stat bonuses
   */
  const traitStatBonuses = useMemo(() => {
    // Use our new utility function to calculate trait stat bonuses
    return calculateTraitStatBonuses(player?.equippedTraits, traits?.copyableTraits);
  }, [player?.equippedTraits, traits?.copyableTraits]);

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
          flexDirection: 'column'
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" component="h2">
            Character Traits
          </Typography>
          <TabSelector 
            activeTab={activeTab} 
            onChange={setActiveTab} 
          />
        </Box>
        
        <Box sx={{ p: 2, overflowY: 'auto', flex: 1 }}>
          {activeTab === 'traits' && (
            <AcquiredTraitsTab
              acquiredTraits={player?.acquiredTraits || []}
              equippedTraits={player?.equippedTraits || []}
              traitSlots={player?.traitSlots || 0}
              traitsData={traits?.copyableTraits || {}}
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
