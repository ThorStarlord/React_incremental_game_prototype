import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Tooltip,
  useTheme
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Panel from '../../../../shared/components/layout/Panel';
import HotkeyHelpTooltip from '../../../../shared/components/ui/HotkeyHelpTooltip';
import useTraitShortcuts from '../../hooks/useTraitShortcuts';

/**
 * Interface for a Trait object
 * 
 * @interface Trait
 * @property {string} id - Unique identifier for the trait
 * @property {string} name - Display name of the trait
 * @property {string} description - Description of what the trait does
 */
interface Trait {
  id: string;
  name: string;
  description: string;
}

/**
 * Interface for Player object
 * 
 * @interface Player
 * @property {number} traitSlots - Number of available trait slots
 */
interface Player {
  traitSlots: number;
}

/**
 * Interface for TraitSlotsFallback props
 * 
 * @interface TraitSlotsFallbackProps
 * @property {Player} player - Player object containing trait slot information
 * @property {number} essence - Current essence amount
 * @property {Trait[]} equippedTraits - Array of currently equipped traits
 * @property {Trait[]} availableTraits - Array of all available traits
 * @property {(traitId: string) => void} onEquip - Function to equip a trait
 * @property {(traitId: string) => void} onUnequip - Function to unequip a trait
 * @property {(cost: number) => void} onUpgradeSlot - Function to upgrade trait slots
 */
interface TraitSlotsFallbackProps {
  player: Player;
  essence: number;
  equippedTraits: Trait[];
  availableTraits: Trait[];
  onEquip: (traitId: string) => void;
  onUnequip: (traitId: string) => void;
  onUpgradeSlot: (cost: number) => void;
}

/**
 * TraitSlotsFallback Component
 * 
 * Displays UI for managing trait slots including equipped traits,
 * available traits, and slot upgrade functionality.
 * 
 * @param {TraitSlotsFallbackProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
const TraitSlotsFallback: React.FC<TraitSlotsFallbackProps> = ({ 
  player, 
  essence,
  equippedTraits,
  availableTraits,
  onEquip,
  onUnequip,
  onUpgradeSlot
}) => {
  const theme = useTheme();
  const SLOT_UPGRADE_COST: number = 100;
  const MAX_TRAIT_SLOTS: number = 8;

  // Initialize keyboard shortcuts
  useTraitShortcuts({
    onUnequip,
    equippedTraits
  });

  const getUpgradeCost = (): number => {
    return SLOT_UPGRADE_COST * Math.pow(1.5, player.traitSlots - 3);
  };

  return (
    <Panel title="Trait Slots">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1">
            Available Slots: {equippedTraits.length}/{player.traitSlots}
          </Typography>
          <HotkeyHelpTooltip />
        </Box>
        {player.traitSlots < MAX_TRAIT_SLOTS && (
          <Tooltip 
            title={essence < getUpgradeCost() ? `Need ${getUpgradeCost()} essence` : 'Unlock new trait slot'}
            arrow
          >
            <span>
              <Button
                variant="outlined"
                onClick={() => onUpgradeSlot(getUpgradeCost())}
                disabled={essence < getUpgradeCost()}
              >
                Upgrade ({getUpgradeCost()} essence)
              </Button>
            </span>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Equipped Traits
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {equippedTraits.map((trait, index) => (
            <Box
              key={trait.id}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'primary.main',
                borderRadius: 1,
                position: 'relative'
              }}
            >
              <IconButton
                size="small"
                onClick={() => onUnequip(trait.id)}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  bgcolor: 'background.paper'
                }}
              >
                <RemoveCircleIcon color="error" />
              </IconButton>
              <Typography variant="body2">
                {trait.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Shortcut: Shift+{index + 1}
              </Typography>
            </Box>
          ))}
          {Array.from({ length: player.traitSlots - equippedTraits.length }).map((_, index) => (
            <Box
              key={`empty-${index}`}
              sx={{
                p: 2,
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                width: 150,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Empty Slot
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Available Traits
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {availableTraits.map(trait => {
            const isEquipped = equippedTraits.some(t => t.id === trait.id);
            return (
              <Box
                key={trait.id}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: isEquipped ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  position: 'relative',
                  opacity: isEquipped ? 0.7 : 1
                }}
              >
                {!isEquipped && equippedTraits.length < player.traitSlots && (
                  <IconButton
                    size="small"
                    onClick={() => onEquip(trait.id)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: 'background.paper'
                    }}
                  >
                    <AddCircleIcon color="success" />
                  </IconButton>
                )}
                <Typography variant="body2">
                  {trait.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {trait.description}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Panel>
  );
};

export default TraitSlotsFallback;
