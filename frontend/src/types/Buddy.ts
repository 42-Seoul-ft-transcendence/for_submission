export type Buddy = {
  id: number;
  name: string;
  image: string;
  isOnline: boolean;
  lastSeen: string; // ISO 8601 날짜 문자열
};

export type BuddyListResponse = {
  friends: Buddy[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
