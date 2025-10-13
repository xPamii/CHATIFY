export interface User {
  id: number;
  firstName: string;
  lastName: string;
  countryCode: string;
  contactNo: string;
  profileImage?: string;
  createdAt:string;
  updatedAt:string;
  status:string;
}
export interface Chat {
  id:number;
  friendId: number;
  friendName:string;
  friendFirstName:string;
  lastMessage: string;
  lastTimeStamp:string;
  unreadCount:number;
  profileImage:string;
  from: User;
  to: User;
  createdAt: string;
  updatedAt: string;
  status: string;
  message:string;
}
export interface WSRequest {
  type: string;
  fromUserId?: number;
  toUserId?: number;
  message?: string;
}

export interface WSResponse {
  type: string;
  payload: any;
}
