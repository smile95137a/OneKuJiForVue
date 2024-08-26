/// <reference types="vite/client" />
interface ApiResponse<T> {
  code: number;
  message: string;
  success: boolean;
  data: T;
}
