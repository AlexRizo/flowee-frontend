import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Priority, Type } from "~/services/interfaces/tasks-service.interface";

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