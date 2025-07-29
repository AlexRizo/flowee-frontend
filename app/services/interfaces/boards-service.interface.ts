import type { User } from "./users-service.interface";

export interface Board {
  id: string;
  name: string;
  slug: string;
  prefix: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export enum Priority {
  LOW = 'BAJA',
  NORMAL = 'NORMAL',
  HIGH = 'ALTA',
  URGENT = 'URGENTE',
}

export enum Type {
  PRINT = 'IMPRESO',
  DIGITAL = 'DIGITAL',
  ECOMMERCE = 'ECOMMERCE',
  SPECIAL = 'ESPECIAL',
}

export enum Status {
  AWAIT = 'ESPERA',
  ATTENTION = 'ATENCION',
  IN_PROGRESS = 'EN_PROCESO',
  REVIEW = 'REVISION',
  DONE = 'FINALIZADO',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  type: Type;
  status: Status;
  author: User;
  assignedTo: User;
  board: Board;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface BoardsResponse extends RestResponse {
  boards?: Board[];
}

export interface BoardResponse extends RestResponse {
  board?: Board;
}

export interface BoardTasksResponse extends RestResponse {
  tasks?: Task[];
}