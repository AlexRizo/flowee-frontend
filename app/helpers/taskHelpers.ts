import { Priority } from "~/services/interfaces/boards-service.interface";

export const getCapitalizedTaskProperty = (property: string) => {
  const propertyTransformed = property.toLowerCase();
  return propertyTransformed.charAt(0).toUpperCase() + propertyTransformed.slice(1);
};

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