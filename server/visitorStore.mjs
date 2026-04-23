const COUNTER_KEY = 'site-total';

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const namespace = process.env.VISITOR_COUNTER_NAMESPACE || 'audionyx.org';

  if (!url || !token) {
    throw new Error(
      'Missing Redis REST credentials. Set KV_REST_API_URL/KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN.',
    );
  }

  return {
    namespace,
    token,
    url: url.replace(/\/+$/, ''),
  };
}

async function runRedisCommand(commandParts) {
  const { token, url } = getRedisConfig();
  const commandPath = commandParts.map((part) => encodeURIComponent(part)).join('/');
  const response = await fetch(`${url}/${commandPath}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Redis request failed with ${response.status}: ${body}`);
  }

  const data = await response.json();
  if (typeof data.result === 'undefined') {
    throw new Error('Redis response did not include a result value.');
  }

  return data.result;
}

export async function incrementVisitorCount() {
  const { namespace } = getRedisConfig();
  const key = `${namespace}:${COUNTER_KEY}`;
  const value = await runRedisCommand(['incr', key]);
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error('Visitor count response was not numeric.');
  }

  return parsed;
}
