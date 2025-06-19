import type { Board } from "./boards-service.interface";

export interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  roles: Roles[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  boards?: Board[];
}

export interface UpdateUser {
  name?: string;
  nickname?: string;
  email?: string;
  roles?: Roles[];
  isActive?: string;
  boards?: Board[];
}

export interface CreateUser {
  name: string;
  nickname: string;
  email: string;
  password: string;
  roles: Roles[];
}

export interface UsersResponse {
  users?: User[];
  error?: string;
  statusCode?: number;
  message?: string | string[];
}

export interface UserResponse {
  user?: User;
  error?: string;
  statusCode?: number;
  message?: string;
}

export enum Roles {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  PUBLISHER = 'publisher',
  DESIGNER = 'designer',
  DESIGN_MANAGER = 'design_manager',
  PUBLISHER_MANAGER = 'publisher_manager',
  READER = 'reader',
}

export interface CreateUserResponse {
  user?: User;
  error?: string;
  statusCode?: number;
  message: string | string[];
}

export interface UpdateUserResponse {
  user?: User;
  message: string | string[];
  error?: string;
  statusCode?: number;
}

export const roles = [
  {
    label: "Administrador",
    value: Roles.ADMIN,
  },
  {
    label: "Super administrador",
    value: Roles.SUPER_ADMIN,
  },
  {
    label: "Publicador",
    value: Roles.PUBLISHER,
  },
  {
    label: "Diseñador",
    value: Roles.DESIGNER,
  },
  {
    label: "Gestor de diseño",
    value: Roles.DESIGN_MANAGER,
  },
  {
    label: "Gestor de publicaciones",
    value: Roles.PUBLISHER_MANAGER,
  },
  {
    label: "Lector",
    value: Roles.READER,
  },
];