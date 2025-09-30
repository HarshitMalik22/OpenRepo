import { NextApiRequest, NextApiResponse } from 'next';
import { setupWebSocket } from '@/lib/websocket-manager';

// WebSocket API route for Next.js
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    setupWebSocket(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Disable body parsing for WebSocket upgrade
export const config = {
  api: {
    bodyParser: false,
  },
};
