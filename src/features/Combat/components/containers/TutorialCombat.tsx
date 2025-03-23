import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Alert,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useGameState, useGameDispatch } from '../../../../context/GameStateExports';

/**
 * Interface for Monster in tutorial
 */
interface Monster {
  name: string;
  description: string;
  image: string;
  health: number;
  attackPower: number;
}

/**
 * Interface for Trait
 */
interface Trait {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

/**
 * Interface for Game State
 */
interface GameState {
  player: {
    acquiredTraits: string[];
    equippedTraits: string[];
    [key: string]: any;
  };
  tutorial?: {
    active: boolean;
    step: string;
    requiredTraitId: string;
    [key: string]: any;
  };
  traits?: {
    copyableTraits: {
      [key: string]: Trait;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Interface for Combat Log Entry
 */
interface CombatLogEntry {
  action: string;
  result: string;
  turn: number;
}

/**
 * TutorialCombat component
 * 
 * Provides a guided introduction to the combat system for new players
 * 
 * @returns {React.ReactElement} The tutorial combat component
 */
const TutorialCombat: React.FC = (): React.ReactElement => {
  const gameState = useGameState() as GameState;
  const { player, tutorial, traits } = gameState;
  const dispatch = useGameDispatch();
  const navigate = useNavigate();
  
  // Local state
  const [playerHealth, setPlayerHealth] = useState<number>(100);
  const [monsterHealth, setMonsterHealth] = useState<number>(100);
  const [combatLog, setCombatLog] = useState<CombatLogEntry[]>([]);
  const [combatTurn, setCombatTurn] = useState<number>(0);
  const [combatEnded, setCombatEnded] = useState<boolean>(false);
  const [showVictoryDialog, setShowVictoryDialog] = useState<boolean>(false);
  
  // Tutorial monster
  const monster: Monster = {
    name: "Skittering Crawler",
    description: "A large insect with menacing pincers. It seems weak to direct attacks.",
    image: "🦂", // You could use an actual image path here
    health: 50,
    attackPower: 5
  };
  
  // Check if player has the necessary trait
  const tutorialTraitId = tutorial?.requiredTraitId;
  const hasTutorialTrait = player.acquiredTraits?.includes(tutorialTraitId || '');
  const equippedTraits = player.equippedTraits || [];
  const hasTraitEquipped = equippedTraits.includes(tutorialTraitId || '');
  
  // Get trait details
  const tutorialTrait = traits?.copyableTraits?.[tutorialTraitId || ''];
  
  // Combat functions
  const attackMonster = (): void => {
    let damage: number = 10; // Base damage
    let message: string = "You strike the monster!";
    
    // Bonus damage if the tutorial trait is equipped
    if (hasTraitEquipped) {
      damage *= 2;
      message = `You use ${tutorialTrait?.name} for a powerful attack!`;
    }
    
    const newMonsterHealth = Math.max(0, monsterHealth - damage);
    setMonsterHealth(newMonsterHealth);
    addToCombatLog(message, `Damage: ${damage}`);
    
    if (newMonsterHealth <= 0) {
      endCombat(true);
      return;
    }
    
    // Monster's turn
    setTimeout(monsterAttack, 1000);
  };
  
  const monsterAttack = (): void => {
    const damage = monster.attackPower;
    const newPlayerHealth = Math.max(0, playerHealth - damage);
    setPlayerHealth(newPlayerHealth);
    addToCombatLog("The monster attacks!", `You take ${damage} damage`);
    
    setCombatTurn(prev => prev + 1);
    
    if (newPlayerHealth <= 0) {
      endCombat(false);
    }
  };
  
  const equipTrait = (): void => {
    if (hasTutorialTrait && !hasTraitEquipped) {
      dispatch({
        type: 'EQUIP_TRAIT',
        payload: { traitId: tutorialTraitId, slotIndex: 0 }
      });
      addToCombatLog(`You equipped ${tutorialTrait?.name}!`, "Ready to fight!");
    }
  };
  
  const addToCombatLog = (action: string, result: string): void => {
    setCombatLog(prev => [
      { action, result, turn: combatTurn },
      ...prev
    ].slice(0, 10)); // Keep only last 10 entries
  };
  
  const endCombat = (victory: boolean): void => {
    setCombatEnded(true);
    
    if (victory) {
      setShowVictoryDialog(true);
      
      // Complete tutorial step if active
      if (tutorial?.active && tutorial.step === 'findFirstMonster') {
        dispatch({
          type: 'TUTORIAL_PROGRESS',
          payload: { step: 'findFirstMonster', completed: true }
        });
        
        // Complete tutorial
        dispatch({
          type: 'COMPLETE_TUTORIAL',
          payload: {} // Add empty payload to match GameAction type requirement
        });
        
        // Give rewards
        dispatch({
          type: 'ADD_ESSENCE',
          payload: 100
        });
      }
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Combat Encounter
      </Typography>
      
      {/* Combat area */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Player section */}
          <Grid item xs={5}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  You
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Health
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={playerHealth} 
                    sx={{ height: 10, borderRadius: 1 }}
                    color={playerHealth > 50 ? "success" : playerHealth > 25 ? "warning" : "error"}
                  />
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {playerHealth}/100
                  </Typography>
                </Box>
                
                {/* Equipped traits */}
                <Typography variant="body2" gutterBottom>
                  Equipped Traits
                </Typography>
                {hasTraitEquipped ? (
                  <Chip 
                    icon={<AutoFixHighIcon />}
                    label={tutorialTrait?.name || "Combat Trait"} 
                    color="secondary"
                    sx={{ mb: 1 }}
                  />
                ) : hasTutorialTrait ? (
                  <Button 
                    variant="outlined" 
                    color="secondary"
                    size="small"
                    startIcon={<AutoFixHighIcon />}
                    onClick={equipTrait}
                    sx={{ mb: 1 }}
                  >
                    Equip {tutorialTrait?.name}
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No combat traits equipped
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* VS */}
          <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4">VS</Typography>
          </Grid>
          
          {/* Monster section */}
          <Grid item xs={5}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {monster.name}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Health
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={monsterHealth} 
                    sx={{ height: 10, borderRadius: 1 }}
                    color="error"
                  />
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {monsterHealth}/100
                  </Typography>
                </Box>
                
                <Typography variant="body2">
                  {monster.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Combat actions */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            size="large"
            disabled={combatEnded}
            onClick={attackMonster}
          >
            Attack
          </Button>
          
          <Button 
            variant="outlined"
            disabled={combatEnded}
            onClick={() => {
              navigate(-1);
            }}
          >
            Flee
          </Button>
        </Box>
      </Paper>
      
      {/* Combat tutorial */}
      {tutorial?.active && tutorial.step === 'findFirstMonster' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1">
            Your first combat! Use your newly acquired trait to defeat the monster.
          </Typography>
          {!hasTraitEquipped && hasTutorialTrait && (
            <Button 
              color="info"
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
              onClick={equipTrait}
            >
              Equip Combat Trait
            </Button>
          )}
        </Alert>
      )}
      
      {/* Combat log */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Combat Log
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {combatLog.length > 0 ? (
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {combatLog.map((entry, index) => (
              <Box key={index} sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Turn {entry.turn}: {entry.action}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {entry.result}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No actions yet.
          </Typography>
        )}
      </Paper>
      
      {/* Victory Dialog */}
      <Dialog 
        open={showVictoryDialog}
        onClose={() => setShowVictoryDialog(false)}
      >
        <DialogTitle>Victory!</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            You've defeated the {monster.name}!
          </Typography>
          <Typography variant="body2" paragraph>
            You've learned the basics of combat and trait usage. This will serve you well on your journey.
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Rewards:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Chip label="100 Essence" color="primary" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setShowVictoryDialog(false);
              navigate('/');
            }}
            variant="contained"
          >
            Continue Your Journey
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TutorialCombat;
