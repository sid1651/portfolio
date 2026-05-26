import { useState, useEffect } from 'react';
import './ThemeToggle.css';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedTheme, setDisplayedTheme] = useState(theme);

  useEffect(() => {
    if (theme !== displayedTheme) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayedTheme(theme);
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [theme, displayedTheme]);

  const isDark = displayedTheme === 'dark';

  return (
    <button
      className="themeToggle-button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="themeToggle-iconWrap">
        {/* Current icon */}
        <svg
          className={`themeToggle-icon ${isAnimating ? 'themeToggle-icon--exiting' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isDark ? (
            /* Moon */
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          ) : (
            /* Sun */
            <>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </>
          )}
        </svg>

        {/* Incoming icon (shown briefly during animation) */}
        {isAnimating && (
          <svg
            className="themeToggle-icon themeToggle-icon--entering"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {!isDark ? (
              /* Moon is coming in */
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            ) : (
              /* Sun is coming in */
              <>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </>
            )}
          </svg>
        )}
      </span>
    </button>
  );
}
