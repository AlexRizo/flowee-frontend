export interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  roles: Roles[];
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users?: User[];
  error?: string;
  statusCode?: number;
  message?: string | string[];
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