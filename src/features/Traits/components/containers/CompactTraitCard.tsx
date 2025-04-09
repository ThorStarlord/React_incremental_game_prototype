import React from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Paper
} from '@mui/material';
import { CopyableTrait } from '../../data/traits';

/**
 * Props for the CompactTraitCard component
 */
interface CompactTraitCardProps {
  /** The trait to display in the card */
  trait: CopyableTrait | null;
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
const CompactTraitCard: React.FC<CompactTraitCardProps> = ({ trait }) => {
  if (!trait) return null;
  
  return (
    <Tooltip 
      title={
        <>
          <Typography variant="subtitle2">{trait.name}</Typography>
          <Typography variant="caption">{trait.type}</Typography>
          <Typography variant="body2">{trait.description}</Typography>
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
          borderColor: `${getTraitTypeColor(trait.type)}.main`,
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
