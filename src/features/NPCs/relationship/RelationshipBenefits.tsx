import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  Chip,
  Paper
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import StarIcon from '@mui/icons-material/Star';
import DiscountIcon from '@mui/icons-material/Discount';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import HandshakeIcon from '@mui/icons-material/Handshake';

/**
 * Interface for a relationship benefit
 */
interface RelationshipBenefit {
  /** Description of what this benefit provides */
  description: string;
  /** Relationship level required to unlock this benefit */
  level: number;
  /** Icon to display with this benefit */
  icon: React.ReactNode;
  /** Whether the player has unlocked this benefit */
  unlocked: boolean;
  /** Type of benefit for grouping */
  type: 'trait' | 'quest' | 'trade' | 'dialogue' | string;
}

/**
 * Interface for RelationshipBenefits props
 */
interface RelationshipBenefitsProps {
  /** Current relationship level with the NPC */
  currentRelationship: number;
  /** Whether to show only unlocked benefits */
  showOnlyUnlocked?: boolean;
  /** Whether to show the compact view */
  compact?: boolean;
  /** Type of benefits to display (filter) */
  benefitType?: string;
  /** NPC type for specific benefits */
  npcType?: string;
}

/**
 * Component displaying benefits gained from NPC relationships
 * 
 * @param props - Component props
 * @returns Relationship benefits component
 */
const RelationshipBenefits: React.FC<RelationshipBenefitsProps> = ({
  currentRelationship,
  showOnlyUnlocked = false,
  compact = false,
  benefitType,
  npcType
}) => {
  // Determine all benefits based on NPC type and current relationship
  const allBenefits: RelationshipBenefit[] = [
    {
      description: 'Basic dialogue options',
      level: 0,
      icon: <AutoStoriesIcon />,
      unlocked: currentRelationship >= 0,
      type: 'dialogue'
    },
    {
      description: 'Access to basic trades',
      level: 0,
      icon: <DiscountIcon />,
      unlocked: currentRelationship >= 0,
      type: 'trade'
    },
    {
      description: 'Basic quests available',
      level: 20,
      icon: <HandshakeIcon />,
      unlocked: currentRelationship >= 20,
      type: 'quest'
    },
    {
      description: '5% discount on purchases',
      level: 25,
      icon: <DiscountIcon />,
      unlocked: currentRelationship >= 25,
      type: 'trade'
    },
    {
      description: 'Access to common traits',
      level: 30,
      icon: <StarIcon />,
      unlocked: currentRelationship >= 30,
      type: 'trait'
    },
    {
      description: 'Intermediate quests available',
      level: 40,
      icon: <HandshakeIcon />,
      unlocked: currentRelationship >= 40,
      type: 'quest'
    },
    {
      description: '10% discount on purchases',
      level: 50,
      icon: <DiscountIcon />,
      unlocked: currentRelationship >= 50,
      type: 'trade'
    },
    {
      description: 'Access to uncommon traits',
      level: 60,
      icon: <StarIcon />,
      unlocked: currentRelationship >= 60,
      type: 'trait'
    },
    {
      description: 'Advanced quests available',
      level: 70,
      icon: <HandshakeIcon />,
      unlocked: currentRelationship >= 70,
      type: 'quest'
    },
    {
      description: '15% discount on purchases',
      level: 75,
      icon: <DiscountIcon />,
      unlocked: currentRelationship >= 75,
      type: 'trade'
    },
    {
      description: 'Access to rare traits',
      level: 80,
      icon: <StarIcon />,
      unlocked: currentRelationship >= 80,
      type: 'trait'
    },
    {
      description: 'Special quests available',
      level: 90,
      icon: <HandshakeIcon />,
      unlocked: currentRelationship >= 90,
      type: 'quest'
    },
    {
      description: '20% discount on purchases',
      level: 100,
      icon: <DiscountIcon />,
      unlocked: currentRelationship >= 100,
      type: 'trade'
    }
  ];
  
  // Add NPC-specific benefits based on NPC type
  if (npcType === 'Merchant') {
    allBenefits.push({
      description: 'Access to special inventory',
      level: 70,
      icon: <LockOpenIcon />,
      unlocked: currentRelationship >= 70,
      type: 'trade'
    });
  } else if (npcType === 'Sage' || npcType === 'Mentor') {
    allBenefits.push({
      description: 'Access to legendary traits',
      level: 90,
      icon: <StarIcon />,
      unlocked: currentRelationship >= 90,
      type: 'trait'
    });
  }
  
  // Filter benefits by type if specified
  let benefits = allBenefits;
  if (benefitType) {
    benefits = benefits.filter(b => b.type === benefitType);
  }
  
  // Filter by unlocked status if needed
  if (showOnlyUnlocked) {
    benefits = benefits.filter(b => b.unlocked);
  }
  
  // Sort by level
  benefits.sort((a, b) => a.level - b.level);
  
  return (
    <Box>
      {!compact && (
        <Typography variant="subtitle1" gutterBottom>
          <HandshakeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Relationship Benefits
        </Typography>
      )}
      
      <Paper sx={{ p: compact ? 1 : 2, bgcolor: 'background.paper' }}>
        {benefits.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1, textAlign: 'center' }}>
            No benefits to display
          </Typography>
        ) : (
          <List dense={compact}>
            {benefits.map((benefit, index) => (
              <React.Fragment key={`${benefit.level}-${benefit.description}`}>
                <ListItem sx={{ py: compact ? 0.5 : 1 }}>
                  <ListItemIcon sx={{ minWidth: compact ? 36 : 56 }}>
                    {benefit.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={benefit.description} 
                    secondary={compact ? null : (
                      <Typography variant="caption">
                        Requires: {benefit.level} relationship
                      </Typography>
                    )}
                    primaryTypographyProps={{
                      variant: compact ? 'body2' : 'body1',
                      color: benefit.unlocked ? 'text.primary' : 'text.secondary'
                    }}
                  />
                  <Chip 
                    size="small"
                    label={benefit.unlocked ? "Unlocked" : `${benefit.level} Required`}
                    color={benefit.unlocked ? "success" : "default"}
                    variant={benefit.unlocked ? "filled" : "outlined"}
                  />
                </ListItem>
                {index < benefits.length - 1 && !compact && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default RelationshipBenefits;
