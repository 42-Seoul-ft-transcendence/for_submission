export type UserInfo = {
  id: number;
  name: string;
  image: string;
  twoFactorEnabled: boolean;
  wins: number;
  losses: number;
};

export type MatchInfo = {
  id: number;
  myScore: number;
  opponentScore: number;
  isWinner: boolean;
  opponentName: string;
  playedAt: string; // ISO string format
};

export type MatchesResponse = {
  matches: MatchInfo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
