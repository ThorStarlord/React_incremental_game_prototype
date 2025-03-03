import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export const useThemeUtils = () => {
  const theme = useTheme();
  const { darkMode } = useContext(ThemeContext);

  const getContrastText = (color) => {
    return theme.palette.getContrastText(color);
  };

  const getStateBasedColor = (normalColor, hoverColor) => {
    return {
      color: normalColor,
      '&:hover': {
        color: hoverColor,
      },
    };
  };

  const getProgressColor = (value, maxValue) => {
    const ratio = value / maxValue;
    if (ratio > 0.6) return theme.palette.success.main;
    if (ratio > 0.3) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getRegionColor = (regionType) => {
    const colors = {
      forest: darkMode ? '#2e7d32' : '#4CAF50',
      mountain: darkMode ? '#5d4037' : '#795548',
      desert: darkMode ? '#fdd835' : '#FFD700',
      default: theme.palette.grey[500]
    };
    return colors[regionType] || colors.default;
  };

  return {
    getContrastText,
    getStateBasedColor,
    getProgressColor,
    getRegionColor,
  };
};

export default useThemeUtils;