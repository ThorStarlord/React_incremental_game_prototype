import { useState, useCallback, useContext, useEffect } from 'react';
import { GameStateContext } from '../../context/GameStateContext';
import useTraitEffects from './useTraitEffects';

const useTraitNotifications = () => {
  const [notification, setNotification] = useState(null);
  const { activeEffects } = useTraitEffects();
  const { player } = useContext(GameStateContext);

  const showNotification = useCallback((effect) => {
    setNotification(effect);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Example trigger for XP gain notification
  const notifyXPBonus = useCallback((baseXP) => {
    if (!activeEffects) return;

    const { xpMultiplier } = activeEffects.reduce((acc, effect) => {
      if (effect?.id === 'QuickLearner') {
        acc.xpMultiplier += 0.1;
      }
      return acc;
    }, { xpMultiplier: 1 });

    if (xpMultiplier > 1) {
      const bonus = Math.floor(baseXP * (xpMultiplier - 1));
      showNotification(`Quick Learner: +${bonus} bonus XP`);
    }
  }, [activeEffects, showNotification]);

  // Example trigger for shop discount notification
  const notifyShopDiscount = useCallback((originalPrice) => {
    if (!activeEffects) return;

    const { shopDiscount } = activeEffects.reduce((acc, effect) => {
      if (effect?.id === 'BargainingMaster') {
        acc.shopDiscount += 0.05;
      }
      return acc;
    }, { shopDiscount: 0 });

    if (shopDiscount > 0) {
      const discount = Math.floor(originalPrice * shopDiscount);
      showNotification(`Bargaining Master: ${discount} gold saved`);
    }
  }, [activeEffects, showNotification]);

  return {
    notification,
    hideNotification,
    notifyXPBonus,
    notifyShopDiscount,
    showNotification
  };
};

export default useTraitNotifications;