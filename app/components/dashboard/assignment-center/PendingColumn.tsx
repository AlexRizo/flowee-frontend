import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Clock } from "lucide-react";
import type { Task } from "~/services/interfaces/tasks-service.interface";
import { AwaitTaskCard } from "../boards/AwaitTaskCard";

interface Props {
  pendingTasks: Task[];
  activeId?: string;
}

export const PendingColumn = ({ pendingTasks, activeId }: Props) => {
  const { setNodeRef } = useDroppable({ id: "AWAIT" });

  return (
    <div
      role="columnheader"
      id="centro-de-asignaciones"
      className="flex flex-col h-min w-63"
      ref={setNodeRef}
    >
      <header className="flex items-center gap-2 h-10 bg-violet-800 px-3 py-2 rounded-t-md">
        <Clock size={16} className="text-white" />
        <p className="text-sm font-semibold text-white">Por asignar</p>{" "}
        <small className="text-xs text-white">({pendingTasks.length})</small>
      </header>
      <SortableContext
        items={pendingTasks.map((task) => task.id)}
        id="AWAIT"
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 max-h-[calc(100vh-10rem)] [scrollbar-width:none] overflow-y-auto p-3 rounded-b-md bg-white">
          {pendingTasks.map((task) => (
            <AwaitTaskCard key={task.id} task={task} activeTaskId={activeId} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
