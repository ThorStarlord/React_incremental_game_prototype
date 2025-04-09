import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';

// Import from Traits slice
import { 
  selectTraits,
  selectAcquiredTraits,
  equipTrait as equipTraitAction, 
  unequipTrait as unequipTraitAction
} from '../../../Traits/state/TraitsSlice';

// Import from player selectors file instead of PlayerSlice
import { 
  selectPlayerTraitSlots,
  selectPlayerAcquiredTraits 
} from '../../state/playerSelectors';

/**
 * Interface for the extended trait with possible missing properties
 */
interface TraitData {
  name: string;
  description: string;
  category?: string;
  type?: string;
  effects?: any;
  [key: string]: any;
}

/**
 * Component to display and manage player traits
 * 
 * This component shows all acquired traits and allows equipping/unequipping
 * them based on available trait slots.
 */
const PlayerTraits: React.FC = () => {
  // Use Redux hooks
  const dispatch = useAppDispatch();
  
  // Select relevant state from Redux store
  const allTraits = useAppSelector(selectTraits);
  const acquiredTraits = useAppSelector(selectAcquiredTraits);
  const equippedTraits = useAppSelector(selectPlayerAcquiredTraits);
  const traitSlots = useAppSelector(selectPlayerTraitSlots);
  
  // Calculate if player can equip more traits
  const canEquipMore = equippedTraits.length < traitSlots;
  
  // Handle equipping a trait
  const handleEquipTrait = (traitId: string) => {
    if (!canEquipMore) return;
    
    dispatch(equipTraitAction({ traitId }));
  };
  
  // Handle unequipping a trait
  const handleUnequipTrait = (traitId: string) => {
    dispatch(unequipTraitAction(traitId));
  };
  
  // Get trait details with memoization to avoid recalculation
  const getTraitDetails = useMemo(() => {
    return (traitId: string): TraitData => {
      const trait = allTraits[traitId];
      
      // Handle possibly different trait data structures with category or type
      if (trait) {
        // First spread the trait to get all properties
        const result = {
          ...trait,
          name: trait.name || traitId,
          description: trait.description || 'Unknown trait',
          // Normalize the category/type naming discrepancy
          category: trait.category || 'unknown'
        };
        
        // If the trait has a 'type' property but no 'category', copy it to category
        if (!trait.category && trait.hasOwnProperty('type')) {
          result.category = (trait as any).type;
        }
        
        return result;
      } else {
        return { 
          name: traitId, 
          description: 'Unknown trait',
          category: 'unknown'
        };
      }
    };
  }, [allTraits]);
  
  // Get color for trait types
  const getTraitTypeColor = (type: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const typeMap: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
      combat: "error",
      magic: "secondary",
      social: "success",
      survival: "warning",
      crafting: "info",
      knowledge: "primary"
    };
    
    return typeMap[type.toLowerCase()] || "default";
  };
  
  // Format trait effects as readable text
  const formatTraitEffects = (trait: TraitData): string => {
    if (!trait.effects) return '';
    
    if (Array.isArray(trait.effects)) {
      return trait.effects.map((effect: any) => 
        `${effect.type}: ${effect.value > 0 ? '+' : ''}${effect.value}`
      ).join(', ');
    }
    
    if (typeof trait.effects === 'object') {
      return Object.entries(trait.effects)
        .map(([key, value]) => `${key}: ${(value as number) > 0 ? '+' : ''}${value}`)
        .join(', ');
    }
    
    return '';
  };
  
  // Get trait type/category for display
  const getTraitType = (trait: TraitData): string => {
    return trait.category || "General";
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Character Traits</Typography>
      
      {acquiredTraits.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          You haven't acquired any traits yet. Complete quests and interact with NPCs to gain traits.
        </Alert>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1">
              Equipped Traits
            </Typography>
            <Chip 
              label={`${equippedTraits.length}/${traitSlots}`} 
              color={canEquipMore ? "primary" : "error"}
              size="small"
            />
          </Box>
          
          <List sx={{ mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            {equippedTraits.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary="No traits equipped" 
                  secondary="Equip traits from your collection to gain their benefits"
                  primaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            ) : (
              equippedTraits.map((traitId, index) => {
                const trait = getTraitDetails(traitId);
                const effectsText = formatTraitEffects(trait);
                const traitType = getTraitType(trait);
                
                return (
                  <React.Fragment key={traitId}>
                    <ListItem
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          aria-label="unequip"
                          onClick={() => handleUnequipTrait(traitId)}
                          size="small"
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {trait.name}
                            <Chip 
                              label={traitType} 
                              color={getTraitTypeColor(traitType)} 
                              size="small" 
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={(
                          <>
                            <Typography variant="body2" component="span" display="block">
                              {trait.description}
                            </Typography>
                            {effectsText && (
                              <Typography 
                                variant="caption" 
                                component="span" 
                                color="primary"
                                display="block"
                              >
                                Effects: {effectsText}
                              </Typography>
                            )}
                          </>
                        )}
                      />
                    </ListItem>
                    {index < equippedTraits.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                );
              })
            )}
          </List>
          
          {/* Available traits section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1">
              Available Traits
            </Typography>
            <Chip 
              label={`${acquiredTraits.length - equippedTraits.length}`} 
              color="default"
              size="small"
            />
          </Box>
          
          <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            {acquiredTraits
              .filter(id => !equippedTraits.includes(id))
              .map((traitId, index, filteredArray) => {
                const trait = getTraitDetails(traitId);
                const effectsText = formatTraitEffects(trait);
                const traitType = getTraitType(trait);
                
                return (
                  <React.Fragment key={traitId}>
                    <ListItem
                      secondaryAction={
                        <Tooltip title={!canEquipMore ? "No available trait slots" : "Equip trait"}>
                          <span>
                            <IconButton
                              edge="end"
                              aria-label="equip"
                              onClick={() => handleEquipTrait(traitId)}
                              disabled={!canEquipMore}
                              size="small"
                            >
                              <AddCircleOutlineIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      }
                    >
                      <ListItemText
                        primary={(
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {trait.name}
                            <Chip 
                              label={traitType} 
                              color={getTraitTypeColor(traitType)} 
                              size="small" 
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        )}
                        secondary={(
                          <>
                            <Typography variant="body2" component="span" display="block">
                              {trait.description}
                            </Typography>
                            {effectsText && (
                              <Typography 
                                variant="caption" 
                                component="span" 
                                color="primary"
                                display="block"
                              >
                                Effects: {effectsText}
                              </Typography>
                            )}
                          </>
                        )}
                      />
                    </ListItem>
                    {index < filteredArray.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                );
              })}
              
            {acquiredTraits.filter(id => !equippedTraits.includes(id)).length === 0 && (
              <ListItem>
                <ListItemText 
                  primary="No available traits" 
                  secondary="All your traits are currently equipped"
                  primaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            )}
          </List>
        </>
      )}
      
      {/* Help message at the bottom */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        <InfoOutlinedIcon fontSize="small" color="action" sx={{ mr: 1 }} />
        <Typography variant="caption" color="text.secondary">
          Traits provide bonuses and abilities. Equip them to gain their benefits.
        </Typography>
      </Box>
    </Box>
  );
};

export default PlayerTraits;
