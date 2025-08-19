import {
  Calendar,
  Flag,
  RefreshCcwDot,
  Rocket,
  SquareUser,
  User,
} from "lucide-react";
import {
  LucideDynamicIcon,
  type IconName,
} from "~/components/LucideDynamicIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import {
  getTaskDate,
  getTaskPriority,
  getTaskPriorityColor,
  getTaskStatus,
  getTaskStatusColor,
} from "~/helpers/taskHelpers";
import { cn } from "~/lib/utils";
import type {
  Priority,
  Status,
  Task,
} from "~/services/interfaces/tasks-service.interface";

interface TaskParamItemProps {
  icon: IconName;
  label: string;
  value: string;
  type?: "string" | "status" | "avatar" | "priority";
  tooltip?: string;
}

const TaskParamItem = ({
  icon,
  label,
  value,
  type = "string",
  tooltip,
}: TaskParamItemProps) => {
  if (type === "avatar" && !tooltip) throw new Error("tooltip is required for avatar type");
  
  return (
    <div role="listitem" className="text-sm flex items-center">
      <span className="flex items-center gap-1 font-medium w-28">
        <LucideDynamicIcon name={icon} size={16} className="text-gray-500" /> {label} &nbsp;
      </span>
      <span className="flex items-center gap-1">
        {type === "string" && value}
        {type === "priority" && (
          <>
            <Flag
              size={16}
              className={getTaskPriorityColor(value as Priority)}
            />
            {getTaskPriority(value as Priority)}
          </>
        )}
        {type === "status" && (
          <>
            <span
              className={cn(
                `${getTaskStatusColor(value as Status)} w-1 h-3.5 rounded-full`
              )}
            ></span>
            {getTaskStatus(value as Status)}
          </>
        )}
        {type === "avatar" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <img
                src={value || "/images/default-user.webp"}
                alt="Avatar"
                className="size-5 rounded"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{ tooltip || "Sin asignar" }</p>
            </TooltipContent>
          </Tooltip>
        )}
      </span>
    </div>
  );
};

export const TaskParams = ({ task }: { task: Task }) => {
  return (
    <div className="flex justify-between">
      <div role="list" className="flex flex-col gap-3">
        <TaskParamItem
          icon="Calendar"
          label="Solicitado:"
          value={getTaskDate(task.createdAt, "LLLL dd, yyyy hh:mm a")}
        />
        <TaskParamItem
          icon="Rocket"
          label="Entrega:"
          value={getTaskDate(task.dueDate, "LLLL dd, yyyy hh:mm a")}
        />
        <TaskParamItem
          icon="RefreshCcwDot"
          label="Estado:"
          value={task.status}
          type="status"
        />
      </div>
      <div role="list" className="flex flex-col gap-3">
        <TaskParamItem
          icon="Flag"
          label="Prioridad:"
          value={task.priority}
          type="priority"
        />
        <TaskParamItem
          icon="SquareUser"
          label="Solicitante:"
          value={task.author?.avatar || ""}
          type="avatar"
          tooltip={task.author?.name || "Sin asignar"}
        />
        <TaskParamItem
          icon="SquareUser"
          label="Asignado a:"
          value={task.assignedTo?.avatar || ""}
          type="avatar"
          tooltip={task.assignedTo?.name || "Sin asignar"}
        />
      </div>
    </div>
  );
};
