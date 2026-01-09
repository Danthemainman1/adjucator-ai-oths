import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme definitions - Luxury Triad
export const THEMES = {
  light: {
    id: 'light',
    name: 'Gilded Light',
    icon: '⚜️',
    colors: {
      bgPrimary: '#FDFBF7', // Cream
      bgSecondary: '#FFFFFF',
      textPrimary: '#121212',
      textSecondary: '#525252',
      
      primary: '#C5A059', // Gold as primary interaction
      primaryHover: '#9F7D3D',
      
      // The Triad available as semnatics
      teal: '#0F4C5C',
      emerald: '#1B4D3E',
      red: '#722F37',
      
      border: '#E6C67E', // Gold border
      success: '#1B4D3E', // Emerald
      warning: '#C5A059', // Gold
      error: '#722F37', // Red
    }
  },
  dark: {
    id: 'dark',
    name: 'Gilded Dark',
    icon: '🌑',
    colors: {
      bgPrimary: '#0A0A0A',
      bgSecondary: '#121212',
      textPrimary: '#FDFBF7',
      textSecondary: '#A3A3A3',
      
      primary: '#D4AF37', // Metallic Gold
      primaryHover: '#C5A059',
      
      teal: '#2DD4BF', // Brightened for dark mode
      emerald: '#34D399',
      red: '#F87171',
      
      border: '#C5A059', // Gold
      success: '#34D399',
      warning: '#D4AF37',
      error: '#F87171',
    }
  }



};

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const theme = THEMES[themeId] || THEMES.dark;

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const colors = theme.colors;

    // Apply CSS custom properties
    root.style.setProperty('--bg-primary', colors.bgPrimary);
    root.style.setProperty('--bg-secondary', colors.bgSecondary);
    root.style.setProperty('--bg-tertiary', colors.bgTertiary);
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--text-muted', colors.textMuted);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-hover', colors.primaryHover);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--glass', colors.glass);
    root.style.setProperty('--card-bg', colors.cardBg);
    root.style.setProperty('--input-bg', colors.inputBg);
    root.style.setProperty('--success', colors.success);
    root.style.setProperty('--warning', colors.warning);
    root.style.setProperty('--error', colors.error);

    // Add theme class for additional styling
    root.className = `theme-${themeId}`;
    
    // Save to localStorage
    localStorage.setItem('theme', themeId);
  }, [themeId, theme]);

  const setTheme = (id) => {
    if (THEMES[id]) {
      setThemeId(id);
    }
  };

  const cycleTheme = () => {
    const themeIds = Object.keys(THEMES);
    const currentIndex = themeIds.indexOf(themeId);
    const nextIndex = (currentIndex + 1) % themeIds.length;
    setThemeId(themeIds[nextIndex]);
  };

  const value = {
    theme,
    themeId,
    setTheme,
    cycleTheme,
    themes: THEMES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
