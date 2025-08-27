import type { Task } from "~/services/interfaces/tasks-service.interface";
import { useState } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { PendingColumn } from "~/components/dashboard/assignment-center/PendingColumn";
import { TaskCardOverlay } from "~/components/dashboard/boards/TaskCardOverlay";
import { useAssignmentContext, type Designer } from "~/context/AssignmentContext";
import { DesignerCard } from "~/components/dashboard/assignment-center/DesignerCard";
import { useSocket } from "~/context/SocketContext";
import { toast } from "sonner";
import { useAuthContext } from "~/context/AuthContext";
import { ManagerCard } from "~/components/dashboard/assignment-center/ManagerCard";

const centroDeAsignaciones = () => {
  const { tasks, designers, removeTask, isTasksPending } =
    useAssignmentContext();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const socket = useSocket();

  const { user } = useAuthContext();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (!active.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);

    if (!activeTask) return;

    setActiveTask(activeTask);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    let designerId: string | undefined;

    if (!socket) {
      toast.error("No se pudo asignar la tarea");
      return;
    }

    if (!over) return;

    designerId = designers.find((d) => d.id === over.id)?.id;

    if (!designerId && over.id === user?.id) designerId = user?.id;

    if (!designerId) {
      setActiveTask(null);
      return;
    }

    const task = tasks.find((t) => t.id === active.id);

    if (!task) {
      setActiveTask(null);
      return;
    }

    socket.emit("assign-task", {
      taskId: task.id,
      designerId,
    });

    removeTask(task.id);
    setActiveTask(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4">
        <PendingColumn pendingTasks={tasks} activeId={activeTask?.id} />
        <div className="grid grid-cols-3 gap-4">
          {designers.map((designer) => (
            <DesignerCard key={designer.id} designer={designer} />
          ))}
          <ManagerCard manager={user} />
        </div>
      </div>
      <DragOverlay>
        {activeTask && <TaskCardOverlay {...activeTask} />}
      </DragOverlay>
    </DndContext>
  );
};

export default centroDeAsignaciones;
