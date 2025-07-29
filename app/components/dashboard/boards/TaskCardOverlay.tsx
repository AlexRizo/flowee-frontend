import { type FC } from "react";
import type { Task } from "~/services/interfaces/boards-service.interface";
import { CardTooltip } from "./CardTooltip";
import { CalendarCheck, CalendarPlus, Flag, ListEnd, User } from "lucide-react";
import { TaskTypeIcon } from "./TaskTypeIcon";
import { getCapitalizedTaskProperty, getTaskPriorityColor } from "~/helpers/taskHelpers";

interface Props extends Task {
}

export const TaskCardOverlay: FC<Props> = ({
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
}) => {
  return (
    <div
      className="flex flex-col rounded-lg bg-white border border-violet-500 cursor-grabbing"
    >
      <header className="flex border-b border-gray-200 p-2 gap-1">
        <CardTooltip text={board.name} tooltipColor={board.color}>
          <span
            className="font-semibold text-white"
          >
            {board.prefix}
          </span>
        </CardTooltip>
        <CardTooltip text={author.name}>
          <img
            src={"/images/default-user.webp"}
            alt={"Avatar"}
            className="size-5 rounded"
          />
        </CardTooltip>
        <CardTooltip text={createdAt}>
          <CalendarPlus size={17} />
        </CardTooltip>
        <CardTooltip text={getCapitalizedTaskProperty(type)}>
          <TaskTypeIcon name={type} size={17} />
        </CardTooltip>

        <span className="text-xs place-objects-center ml-auto gap-0.5">
          <Flag size={14} className={getTaskPriorityColor(priority)} />
          { getCapitalizedTaskProperty(priority) }
        </span>
      </header>

      <div role="definition" className="p-2">
        <h3 className="text-xs font-semibold">{title}</h3>
        <p className="text-xs">{description}</p>
      </div>
      
      <footer className="flex p-2 border-t border-gray-200 gap-1">
        <CardTooltip text={assignedTo.name}>
          <img
            src={"/images/default-user.webp"}
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
          {dueDate}
        </span>
      </footer>
    </div>
  );
};
