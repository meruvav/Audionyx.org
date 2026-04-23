import { useEffect, useState } from 'react';

const STORAGE_KEY = 'audionyx-theme-mode';

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode) {
  const resolvedTheme = mode === 'system' ? getSystemTheme() : mode;
  document.documentElement.dataset.theme = resolvedTheme;
}

export default function ThemeModeSelect() {
  const [mode, setMode] = useState('system');

  useEffect(() => {
    const savedMode = window.localStorage.getItem(STORAGE_KEY) || 'system';
    setMode(savedMode);
    applyTheme(savedMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if ((window.localStorage.getItem(STORAGE_KEY) || 'system') === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  function handleChange(event) {
    const nextMode = event.target.value;
    setMode(nextMode);
    window.localStorage.setItem(STORAGE_KEY, nextMode);
    applyTheme(nextMode);
  }

  return (
    <div className="theme-mode" role="group" aria-label="Color mode">
      <span>Color mode</span>
      <div className="theme-mode-toggle">
        {[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'system', label: 'System' },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            className={`theme-toggle-btn${mode === option.value ? ' active' : ''}`}
            onClick={() => handleChange({ target: { value: option.value } })}
            aria-pressed={mode === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
