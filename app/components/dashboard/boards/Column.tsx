import { useMemo } from "react";
import { cn } from "~/lib/utils";
import type { Task } from "~/services/interfaces/boards-service.interface";

interface Props {
  id: string;
  name: string;
  tasks: Task[];
  color: string;
}

const colors = {
  red: "bg-red-50",
  blue: "bg-blue-50",
  green: "bg-green-50",
  yellow: "bg-yellow-50",
  purple: "bg-purple-50",
  gray: "bg-gray-100",
  orange: "bg-orange-50",
  pink: "bg-pink-50",
  teal: "bg-teal-50",
  indigo: "bg-indigo-50",
  cyan: "bg-cyan-50",
  lime: "bg-lime-50",
  emerald: "bg-emerald-50",
  sky: "bg-sky-50",
  amber: "bg-amber-50",
};

const columnPoint = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  gray: "bg-gray-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  teal: "bg-teal-500",
  indigo: "bg-indigo-500",
  cyan: "bg-cyan-500",
  lime: "bg-lime-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const Column = ({ id, name, tasks, color }: Props) => {
  const columnColor = useMemo(() => {
    return colors[color as keyof typeof colors];
  }, [color]);

  const columnPointColor = useMemo(() => {
    return columnPoint[color as keyof typeof columnPoint];
  }, [color]);

  return (
    <div
      role="columnheader"
      id={id}
      className={cn(columnColor, "flex flex-col rounded-lg p-3")}
    >
      <span className="flex items-center gap-2">
        <span className={cn(columnPointColor, "w-1 h-3/4 rounded-full")}></span>
        <p className="text-sm font-semibold text-zinc-700">{name}</p>{" "}
        <small className="text-xs text-gray-400">({tasks.length || 0})</small>
      </span>
    </div>
  );
};
