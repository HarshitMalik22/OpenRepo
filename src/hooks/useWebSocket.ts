'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { WebSocketEvents, WebSocketRooms } from '@/lib/websocket-manager';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  rooms?: string[];
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
  onRepositoryUpdate?: (data: any) => void;
  onCommunityStatsUpdate?: (data: any) => void;
  onRecommendationUpdate?: (data: any) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    autoConnect = true,
    rooms = [],
    onConnect,
    onDisconnect,
    onError,
    onRepositoryUpdate,
    onCommunityStatsUpdate,
    onRecommendationUpdate,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
      
      socketRef.current = io(baseUrl, {
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: reconnectDelay,
        reconnectionDelayMax: 10000,
      });

      const socket = socketRef.current;

      socket.on(WebSocketEvents.CONNECT, () => {
        console.log('🔗 WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        
        // Join specified rooms
        rooms.forEach(room => {
          socket.emit(WebSocketEvents.JOIN_ROOM, room);
        });

        onConnect?.();
      });

      socket.on(WebSocketEvents.DISCONNECT, () => {
        console.log('🔗 WebSocket disconnected');
        setIsConnected(false);
        onDisconnect?.();
      });

      socket.on(WebSocketEvents.ERROR, (message: any) => {
        console.error('❌ WebSocket error:', message);
        const errorMessage = message.data?.error || 'Unknown WebSocket error';
        setConnectionError(errorMessage);
        onError?.(errorMessage);
      });

      socket.on(WebSocketEvents.REPOSITORY_UPDATE, (message: any) => {
        console.log('📡 Repository update received:', message);
        onRepositoryUpdate?.(message.data);
      });

      socket.on(WebSocketEvents.COMMUNITY_STATS_UPDATE, (message: any) => {
        console.log('📡 Community stats update received:', message);
        onCommunityStatsUpdate?.(message.data);
      });

      socket.on(WebSocketEvents.RECOMMENDATION_UPDATE, (message: any) => {
        console.log('📡 Recommendation update received:', message);
        onRecommendationUpdate?.(message.data);
      });

    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      setConnectionError('Failed to initialize WebSocket connection');
      onError?.('Failed to initialize WebSocket connection');
    }
  }, [rooms, onConnect, onDisconnect, onError, onRepositoryUpdate, onCommunityStatsUpdate, onRecommendationUpdate]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(WebSocketEvents.JOIN_ROOM, roomId);
      console.log(`📡 Joined room: ${roomId}`);
    }
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(WebSocketEvents.LEAVE_ROOM, roomId);
      console.log(`📡 Left room: ${roomId}`);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Handle reconnection
  useEffect(() => {
    if (!isConnected && connectionError && reconnectAttemptsRef.current < maxReconnectAttempts) {
      const timer = setTimeout(() => {
        console.log(`🔄 Reconnection attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts}`);
        reconnectAttemptsRef.current++;
        connect();
      }, reconnectDelay);

      return () => clearTimeout(timer);
    }
  }, [isConnected, connectionError, connect]);

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    socket: socketRef.current,
  };
}

// Predefined hooks for specific use cases
export function useCommunityStatsWebSocket() {
  const [stats, setStats] = useState<any>(null);

  const { isConnected, connectionError, joinRoom } = useWebSocket({
    rooms: [WebSocketRooms.COMMUNITY_STATS],
    onCommunityStatsUpdate: (data) => {
      setStats(data.stats);
    },
  });

  return {
    stats,
    isConnected,
    connectionError,
  };
}

export function usePopularReposWebSocket() {
  const [repositories, setRepositories] = useState<any[]>([]);

  const { isConnected, connectionError, joinRoom } = useWebSocket({
    rooms: [WebSocketRooms.POPULAR_REPOS],
    onRepositoryUpdate: (data) => {
      if (data.updateType === 'new') {
        setRepositories(prev => [...prev, data.data]);
      } else {
        setRepositories(prev => 
          prev.map(repo => 
            repo.id === data.repositoryId 
              ? { ...repo, [data.updateType]: data.data }
              : repo
          )
        );
      }
    },
  });

  return {
    repositories,
    isConnected,
    connectionError,
  };
}

export function useRecommendationsWebSocket(userId?: string, preferencesHash?: string) {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const roomId = userId && preferencesHash 
    ? `${WebSocketRooms.USER_RECOMMENDATIONS}${userId}:${preferencesHash}`
    : undefined;

  const { isConnected, connectionError, joinRoom } = useWebSocket({
    rooms: roomId ? [roomId] : [],
    onRecommendationUpdate: (data) => {
      setRecommendations(data.repositories);
    },
  });

  return {
    recommendations,
    isConnected,
    connectionError,
    joinRoom: roomId ? () => joinRoom(roomId) : undefined,
  };
}
