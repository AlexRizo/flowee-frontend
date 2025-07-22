import type { Status, Task } from "~/services/interfaces/boards-service.interface";

export interface Column {
  id: Status;
  name: string;
  color: string;
}