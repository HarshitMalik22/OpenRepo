import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import { Socket as NetSocket } from 'net';
import { websocketManager } from '@/lib/websocket-manager';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: ServerIO;
    };
  };
};

// WebSocket API route for Next.js
export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    // Socket.IO server is already initialized
    console.log('🔌 Socket.IO server already running');
  } else {
    // Initialize Socket.IO server
    console.log('🔌 Initializing Socket.IO server...');
    const io = new ServerIO(res.socket.server, {
      path: '/api/websocket',
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_BASE_URL 
          : ['http://localhost:3000', 'http://localhost:9002'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
    });
    
    // Store the Socket.IO server instance
    res.socket.server.io = io;
    
    // Set up event handlers using the websocket manager
    websocketManager.initialize(res.socket.server);
  }
  
  res.end();
}

// Disable body parsing for WebSocket upgrade
export const config = {
  api: {
    bodyParser: false,
  },
};
