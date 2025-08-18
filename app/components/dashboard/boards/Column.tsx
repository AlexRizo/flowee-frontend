import { useMemo } from "react";
import { cn } from "~/lib/utils";
import type {
  Status,
  Task,
} from "~/services/interfaces/tasks-service.interface";
import { TaskCard } from "./TaskCard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { BlankCard } from "./BlankCard";
import { ProtectedItem } from "../auth/ProtectedItem";
import { Roles } from "~/services/interfaces/users-service.interface";

interface Props {
  id: Status;
  name: string;
  tasks: Task[];
  color: string;
  activeTask: Task | null;
  allowNewTask: boolean;
  over: any;
  setPreviewTask: (task: Task) => void;
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

export const Column = ({
  id,
  name,
  tasks,
  color,
  activeTask,
  allowNewTask = false,
  over,
  setPreviewTask,
}: Props) => {
  const columnColor = useMemo(() => {
    return colors[color as keyof typeof colors];
  }, [color]);

  const columnPointColor = useMemo(() => {
    return columnPoint[color as keyof typeof columnPoint];
  }, [color]);

  const tasksIds = useMemo<string[]>(
    () => tasks.map((task) => task.id),
    [tasks]
  );

  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      role="contentinfo"
      id={id}
      className={cn(columnColor, "flex flex-col rounded-lg p-3 h-min")}
    >
      <SortableContext
        items={tasksIds}
        id={id}
        strategy={verticalListSortingStrategy}
      >
        <header className="flex items-center gap-2 h-10">
          <span
            className={cn(columnPointColor, "w-1 h-3.5 rounded-full")}
          ></span>
          <p className="text-sm font-semibold text-zinc-700">{name}</p>{" "}
          <small className="text-xs text-gray-400">({tasks.length || 0})</small>
          {allowNewTask && (
            <ProtectedItem
              allowedRoles={[
                Roles.SUPER_ADMIN,
                Roles.ADMIN,
                Roles.DESIGN_MANAGER,
                Roles.PUBLISHER_MANAGER,
                Roles.PUBLISHER,
              ]}
            >
              <Link
                to={`/solicitudes/nueva-solicitud`}
                className="ml-auto text-xs bg-violet-700 text-white font-semibold p-1 rounded flex items-center gap-0.5"
              >
                <Plus size={14} />
                Nueva
              </Link>
            </ProtectedItem>
          )}
        </header>
        <div className="flex flex-col gap-2 max-h-[calc(100vh-10rem)] [scrollbar-width:none] overflow-y-auto">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} activeTaskId={activeTask?.id} setPreviewTask={setPreviewTask} />
          ))}
          {over?.active && over.column === id && <BlankCard />}
        </div>
      </SortableContext>
    </div>
  );
};
