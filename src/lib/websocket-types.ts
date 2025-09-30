// Client-safe WebSocket types and events

export interface WebSocketEvents {
  REPOSITORY_UPDATE: 'repository:update';
  COMMUNITY_STATS_UPDATE: 'community:stats:update';
  RECOMMENDATION_UPDATE: 'recommendation:update';
  CONNECT: 'connect';
  DISCONNECT: 'disconnect';
  ERROR: 'error';
  JOIN_ROOM: 'join:room';
  LEAVE_ROOM: 'leave:room';
}

export interface WebSocketRooms {
  REPOSITORIES: 'repositories';
  COMMUNITY_STATS: 'community:stats';
  RECOMMENDATIONS: 'recommendations';
  POPULAR_REPOS: 'popular:repos';
  USER_RECOMMENDATIONS: 'user:recommendations';
}

export const WebSocketEvents = {
  REPOSITORY_UPDATE: 'repository:update',
  COMMUNITY_STATS_UPDATE: 'community:stats:update',
  RECOMMENDATION_UPDATE: 'recommendation:update',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  JOIN_ROOM: 'join:room',
  LEAVE_ROOM: 'leave:room',
} as const;

export const WebSocketRooms = {
  REPOSITORIES: 'repositories',
  COMMUNITY_STATS: 'community:stats',
  RECOMMENDATIONS: 'recommendations',
  POPULAR_REPOS: 'popular:repos',
  USER_RECOMMENDATIONS: 'user:recommendations',
} as const;

export interface RepositoryUpdateData {
  repositories: any[];
  timestamp: number;
}

export interface CommunityStatsUpdateData {
  stats: any;
  timestamp: number;
}

export interface RecommendationUpdateData {
  recommendations: any[];
  timestamp: number;
}
