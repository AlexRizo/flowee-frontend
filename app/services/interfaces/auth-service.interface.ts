export interface LoginResponse {
  user?: {
    id: string;
    name: string;
    email: string;
    nickname: string;
    avatar: string | null;
  };
  message?: string | string[];
  error?: string;
  statusCode?: number;
}