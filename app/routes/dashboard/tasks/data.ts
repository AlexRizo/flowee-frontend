import { Status } from "~/services/interfaces/tasks-service.interface";

interface Column {
  id: Status;
  name: string;
  color: string;
}

export const columns: Column[] = [
  {
    id: Status.AWAIT,
    name: "En espera",
    color: "gray",
  },
  {
    id: Status.ATTENTION,
    name: "En atención",
    color: "blue",
  },
  {
    id: Status.IN_PROGRESS,
    name: "En proceso",
    color: "purple",
  },
  {
    id: Status.REVIEW,
    name: "En revisión",
    color: "yellow",
  },
  {
    id: Status.DONE,
    name: "Finalizado",
    color: "green",
  },
];