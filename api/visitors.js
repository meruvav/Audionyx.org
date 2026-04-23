import { incrementVisitorCount } from '../server/visitorStore.mjs';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const value = await incrementVisitorCount();
    return response.status(200).json({ value });
  } catch (error) {
    return response.status(500).json({
      error: 'Unable to update visitor count.',
      message: error.message,
    });
  }
}
