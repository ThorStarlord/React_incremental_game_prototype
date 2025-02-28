// This file contains utility functions for managing theme-related functionality in the application.

import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export const useThemeUtils = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return {
        theme,
        toggleTheme,
    };
};