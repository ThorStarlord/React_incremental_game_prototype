import { useTheme } from '@mui/material';

/**
 * Custom hook for theme-related utility functions
 */
const useThemeUtils = () => {
  const theme = useTheme();
  
  /**
   * Get appropriate color for health progress bar based on current health percentage
   * @param current Current health value
   * @param max Maximum health value
   * @returns Color for the progress bar
   */
  const getProgressColor = (current: number, max: number): string => {
    const healthPercentage = (current / max) * 100;
    
    if (healthPercentage <= 25) {
      return theme.palette.error.main;
    } else if (healthPercentage <= 50) {
      return theme.palette.warning.main;
    } else if (healthPercentage <= 75) {
      return theme.palette.success.light;
    } else {
      return theme.palette.success.main;
    }
  };
  
  return {
    theme,
    getProgressColor
  };
};

export default useThemeUtils;
