import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { TaskSidebar } from "~/components/dashboard/task-preview/TaskSidebar";
import { columns } from "../tasks/data";
import { Column } from "~/components/dashboard/boards/Column";
import { TaskCardOverlay } from "~/components/dashboard/boards/TaskCardOverlay";
import { useEffect, useState } from "react";
import { useTaskContext } from "~/context/TaskContext";
import type {
  Status,
  Task,
} from "~/services/interfaces/tasks-service.interface";
import type { Route } from "./+types/_index";
import { getMyTasks } from "~/services/tasks-service";
import { toast } from "sonner";
import { PageLoader } from "~/components/dashboard/PageLoader";
import { useBoardContext } from "~/context/BoardContext";
import { useSocket } from "~/context/SocketContext";
import { useTaskPreview } from "~/context/TaskPreviewContext";

export function meta() {
  return [
    {
      title: "Mis tareas | Flowee",
    },
  ];
}

export async function clientLoader({ request }: Route.LoaderArgs) {
  const { pendingTasks, doneTasks, message } = await getMyTasks();

  if (message) {
    return { message };
  }

  return {
    tasks: {
      pendingTasks: pendingTasks as Task[],
      doneTasks: doneTasks as Task[],
    },
  };
}

export function HydrateFallback() {
  return <PageLoader />;
}

const MyTasks = ({ loaderData }: Route.ComponentProps) => {
  const {
    activeTask,
    tasks: tasksState,
    setTasks,
    originColumn,
    setOriginColumn,
    setActiveTask,
    updateTaskStatus,
  } = useTaskContext();

  const { setPreviewTask } = useTaskPreview();

  const [overState, setOverState] = useState<{
    active: boolean;
    column: Status;
  } | null>(null);
  const socket = useSocket();

  const [isOpen, setIsOpen] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !tasksState) return;

    const taskObjectKeys = Object.keys(tasksState);

    const fromColumn = originColumn;

    const allTaskIds = Object.values(tasksState)
      .flat()
      .map((t) => t.id);
    const allColumnIds = taskObjectKeys;

    let toColumn: Status | null = null;

    if (allTaskIds.includes(over.id)) {
      toColumn = taskObjectKeys.find((status) =>
        tasksState[status as Status].some((task) => task.id === over.id)
      ) as Status;
    } else if (allColumnIds.includes(over.id as string)) {
      toColumn = over.id as Status;
    }

    if (!toColumn || !fromColumn || fromColumn === toColumn) {
      setActiveTask(null);
      setOriginColumn(null);
      setOverState(null);
      return;
    }

    const movedTask = tasksState[fromColumn].find(
      (task) => task.id === active.id
    );
    if (!movedTask) return;

    setOverState(null);

    updateTaskStatus(movedTask.id, toColumn);

    if (!socket) {
      toast.error("No se pudo actualizar el estado de la tarea");
      return;
    }

    socket.emit("task-status-update", {
      taskId: movedTask.id,
      status: toColumn,
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    const task = tasksState[
      active.data.current?.sortable.containerId as Status
    ].find((task) => task.id === active.id);
    if (task) {
      setOriginColumn(task.status);
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!tasksState || !activeTask) return;

    const { over } = event;
    if (!over) return;

    const overId = over.id;

    const overColumn = columns.find(
      (c) => c.id === overId || tasksState[c.id]?.some((t) => t.id === overId)
    );

    const targetColumnId = overColumn?.id;

    if (!targetColumnId || targetColumnId === originColumn) {
      setOverState(null);
      return;
    }

    if (tasksState[targetColumnId].some((t) => t.id === activeTask.id)) return;

    setOverState({ active: true, column: targetColumnId });
  };

  const handleOpenSidebar = (task: Task) => {
    setIsOpen(true);
    setPreviewTask(task);
  };

  useEffect(() => {
    if (loaderData.message) {
      toast.error(loaderData.message);
    }

    if (loaderData.tasks) {
      console.log(loaderData.tasks);
      setTasks([
        ...loaderData.tasks.pendingTasks,
        ...loaderData.tasks.doneTasks,
      ]);
    }
  }, [loaderData]);

  return (
    <>
      <TaskSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="grid grid-cols-5 min-w-7xl max-h-full gap-4">
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          {columns.map((column, index) => (
            <Column
              key={column.id}
              {...column}
              tasks={tasksState[column.id]}
              activeTask={activeTask}
              allowNewTask={index === 0}
              over={overState}
              setPreviewTask={handleOpenSidebar}
            />
          ))}
          <DragOverlay>
            {activeTask && <TaskCardOverlay {...activeTask} />}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
};

export default MyTasks;
