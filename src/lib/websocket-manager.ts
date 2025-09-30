import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { Socket as NetSocket } from 'net';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: Server;
    };
  };
};

// WebSocket event types
export enum WebSocketEvents {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  REPOSITORY_UPDATE = 'repository_update',
  COMMUNITY_STATS_UPDATE = 'community_stats_update',
  RECOMMENDATION_UPDATE = 'recommendation_update',
  USER_ACTIVITY = 'user_activity',
  ERROR = 'error',
}

// Room types for different data streams
export enum WebSocketRooms {
  COMMUNITY_STATS = 'community_stats',
  POPULAR_REPOS = 'popular_repos',
  USER_RECOMMENDATIONS = 'user_recommendations:',
  REPOSITORY_UPDATES = 'repository_updates:',
}

// Message types
export interface WebSocketMessage {
  type: WebSocketEvents;
  data: any;
  timestamp: number;
  roomId?: string;
}

export interface RepositoryUpdateMessage {
  repositoryId: string;
  updateType: 'stars' | 'forks' | 'issues' | 'commits' | 'new';
  data: any;
}

export interface CommunityStatsUpdateMessage {
  stats: {
    totalQueries: number;
    totalUsers: number;
    activeRepositories: number;
    successfulContributions: number;
    averageSatisfaction: number;
  };
  lastUpdated: number;
}

export interface RecommendationUpdateMessage {
  userId?: string;
  preferencesHash: string;
  repositories: any[];
  updateReason: 'new_preferences' | 'new_repositories' | 'ml_update';
}

// Singleton WebSocket server manager
class WebSocketManager {
  private static instance: WebSocketManager;
  private io: Server | null = null;
  private connectedClients: Map<string, any> = new Map();
  private roomSubscriptions: Map<string, Set<string>> = new Map();

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  // Initialize WebSocket server
  initialize(server: any) {
    if (this.io) {
      console.warn('WebSocket server already initialized');
      return;
    }

    this.io = new Server(server, {
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

    this.setupEventHandlers();
    console.log('🔌 WebSocket server initialized');
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on(WebSocketEvents.CONNECT, (socket) => {
      console.log(`🔗 Client connected: ${socket.id}`);
      this.connectedClients.set(socket.id, socket);

      // Send welcome message
      socket.emit(WebSocketEvents.CONNECT, {
        message: 'Connected to OpenSauce real-time updates',
        timestamp: Date.now(),
      });

      // Handle room joining
      socket.on(WebSocketEvents.JOIN_ROOM, (roomId: string) => {
        this.joinRoom(socket, roomId);
      });

      // Handle room leaving
      socket.on(WebSocketEvents.LEAVE_ROOM, (roomId: string) => {
        this.leaveRoom(socket, roomId);
      });

      // Handle disconnection
      socket.on(WebSocketEvents.DISCONNECT, () => {
        console.log(`🔗 Client disconnected: ${socket.id}`);
        this.handleDisconnect(socket);
      });
    });
  }

  // Join a room
  private joinRoom(socket: any, roomId: string) {
    socket.join(roomId);
    
    if (!this.roomSubscriptions.has(roomId)) {
      this.roomSubscriptions.set(roomId, new Set());
    }
    this.roomSubscriptions.get(roomId)!.add(socket.id);
    
    console.log(`📡 Client ${socket.id} joined room: ${roomId}`);
    
    // Send confirmation
    socket.emit(WebSocketEvents.JOIN_ROOM, {
      roomId,
      message: `Joined room: ${roomId}`,
      timestamp: Date.now(),
    });
  }

  // Leave a room
  private leaveRoom(socket: any, roomId: string) {
    socket.leave(roomId);
    
    const subscriptions = this.roomSubscriptions.get(roomId);
    if (subscriptions) {
      subscriptions.delete(socket.id);
      if (subscriptions.size === 0) {
        this.roomSubscriptions.delete(roomId);
      }
    }
    
    console.log(`📡 Client ${socket.id} left room: ${roomId}`);
  }

  // Handle client disconnection
  private handleDisconnect(socket: any) {
    this.connectedClients.delete(socket.id);
    
    // Remove from all rooms
    for (const [roomId, subscriptions] of this.roomSubscriptions.entries()) {
      subscriptions.delete(socket.id);
      if (subscriptions.size === 0) {
        this.roomSubscriptions.delete(roomId);
      }
    }
  }

  // Broadcast repository update
  broadcastRepositoryUpdate(update: RepositoryUpdateMessage) {
    if (!this.io) return;

    const message: WebSocketMessage = {
      type: WebSocketEvents.REPOSITORY_UPDATE,
      data: update,
      timestamp: Date.now(),
      roomId: WebSocketRooms.POPULAR_REPOS,
    };

    this.io.to(WebSocketRooms.POPULAR_REPOS).emit(WebSocketEvents.REPOSITORY_UPDATE, message);
    console.log(`📡 Broadcasted repository update to ${this.getRoomSize(WebSocketRooms.POPULAR_REPOS)} clients`);
  }

  // Broadcast community stats update
  broadcastCommunityStatsUpdate(stats: CommunityStatsUpdateMessage) {
    if (!this.io) return;

    const message: WebSocketMessage = {
      type: WebSocketEvents.COMMUNITY_STATS_UPDATE,
      data: stats,
      timestamp: Date.now(),
      roomId: WebSocketRooms.COMMUNITY_STATS,
    };

    this.io.to(WebSocketRooms.COMMUNITY_STATS).emit(WebSocketEvents.COMMUNITY_STATS_UPDATE, message);
    console.log(`📡 Broadcasted community stats update to ${this.getRoomSize(WebSocketRooms.COMMUNITY_STATS)} clients`);
  }

  // Broadcast recommendation update
  broadcastRecommendationUpdate(update: RecommendationUpdateMessage) {
    if (!this.io) return;

    const roomId = WebSocketRooms.USER_RECOMMENDATIONS + (update.userId || 'anonymous') + ':' + update.preferencesHash;
    const message: WebSocketMessage = {
      type: WebSocketEvents.RECOMMENDATION_UPDATE,
      data: update,
      timestamp: Date.now(),
      roomId,
    };

    this.io.to(roomId).emit(WebSocketEvents.RECOMMENDATION_UPDATE, message);
    console.log(`📡 Broadcasted recommendation update to ${this.getRoomSize(roomId)} clients`);
  }

  // Send error to specific client
  sendError(clientId: string, error: string) {
    if (!this.io) return;

    const client = this.connectedClients.get(clientId);
    if (client) {
      const message: WebSocketMessage = {
        type: WebSocketEvents.ERROR,
        data: { error },
        timestamp: Date.now(),
      };

      client.emit(WebSocketEvents.ERROR, message);
    }
  }

  // Get room size
  private getRoomSize(roomId: string): number {
    return this.roomSubscriptions.get(roomId)?.size || 0;
  }

  // Get server statistics
  getStats() {
    return {
      connectedClients: this.connectedClients.size,
      activeRooms: this.roomSubscriptions.size,
      roomSizes: Object.fromEntries(
        Array.from(this.roomSubscriptions.entries()).map(([room, clients]) => [room, clients.size])
      ),
    };
  }

  // Close all connections
  close() {
    if (this.io) {
      this.io.close();
      this.io = null;
      this.connectedClients.clear();
      this.roomSubscriptions.clear();
      console.log('🔌 WebSocket server closed');
    }
  }
}

// Export singleton instance
export const websocketManager = WebSocketManager.getInstance();

// Next.js API route handler for WebSocket initialization
export function setupWebSocket(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket && res.socket.server && !res.socket.server.io) {
    console.log('🔌 Initializing WebSocket server...');
    websocketManager.initialize(res.socket.server);
    const io = websocketManager['io'];
    if (io) {
      res.socket.server.io = io;
    }
  }
  res.end();
}
