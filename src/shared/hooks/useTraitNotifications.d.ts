interface TraitNotification {
  notification: string | null;
  hideNotification: () => void;
  notifyXPBonus: (baseXP: number) => void;
  notifyShopDiscount: (originalPrice: number) => void;
  showNotification: (effect: string) => void;
}

/**
 * Custom hook for managing trait-related notifications and effects
 * 
 * @returns Object containing notification state and notification functions
 */
declare function useTraitNotifications(): TraitNotification;

export default useTraitNotifications;
