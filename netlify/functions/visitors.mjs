import { incrementVisitorCount } from '../../../server/visitorStore.mjs';

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        Allow: 'GET',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const value = await incrementVisitorCount();
    return {
      statusCode: 200,
      body: JSON.stringify({ value }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Unable to update visitor count.',
        message: error.message,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}
