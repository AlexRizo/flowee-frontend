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

interface Props extends Task {
  activeTaskId?: string;
}

export const TaskCard: FC<Props> = ({
  id,
  title,
  description,
  priority,
  type,
  status,
  author,
  assignedTo,
  board,
  dueDate,
  createdAt,
  activeTaskId,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {activeTaskId === id ? (
        <BlankCard />
      ) : (
        <div className="flex flex-col justify-between rounded-lg h-37.5 bg-white border border-gray-200">
          <header className="flex border-b border-gray-200 p-2 gap-1">
            <CardTooltip text={board.name} tooltipColor={board.color}>
              <span className="font-semibold text-white">{board.prefix}</span>
            </CardTooltip>
            <CardTooltip text={author.name}>
              <img
                src={author.avatar || "/images/default-user.webp"}
                alt={"Avatar"}
                className="size-5 rounded"
              />
            </CardTooltip>
            <CardTooltip text={`Creada: ${ getTaskDate(createdAt) }`}>
              <CalendarPlus size={17} />
            </CardTooltip>
            <CardTooltip text={getTaskType(type)}>
              <TaskTypeIcon name={type} size={17} />
            </CardTooltip>

            <span className="text-xs place-objects-center ml-auto gap-0.5">
              <Flag size={14} className={getTaskPriorityColor(priority)} />
              {getTaskPriority(priority)}
            </span>
          </header>

          <div role="definition" className="p-2">
            <h3 className="text-xs font-semibold">{title}</h3>
            <p className="text-xs">{description}</p>
          </div>

          <footer className="flex p-2 border-t border-gray-200 gap-1">
            <CardTooltip text={assignedTo?.name || "Sin asignar"}>
              <img
                src={assignedTo?.avatar || "/images/default-user.webp"}
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
              {getTaskDate(dueDate, 'dd/MM hh:mm aaaa')}
            </span>
          </footer>
        </div>
      )}
    </div>
  );
};
