import type { Board } from "./boards-service.interface";
import type { User } from "./users-service.interface";

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

export type RestResponse = Task[] | RestErrorResponse;

export interface RestErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface SpecialTask {
  idea: string;
  sizes: string;
  legals: string;
}

export interface DigitalTask {}
export interface PrintTask {}
export interface EcommerceTask {}


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
  specialTask?: SpecialTask;
  digitalTask?: DigitalTask;
  printTask?: PrintTask;
  ecommerceTask?: EcommerceTask;
}