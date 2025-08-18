import type { Task } from "~/services/interfaces/tasks-service.interface";
import { CardTooltip } from "./CardTooltip";
import { CalendarCheck, CalendarPlus, Flag, ListEnd } from "lucide-react";
import { TaskTypeIcon } from "./TaskTypeIcon";
import {
  getTaskDate,
  getTaskPriority,
  getTaskPriorityColor,
  getTaskType,
} from "~/helpers/taskHelpers";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BlankCard } from "./BlankCard";
import type { FC } from "react";

interface Props {
  task: Task;
  activeTaskId?: string;
}

export const AwaitTaskCard: FC<Props> = ({ task, activeTaskId }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {activeTaskId === task.id ? (
        <BlankCard />
      ) : (
        <div className="flex flex-col justify-between rounded-lg h-37.5 bg-white border border-gray-200 shadow-xs">
          <header className="flex border-b border-gray-200 p-2 gap-1">
            <CardTooltip text={task.board.name} tooltipColor={task.board.color}>
              <span className="font-semibold text-white">
                {task.board.prefix}
              </span>
            </CardTooltip>
            <CardTooltip text={task.author.name}>
              <img
                src={task.author.avatar || "/images/default-user.webp"}
                alt={"Avatar"}
                className="size-5 rounded"
              />
            </CardTooltip>
            <CardTooltip text={`Creada: ${getTaskDate(task.createdAt)}`}>
              <CalendarPlus size={17} />
            </CardTooltip>
            <CardTooltip text={getTaskType(task.type)}>
              <TaskTypeIcon name={task.type} size={17} />
            </CardTooltip>

            <span className="text-xs place-objects-center ml-auto gap-0.5">
              <Flag size={14} className={getTaskPriorityColor(task.priority)} />
              {getTaskPriority(task.priority)}
            </span>
          </header>

          <div className="p-2" {...attributes} {...listeners}>
            <h3 className="text-xs font-semibold">
              {task.title.length > 30
                ? task.title.slice(0, 30) + "..."
                : task.title}
            </h3>
            <p className="text-xs">
              {task.description.length > 65
                ? task.description.slice(0, 65) + "..."
                : task.description}
            </p>
          </div>

          <footer className="flex p-2 border-t border-gray-200 gap-1">
            <CardTooltip text={task.assignedTo?.name || "Sin asignar"}>
              <img
                src={task.assignedTo?.avatar || "/images/default-user.webp"}
                alt={"Avatar"}
                className="size-5 rounded"
              />
            </CardTooltip>
            <span className="text-xs flex items-center bg-gray-100 rounded h-5 px-1">
              <ListEnd size={17} />
              10
            </span>
            <span className="place-objects-center gap-1 text-xs ml-auto">
              <CalendarCheck size={17} />
              {getTaskDate(task.dueDate, "dd/MM hh:mm aaaa")}
            </span>
          </footer>
        </div>
      )}
    </div>
  );
};
