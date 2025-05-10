import { BuddyListResponse } from '../types/Buddy';

export const mockBuddyList: BuddyListResponse = {
  friends: [
    {
      id: 1,
      name: 'wonyocho',
      image: '', // 실제 동작 시 Placeholder로 fallback
      isOnline: true,
      lastSeen: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'jsuk',
      image: '',
      isOnline: false,
      lastSeen: new Date().toISOString(),
    },
  ],
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
};
