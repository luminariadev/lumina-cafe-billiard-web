'use client';

import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-800 focus:outline-none"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0N0 0013.293 17.293z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.45 4.54a1 1 0 01-1.414 0l-.707-.707a1 1 0 010-1.414l.707-.707a1 1 0 011.414 0l.707.707a1 1 0 010 1.414l-.707.707zm2.46-2.46a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414 0l-.707-.707a1 1 0 010-1.414l.707-.707a1 1 0 011.414 0l.707.707zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm-.707-3.293a1 1 0 010-1.414l.707-.707a1 1 0 011.414 0l.707.707a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414 0l-.707-.707zm14.14 0a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414 0l-.707-.707a1 1 0 010-1.414l.707-.707a1 1 0 011.414 0l.707.707zM10 15a1 1 0 01-1 1v1a1 1 0 112 0v-1a1 1 0 01-1-1zm-3.293-9.707a1 1 0 011.414 0l.707.707a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414 0l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
