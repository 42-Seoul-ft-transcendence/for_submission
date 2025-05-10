import { MatchesResponse } from '../types/MyMatch';

export const mockMatches: MatchesResponse = {
  matches: Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    myScore: Math.floor(Math.random() * 6),
    opponentScore: Math.floor(Math.random() * 6),
    isWinner: Math.random() > 0.5,
    opponentName: `opponent${i + 1}`,
    playedAt: `2025-04-${String(27 + (i % 5)).padStart(2, '0')}`,
  })),
  total: 18,
  page: 1,
  limit: 5,
  totalPages: Math.ceil(18 / 5), // = 4
};
