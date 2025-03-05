import React, { useEffect, useContext, useState } from 'react';
import { GameStateContext, GameDispatchContext } from '../../../context/GameStateContext';
import NewSlotAnimation from './NewSlotAnimation';
import { Snackbar, Alert } from '@mui/material';

/**
 * Interface for notification state
 */
interface NotificationState {
  severity: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

/**
 * Interface for trait slot upgrade action payload
 */
interface UpgradeTraitSlotsPayload {
  newTotal: number;
  reason: 'essence' | 'level';
}

/**
 * Progression component that handles player progression systems
 * Manages trait slot unlocks based on level and essence earned
 * 
 * @returns {JSX.Element} React component that manages progression
 */
const Progression: React.FC = (): JSX.Element => {
  const { player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const [newSlots, setNewSlots] = useState<number | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  // Track essence-based slot unlocks
  useEffect(() => {
    // Calculate slots based on total essence earned
    const totalSlots: number = Math.min(
      8, // Maximum slots cap
      3 + Math.floor(player.totalEssenceEarned / 1000) // 3 base slots + 1 per 1000 essence
    );
    
    // If we've unlocked new slots
    if (totalSlots > player.traitSlots) {
      // Dispatch the slot unlock action
      dispatch({ 
        type: 'UPGRADE_TRAIT_SLOTS', 
        payload: { 
          newTotal: totalSlots, 
          reason: 'essence' 
        } as UpgradeTraitSlotsPayload
      });
      
      // Show animation
      setNewSlots(totalSlots);
      
      // Record this event for analytics and player feedback
      setNotification({
        severity: 'success',
        message: `Trait Slot Unlocked! You now have ${totalSlots}/${8} trait slots.`
      });
      
      // Clear animation after 3 seconds
      setTimeout(() => setNewSlots(null), 3000);
    }
  }, [player.totalEssenceEarned, player.traitSlots, dispatch]);

  // Track level-based unlocks (separate from essence-based)
  useEffect(() => {
    // Level thresholds for unlocking slots (e.g., levels 5, 10, 15)
    const levelBasedSlots: number = Math.min(
      3, // Maximum level-based slots
      Math.floor((player.level - 5) / 5) + 1
    );
    
    if (player.level >= 5) {
      const totalFromLevel: number = 3 + levelBasedSlots;
      
      // Only update if level would give more slots than currently owned
      if (totalFromLevel > player.traitSlots) {
        dispatch({ 
          type: 'UPGRADE_TRAIT_SLOTS', 
          payload: { 
            newTotal: totalFromLevel, 
            reason: 'level' 
          } as UpgradeTraitSlotsPayload
        });
        
        setNewSlots(totalFromLevel);
        setNotification({
          severity: 'success',
          message: `Level ${player.level} reached! New trait slot unlocked!`
        });
        
        setTimeout(() => setNewSlots(null), 3000);
      }
    }
  }, [player.level, player.traitSlots, dispatch]);

  // Calculate progress toward next slot unlock
  const nextSlotEssenceThreshold: number = (Math.floor(player.traitSlots - 3) + 1) * 1000;
  const essenceProgress: number = player.totalEssenceEarned >= nextSlotEssenceThreshold
    ? 100
    : ((player.totalEssenceEarned % 1000) / 1000) * 100;

  return (
    <>
      {newSlots && <NewSlotAnimation newSlots={newSlots} />}
      
      <Snackbar
        open={notification !== null}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {notification && (
          <Alert 
            onClose={() => setNotification(null)} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default Progression;
