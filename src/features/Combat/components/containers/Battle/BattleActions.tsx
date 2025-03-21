import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
  Typography,
  Tooltip,
  Chip,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ActiveSkill } from '../../../../../context/types/combat';

interface BattleActionsProps {
  onAttack: () => void;
  onUseSkill: (skillId: string) => void;
  onUseItem: (itemId: string) => void;
  onDefend: () => void;
  onFlee: () => void;
  skills: ActiveSkill[];
  items: {
    id: string;
    name: string;
    effect: any;
    quantity: number;
  }[];
  isPlayerTurn: boolean;
  disabled: boolean;
}

// Styled action button
const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: 120,
  margin: theme.spacing(0.5),
}));

/**
 * BattleActions Component
 * 
 * Displays combat action buttons and manages skill/item selection UI.
 */
const BattleActions: React.FC<BattleActionsProps> = ({
  onAttack,
  onUseSkill,
  onUseItem,
  onDefend,
  onFlee,
  skills = [],
  items = [],
  isPlayerTurn,
  disabled
}) => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'skills':
        return (
          <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {skills.length === 0 ? (
              <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No skills available
              </Typography>
            ) : (
              skills.map(skill => (
                <Tooltip
                  key={skill.id}
                  title={
                    <React.Fragment>
                      <Typography variant="subtitle2">{skill.name}</Typography>
                      <Typography variant="body2">{skill.description}</Typography>
                      <Typography variant="caption">
                        Mana cost: {skill.manaCost || 0} | Cooldown: {skill.cooldown} turns
                      </Typography>
                    </React.Fragment>
                  }
                >
                  <span> {/* Wrapper needed for disabled Tooltip */}
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => onUseSkill(skill.id)}
                      disabled={disabled || skill.currentCooldown > 0}
                      sx={{ m: 0.5, position: 'relative' }}
                    >
                      {skill.name}
                      {skill.currentCooldown > 0 && (
                        <Chip
                          label={skill.currentCooldown}
                          size="small"
                          color="error"
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            height: 20,
                            minWidth: 20
                          }}
                        />
                      )}
                    </Button>
                  </span>
                </Tooltip>
              ))
            )}
          </Box>
        );
      
      case 'items':
        return (
          <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {items.length === 0 ? (
              <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No items available
              </Typography>
            ) : (
              items.map(item => (
                <Tooltip
                  key={item.id}
                  title={
                    <React.Fragment>
                      <Typography variant="subtitle2">{item.name}</Typography>
                      <Typography variant="caption">
                        Quantity: {item.quantity}
                      </Typography>
                    </React.Fragment>
                  }
                >
                  <span> {/* Wrapper needed for disabled Tooltip */}
                    <Badge badgeContent={item.quantity} color="primary">
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => onUseItem(item.id)}
                        disabled={disabled || item.quantity <= 0}
                        sx={{ m: 0.5 }}
                      >
                        {item.name}
                      </Button>
                    </Badge>
                  </span>
                </Tooltip>
              ))
            )}
          </Box>
        );
        
      default: // 'basic'
        return (
          <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            <ActionButton
              variant="contained"
              color="error"
              onClick={onAttack}
              disabled={disabled}
            >
              Attack
            </ActionButton>
            
            <ActionButton
              variant="contained"
              color="info"
              onClick={onDefend}
              disabled={disabled}
            >
              Defend
            </ActionButton>
            
            <ActionButton
              variant="outlined"
              color="warning"
              onClick={onFlee}
              disabled={disabled}
            >
              Flee
            </ActionButton>
          </Box>
        );
    }
  };
  
  return (
    <Paper variant="outlined" sx={{ mb: 2 }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Basic" value="basic" />
        <Tab 
          label={`Skills (${skills.length})`} 
          value="skills" 
          disabled={skills.length === 0} 
        />
        <Tab 
          label={`Items (${items.length})`} 
          value="items" 
          disabled={items.length === 0} 
        />
      </Tabs>
      
      {renderContent()}
    </Paper>
  );
};

export default BattleActions;
