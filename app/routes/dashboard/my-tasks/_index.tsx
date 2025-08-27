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
import type { Task } from "~/services/interfaces/tasks-service.interface";
import type { Route } from "./+types/_index";
import { getMyTasks } from "~/services/tasks-service";
import { toast } from "sonner";
import { PageLoader } from "~/components/dashboard/PageLoader";

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

export async function HydrateFallback() {
  return <PageLoader />;
}

const MyTasks = ({ loaderData }: Route.ComponentProps) => {
  const { activeTask, tasks: tasksState, setTasks } = useTaskContext();
  const [previewTask, setPreviewTask] = useState<Task | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    console.log(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event);
  };

  const handleDragOver = (event: DragOverEvent) => {
    console.log(event);
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
      console.log(loaderData.tasks)
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
              over={null}
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
