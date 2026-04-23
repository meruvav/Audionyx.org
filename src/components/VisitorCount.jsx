import { useEffect, useState } from 'react';

const COUNTER_KEY = 'site-total';
const SESSION_KEY = 'audionyx-visited:site-total';

export default function VisitorCount() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const endpoint = `https://api.countapi.xyz/hit/audionyx.org/${COUNTER_KEY}`;
    const hasVisitedInSession = window.sessionStorage.getItem(SESSION_KEY) === '1';

    async function loadCount() {
      try {
        const url = hasVisitedInSession
          ? `https://api.countapi.xyz/get/audionyx.org/${COUNTER_KEY}`
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
            window.sessionStorage.setItem(SESSION_KEY, '1');
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
  }, []);

  return (
    <footer className="visitor-count" aria-live="polite">
      <strong>Total visitors:</strong>{' '}
      {error ? 'Unavailable right now' : count === null ? 'Loading...' : count.toLocaleString()}
    </footer>
  );
}
