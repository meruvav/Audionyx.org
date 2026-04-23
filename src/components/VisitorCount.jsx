import { useEffect, useState } from 'react';

export default function VisitorCount() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const endpoint = '/api/visitors';

    async function loadCount() {
      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Counter request failed with ${response.status}`);
        }

        const data = await response.json();

        if (!cancelled) {
          setCount(typeof data.value === 'number' ? data.value : null);
          setError(false);
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
      {error ? 'Counter setup needed' : count === null ? 'Loading...' : count.toLocaleString()}
    </footer>
  );
}
