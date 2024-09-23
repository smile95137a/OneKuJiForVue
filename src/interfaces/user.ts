export interface User {
    id: number;
    username: string;
    password?: string;
    nickname: string;
    email: string;
    phoneNumber: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    roleId: number;
    status: string;
    balance: number;
    bonus: number;
    sliverCoin: number;
    provider: string;
    roles: Role[];
  }
  
  export interface Role {
    id: number;
    name: string;
  }
  
  export interface UserReq {
    username: string;
    password: string;
    nickname: string;
    email: string;
    phoneNumber: string;
    address: string;
    roleId: number;
  }
  
  export interface ApiResponse<T> {
    code: number;
    message: string | null;
    data: T | null;
  }