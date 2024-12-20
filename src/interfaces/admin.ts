export interface LoginDto {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  roleId: string;
}

export interface JWTAuthResponse {
  accessToken: string;
  user: User;
}

export interface ApiResponse<T> {
  totalRecords: number;
  map(arg0: (item: any) => any): Record<string, any>[];
  code: number;
  message: string | null;
  data: T | null;
  success: boolean;
}
