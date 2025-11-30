import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector = ({ compact = false }) => {
  const { themeId, setTheme } = useTheme();
  const isDark = themeId === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </motion.div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all"
      style={{ color: 'var(--text-secondary)' }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </motion.div>
      <span className="font-medium flex-1 text-left">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  );
};

export default ThemeSelector;
