import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Priority, Status, Type } from "~/services/interfaces/tasks-service.interface";

export const getTaskPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.LOW:
      return "low-flag";
    case Priority.NORMAL:
      return "normal-flag";
    case Priority.HIGH:
      return "high-flag";
    case Priority.URGENT:
      return "urgent-flag";
  }
};

export const getTaskStatusColor = (status: Status) => {
  switch (status) {
    case Status.AWAIT:
      return "status-await";
    case Status.ATTENTION:
      return "status-attention";
    case Status.IN_PROGRESS:
      return "status-in-progress";
    case Status.REVIEW:
      return "status-review";
    case Status.DONE:
      return "status-done";
  }
}

export const getTaskDate = (date: string, formatDate?: string) => {
  const newDate = new Date(date);
  return format(newDate, formatDate || "dd/MM/yyyy hh:mm aaaa", { locale: es });
}

export const getTaskType = (type: Type) => {
  switch (type) {
    case Type.PRINT:
      return "Impresión";
    case Type.DIGITAL:
      return "Digital";
    case Type.ECOMMERCE:
      return "Ecommerce";
    case Type.SPECIAL:
      return "Especial";
  }
}

export const getTaskPriority = (priority: Priority) => {
  switch (priority) {
    case Priority.LOW:
      return "Baja";
    case Priority.NORMAL:
      return "Normal";
    case Priority.HIGH:
      return "Alta";
    case Priority.URGENT:
      return "Urgente";
  }
}

export const getTaskStatus = (status: Status) => {
  switch (status) {
    case Status.AWAIT:
      return "En espera";
    case Status.ATTENTION:
      return "Requiere atención";
    case Status.IN_PROGRESS:
      return "En proceso";
    case Status.REVIEW:
      return "En revisión";
    case Status.DONE:
      return "Completada";
  }
}