import { processPoppyChat } from '../server/poppyAgent';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { message, history } = body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await processPoppyChat(message, history || []);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Vercel API chat error:', error);
    return res.status(200).json({
      text: "Thank you for reaching out to Falguni's Photography studio in Northfield. Which session type (Newborn, Maternity, Family, or Cake Smash) are you interested in booking, or what date do you prefer?",
      extracted: null,
      clientNotification: null
    });
  }
}
