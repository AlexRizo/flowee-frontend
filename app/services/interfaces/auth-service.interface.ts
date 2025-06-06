export interface LoginResponse {
  user?: {
    id: string;
    name: string;
    email: string;
    nickname: string;
  };
  message?: string;
  error?: string;
  statusCode?: number;
}