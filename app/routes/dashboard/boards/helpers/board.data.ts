import { Status } from "~/services/interfaces/boards-service.interface";
import type { Column } from "../interfaces/board.interfaces";

export const columns: Column[] = [
  {
    id: Status.AWAIT,
    name: "En espera",
    color: "gray",
  },
  {
    id: Status.ATTENTION,
    name: "Atención",
    color: "amber",
  },
  {
    id: Status.IN_PROGRESS,
    name: "En proceso",
    color: "blue",
  },
  {
    id: Status.REVIEW,
    name: "En revisión",
    color: "purple",
  },
  {
    id: Status.DONE,
    name: "Finalizado",
    color: "emerald",
  },
]