export type RequestSender = {
  id: number;
  name: string;
  image: string;
};

export type FriendRequest = {
  id: number;
  sender: RequestSender;
  status: string;
  createdAt: string;
};

export type FriendRequestListResponse = {
  requests: FriendRequest[];
};
