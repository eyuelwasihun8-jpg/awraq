import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';

interface ThemeToggleProps {
  isTransparent?: boolean;
  variant?: 'default' | 'compact';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isTransparent = false,
  variant = 'default'
}) => {
  const { theme, toggleTheme } = useTheme();

  const buttonStyles = `
    relative p-2 rounded-xl transition-all cursor-pointer no-min-touch
    ${variant === 'compact' ? 'w-10 h-10' : 'w-11 h-11'}
    ${isTransparent
      ? 'text-white hover:bg-white/10'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }
  `;

  const iconStyles = 'w-5 h-5 transition-opacity duration-300';

  return (
    <button
      onClick={toggleTheme}
      className={buttonStyles}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {/* Sun icon - visible in light mode */}
      <Sun
        className={`${iconStyles} ${theme === 'light' ? 'opacity-100' : 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0'}`}
        aria-hidden="true"
      />
      {/* Moon icon - visible in dark mode */}
      <Moon
        className={`${iconStyles} ${theme === 'dark' ? 'opacity-100' : 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0'}`}
        aria-hidden="true"
      />
    </button>
  );
};