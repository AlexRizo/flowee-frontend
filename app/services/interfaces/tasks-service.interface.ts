import type { Board } from "./boards-service.interface";
import type { User } from "./users-service.interface";

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum Type {
  PRINT = 'PRINT',
  DIGITAL = 'DIGITAL',
  ECOMMERCE = 'ECOMMERCE',
  SPECIAL = 'SPECIAL',
}

export enum Status {
  AWAIT = 'AWAIT',
  ATTENTION = 'ATTENTION',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export type RestResponse = Task[] | RestErrorResponse;

export interface RestErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface SpecialTask {
  // idea: string;
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
  assignedTo?: User;
  board: Board;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  specialTask?: SpecialTask;
  digitalTask?: DigitalTask;
  printTask?: PrintTask;
  ecommerceTask?: EcommerceTask;
}

export interface CreateSpecialTaskResponse {
  message: string;
  error?: string;
  statusCode: number;
  task: Task | null;
  filesResponse?: {
    message: string;
  }
}

export interface TaskFile {
  id: string;
  name: string;
  public_id: string;
  url: string;
  type: 'reference' | 'include';
  task: Task;
}

export interface TaskFiles {
  referenceFiles?: TaskFile[];
  includeFiles?: TaskFile[];
  message?: string;
}