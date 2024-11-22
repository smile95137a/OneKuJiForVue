export interface LoginDto {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  // 添加其他需要的用户属性
}

export interface JWTAuthResponse {
  accessToken: string;
  user: User;
}

export interface ApiResponse<T> {
  map(arg0: (item: any) => any): Record<string, any>[];
  code: number;
  message: string | null;
  data: T | null;
  success: boolean;
}