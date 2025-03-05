import React, { useContext, useState, useMemo } from 'react';
import { Box, Typography, Paper, Chip, Stack, Tooltip, Divider, Grid } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import { GameStateContext } from '../../../context/GameStateContext';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

/**
 * Interface for trait stat bonuses
 */
interface TraitStatBonuses {
  strength: number;
  dexterity: number; 
  intelligence: number;
  vitality: number;
  luck: number;
  damage: number;
  critChance: number;
  critDamage: number;
  health: number;
  defense: number;
  [key: string]: number; // Allow other stat properties
}

/**
 * Interface for a trait
 */
interface Trait {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity?: string;
  level?: number;
  effect?: string;
  statBonuses?: {
    [key: string]: number;
  };
}

/**
 * Interface for traits data
 */
interface TraitsData {
  copyableTraits: {
    [key: string]: Trait;
  };
}

/**
 * Active tab options
 */
type ActiveTab = 'traits' | 'stats';

/**
 * PlayerTraits Component
 * 
 * @description Displays all traits acquired by the player in a draggable and resizable window.
 * Each trait shows its name, description, type, and rarity (if available).
 * Also displays cumulative stat bonuses from all traits and how they affect the player.
 */
const PlayerTraits: React.FC = () => {
  const { player, traits } = useContext(GameStateContext);
  const [width, setWidth] = useState<number>(250);
  const [height, setHeight] = useState<number>(350);
  const [activeTab, setActiveTab] = useState<ActiveTab>('traits');

  // Configure draggable behavior for the window
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'player-traits-window',
    data: { type: 'window', windowType: 'player-traits' }
  });

  /**
   * Calculate cumulative stat bonuses from all traits
   * @returns Object containing stat bonuses
   */
  const traitStatBonuses = useMemo<TraitStatBonuses>(() => {
    const bonuses: TraitStatBonuses = {
      strength: 0,
      dexterity: 0, 
      intelligence: 0,
      vitality: 0,
      luck: 0,
      damage: 0,
      critChance: 0,
      critDamage: 0,
      health: 0,
      defense: 0,
    };

    if (player.acquiredTraits && traits?.copyableTraits) {
      player.acquiredTraits.forEach((traitId: string) => {
        const trait = traits.copyableTraits[traitId];
        if (trait?.statBonuses) {
          Object.entries(trait.statBonuses).forEach(([stat, value]) => {
            if (stat in bonuses) {
              bonuses[stat] += value;
            }
          });
        }
      });
    }

    return bonuses;
  }, [player.acquiredTraits, traits?.copyableTraits]);

  /**
   * Renders a summary of stat bonuses from all traits
   * @returns Rendered summary of stat bonuses
   */
  const renderStatBonuses = (): JSX.Element => {
    const hasAnyBonus = Object.values(traitStatBonuses).some(value => value !== 0);

    if (!hasAnyBonus) {
      return (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          No stat bonuses from traits yet
        </Typography>
      );
    }

    return (
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {Object.entries(traitStatBonuses).map(([stat, value]) => {
          if (value === 0) return null;
          
          return (
            <Grid item xs={6} key={stat}>
              <Tooltip title={`${stat.charAt(0).toUpperCase() + stat.slice(1)} bonus from traits`}>
                <Paper sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="caption" display="block" sx={{ textTransform: 'capitalize' }}>
                    {stat}
                  </Typography>
                  <Typography variant="body2" color={value > 0 ? 'success.main' : 'error.main'}>
                    {value > 0 ? '+' : ''}{value}
                  </Typography>
                </Paper>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  /**
   * Renders all acquired traits or an empty state message if none are found
   * @returns Rendered trait list or empty state message
   */
  const renderAcquiredTraits = (): JSX.Element => {
    if (!player.acquiredTraits || !player.acquiredTraits.length) {
      return (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          No traits acquired yet
        </Typography>
      );
    }

    return (
      <>
        {player.acquiredTraits.map((traitId: string) => {
          const trait = traits.copyableTraits[traitId];
          if (!trait) return null;
          
          // Determine trait rarity color (if trait has rarity property)
          const rarityColor = trait.rarity ? getRarityColor(trait.rarity) : 'primary';
          
          return (
            <Paper
              key={traitId}
              elevation={1}
              sx={{
                p: 1.5,
                mb: 1,
                '&:last-child': { mb: 0 },
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                {trait.name}
                {trait.level && trait.level > 1 && (
                  <Typography component="span" color="primary.main" sx={{ ml: 1 }}>
                    Lv. {trait.level}
                  </Typography>
                )}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {trait.description}
              </Typography>
              
              {/* Render trait stat bonuses if available */}
              {trait.statBonuses && Object.keys(trait.statBonuses).length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Provides:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {Object.entries(trait.statBonuses).map(([stat, value]) => (
                      <Chip
                        key={stat}
                        size="small"
                        label={`${stat}: ${value > 0 ? '+' : ''}${value}`}
                        color={value > 0 ? 'success' : 'error'}
                        variant="outlined"
                        sx={{ mb: 0.5 }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
              
              <Stack direction="row" spacing={1}>
                <Tooltip title={`Type: ${trait.type}`}>
                  <Chip
                    size="small"
                    label={trait.type}
                    color="primary"
                    variant="outlined"
                  />
                </Tooltip>
                
                {trait.rarity && (
                  <Tooltip title={`Rarity: ${trait.rarity}`}>
                    <Chip 
                      size="small"
                      label={trait.rarity}
                      color={rarityColor}
                      variant="outlined"
                    />
                  </Tooltip>
                )}
                
                {trait.effect && (
                  <Tooltip title={`Effect: ${trait.effect}`}>
                    <Chip
                      size="small"
                      label="Effect"
                      color="secondary"
                      variant="outlined"
                    />
                  </Tooltip>
                )}
              </Stack>
            </Paper>
          );
        })}
      </>
    );
  };

  /**
   * Determines the MUI color to use based on trait rarity
   * @param rarity - The rarity level of the trait
   * @returns MUI color name to use for the rarity chip
   */
  const getRarityColor = (rarity: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch(rarity.toLowerCase()) {
      case 'common': return 'default';
      case 'uncommon': return 'success';
      case 'rare': return 'primary';
      case 'epic': return 'secondary';
      case 'legendary': return 'warning';
      case 'mythic': return 'error';
      default: return 'default';
    }
  };

  return (
    <ResizableBox
      width={width}
      height={height}
      minConstraints={[200, 200]}
      maxConstraints={[500, 600]}
      onResize={(e: React.SyntheticEvent, data: { size: { width: number; height: number }}) => {
        setWidth(data.size.width);
        setHeight(data.size.height);
      }}
    >
      <Box
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          width: '100%',
          height: '100%',
          transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
          transition: 'transform 0.2s ease',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 3
        }}
      >
        {/* Window title */}
        <Typography variant="h6" gutterBottom sx={{ 
          textAlign: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 1
        }}>
          Acquired Traits ({player.acquiredTraits?.length || 0})
        </Typography>
        
        {/* Tab navigation */}
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            borderBottom: '1px solid', 
            borderColor: 'divider', 
            pb: 0.5 
          }}
        >
          <Typography 
            variant="button" 
            sx={{ 
              cursor: 'pointer', 
              color: activeTab === 'traits' ? 'primary.main' : 'text.secondary',
              borderBottom: activeTab === 'traits' ? '2px solid' : 'none',
              borderColor: 'primary.main',
              pb: 0.5,
              fontWeight: activeTab === 'traits' ? 'bold' : 'normal'
            }}
            onClick={() => setActiveTab('traits')}
          >
            Traits
          </Typography>
          <Typography 
            variant="button" 
            sx={{ 
              cursor: 'pointer', 
              color: activeTab === 'stats' ? 'primary.main' : 'text.secondary',
              borderBottom: activeTab === 'stats' ? '2px solid' : 'none',
              borderColor: 'primary.main',
              pb: 0.5,
              fontWeight: activeTab === 'stats' ? 'bold' : 'normal'
            }}
            onClick={() => setActiveTab('stats')}
          >
            Stat Bonuses
          </Typography>
        </Stack>
        
        {/* Scrollable content container */}
        <Box sx={{ 
          mt: 2,
          flexGrow: 1,
          overflow: 'auto',
          pr: 1
        }}>
          {activeTab === 'traits' ? renderAcquiredTraits() : renderStatBonuses()}
        </Box>
      </Box>
    </ResizableBox>
  );
};

export default PlayerTraits;
