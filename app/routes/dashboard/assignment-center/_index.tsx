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
import { useAssignmentContext } from "~/context/AssignmentContext";
import { DesignerCard } from "~/components/dashboard/assignment-center/DesignerCard";
import { useSocket } from "~/context/SocketContext";
import { toast } from "sonner";

const centroDeAsignaciones = () => {
  const { tasks, designers, removeTask, isTasksPending } =
    useAssignmentContext();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const socket = useSocket();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (!active.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);

    if (!activeTask) return;

    setActiveTask(activeTask);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const designer = designers.find((d) => d.id === over.id);

    if (!designer) {
      setActiveTask(null);
      return;
    }

    const task = tasks.find((t) => t.id === active.id);

    if (!task) {
      setActiveTask(null);
      return;
    }

    if (!socket) {
      toast.error("No se pudo asignar la tarea");
      return;
    }

    socket.emit("assign-task", {
      taskId: task.id,
      designerId: designer.id,
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
        </div>
      </div>
      <DragOverlay>
        {activeTask && <TaskCardOverlay {...activeTask} />}
      </DragOverlay>
    </DndContext>
  );
};

export default centroDeAsignaciones;
