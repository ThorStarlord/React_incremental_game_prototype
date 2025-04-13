import React from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Paper
} from '@mui/material';
// Import the Trait type from the slice and the selector
import { Trait } from '../../state/TraitsTypes';
import { selectTraitById } from '../../state/TraitsSelectors';
import { useAppSelector } from '../../../../app/hooks';

/**
 * Props for the CompactTraitCard component
 */
interface CompactTraitCardProps {
  /** The ID of the trait to display */
  traitId: string | null;
}

/**
 * TraitType for color mapping
 */
type TraitType = 'combat' | 'social' | 'utility' | 'knowledge' | string;

/**
 * Helper to get color based on trait type
 * 
 * @param type - The trait type to get color for
 * @returns MUI color identifier
 */
const getTraitTypeColor = (type?: TraitType): string => {
  if (!type) return 'primary';
  
  switch (type.toLowerCase()) {
    case 'combat':
      return 'error';
    case 'social':
      return 'secondary';
    case 'utility':
      return 'info';
    case 'knowledge':
      return 'warning';
    default:
      return 'primary';
  }
};

/**
 * A compact card component for displaying traits
 * 
 * @param props - Component props
 * @returns React component or null if no trait is provided
 */
const CompactTraitCard: React.FC<CompactTraitCardProps> = ({ traitId }) => {
  // Fetch the trait data from Redux store using the ID
  const trait = useAppSelector((state) => traitId ? selectTraitById(state, traitId) : null);

  // Render nothing if the trait ID is null or the trait data is not found
  if (!traitId || !trait) return null;
  
  return (
    <Tooltip 
      title={
        <>
          <Typography variant="subtitle2">{trait.name}</Typography>
          <Typography variant="caption">{trait.category}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>{trait.description}</Typography>
        </>
      }
    >
      <Paper
        elevation={1}
        sx={{
          height: 36,
          display: 'flex',
          alignItems: 'center',
          pl: 1.5,
          pr: 0.5,
          borderLeft: '3px solid',
          borderColor: `${getTraitTypeColor(trait.category)}.main`, // Use category from Trait type
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}
      >
        <Typography variant="body2" noWrap title={trait.name}>
          {trait.name}
        </Typography>
      </Paper>
    </Tooltip>
  );
};

export default CompactTraitCard;
