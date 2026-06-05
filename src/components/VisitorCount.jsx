import { useEffect, useState } from 'react';

const COUNT_API_ENDPOINT = 'https://countapi.mileshilliard.com/api/v1/hit/audionyx_online_home_visitors';

export default function VisitorCount() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadCount() {
      try {
        const timeout = window.setTimeout(() => controller.abort(), 6000);
        const response = await fetch(COUNT_API_ENDPOINT, { signal: controller.signal });
        window.clearTimeout(timeout);

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
      controller.abort();
    };
  }, []);

  return (
    <footer className="visitor-count" aria-live="polite">
      <strong>Visitors:</strong>{' '}
      {error ? 'Count unavailable' : count === null ? 'Loading...' : count.toLocaleString()}
    </footer>
  );
}
