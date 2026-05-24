import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector = ({ compact = false }) => {
  const { themeId, cycleTheme, themes } = useTheme();
  const currentTheme = themes[themeId] || themes.teal;

  const toggleTheme = () => {
    cycleTheme();
  };

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-sm transition-colors hover:bg-surface-dark"
        style={{ color: 'var(--text-secondary)' }}
        title={`Switch theme from ${currentTheme.name}`}
      >
        <motion.div
          initial={false}
          animate={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <Palette className="w-5 h-5" />
        </motion.div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-all hover:bg-surface-dark"
      style={{ color: 'var(--text-secondary)' }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
      >
        <Palette className="w-4 h-4" />
      </motion.div>
      <span className="font-sans text-sm tracking-wide uppercase font-medium flex-1 text-left">{currentTheme.name}</span>
    </button>
  );
};

export default ThemeSelector;
