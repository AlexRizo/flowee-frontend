import type { Roles } from "./users-service.interface";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: Roles[];
  nickname: string;
  avatar: string | null;
}

export interface LoginResponse {
  user?: AuthUser;
  message?: string | string[];
  error?: string;
  statusCode?: number;
}