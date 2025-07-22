import type { FC } from "react";
import type { Task } from "~/services/interfaces/boards-service.interface";
import { CardTooltip } from "./CardTooltip";
import { CalendarCheck, CalendarPlus, Flag, ListEnd, User } from "lucide-react";
import { TaskTypeIcon } from "./TaskTypeIcon";

interface Props extends Task {}

export const TaskCard: FC<Props> = ({
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
      role="contentinfo"
      className="flex flex-col px-2 rounded-lg bg-white border border-gray-200"
    >
      <div role="heading" className="flex py-2">
        <span style={{ color: board.color }} className="font-semibold text-xs p-1 aspect-square rounded-xl">{ board.prefix }</span>
        <CardTooltip text={author.name}>
          <span><User/></span>
        </CardTooltip>
        <CardTooltip text={createdAt}>
          <span className="aspect-square rounded-xl bg-gray-100">
            <CalendarPlus/>
          </span>
        </CardTooltip>
        <CardTooltip text={type}>
          <span className="aspect-square rounded-xl bg-gray-100">
            <TaskTypeIcon type={type}/>
          </span>
        </CardTooltip>

        <span className="text-xs">
          <Flag/>
          { priority }
        </span>
      </div>
      <div role="definition">
        <h3 className="text-xs font-semibold">{ title }</h3>
        <p className="text-xs">{ description }</p>
      </div>
      <div className="flex py-2">
        <CardTooltip text={assignedTo.name}>
          <span className="aspect-square rounded-xl bg-gray-100">
            <User/>
          </span>
        </CardTooltip>
        <span className="text-xs flex items-center bg-gray-100 rounded-xl">
          <ListEnd/>
          10
        </span>
        <span>
          <CalendarCheck/>
          { dueDate }
        </span>
      </div>
    </div>
  );
};
