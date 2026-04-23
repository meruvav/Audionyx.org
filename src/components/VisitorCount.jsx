import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

function getCounterKey(pathname) {
  if (pathname === '/') {
    return 'home';
  }

  return pathname.replace(/^\/+/, '').replace(/[^a-z0-9-]/gi, '-').toLowerCase();
}

export default function VisitorCount() {
  const location = useLocation();
  const [count, setCount] = useState(null);
  const [error, setError] = useState(false);

  const counterKey = useMemo(() => getCounterKey(location.pathname), [location.pathname]);

  useEffect(() => {
    let cancelled = false;
    const sessionKey = `audionyx-visited:${counterKey}`;
    const endpoint = `https://api.countapi.xyz/hit/audionyx.org/${counterKey}`;
    const hasVisitedInSession = window.sessionStorage.getItem(sessionKey) === '1';

    async function loadCount() {
      try {
        const url = hasVisitedInSession
          ? `https://api.countapi.xyz/get/audionyx.org/${counterKey}`
          : endpoint;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Counter request failed with ${response.status}`);
        }

        const data = await response.json();

        if (!cancelled) {
          setCount(typeof data.value === 'number' ? data.value : null);
          setError(false);
          if (!hasVisitedInSession) {
            window.sessionStorage.setItem(sessionKey, '1');
          }
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      }
    }

    loadCount();

    return () => {
      cancelled = true;
    };
  }, [counterKey]);

  return (
    <footer className="visitor-count" aria-live="polite">
      <strong>Visitor count:</strong>{' '}
      {error ? 'Unavailable right now' : count === null ? 'Loading...' : count.toLocaleString()}
    </footer>
  );
}
