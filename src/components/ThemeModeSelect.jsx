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
    <label className="theme-mode">
      <span>Color mode</span>
      <select value={mode} onChange={handleChange} aria-label="Color mode">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </label>
  );
}
