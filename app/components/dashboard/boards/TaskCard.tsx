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
        <span style={{ backgroundColor: board.color }} className="font-semibold text-xs size-5 place-objects-center rounded">{ board.prefix }</span>
        <CardTooltip text={author.name}>
          <img src={'/images/default-user.webp'} alt={'Avatar'} className="size-5 rounded" />
        </CardTooltip>
        <CardTooltip text={createdAt}>
          <span className="rounded bg-gray-200 place-objects-center size-5">
            <CalendarPlus size={17} />
          </span>
        </CardTooltip>
        <CardTooltip text={type}>
          <span className="rounded bg-gray-100 place-objects-center size-5">
            <TaskTypeIcon name={ type } size={17} />
          </span>
        </CardTooltip>

        <span className="text-xs place-objects-center ml-auto">
          <Flag size={17}/>
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
