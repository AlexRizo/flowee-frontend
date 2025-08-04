import {
  Status,
  type Task,
} from "~/services/interfaces/tasks-service.interface";
import type { Route } from "../tasks/+types/_index";
import { Column } from "~/components/dashboard/boards/Column";
import { useEffect, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { TaskCardOverlay } from "~/components/dashboard/boards/TaskCardOverlay";
import { useBoardContext } from "~/context/BoardContext";
import { useMutation } from "@tanstack/react-query";
import { columns } from "./data";
import { getTasksByBoard } from "~/services/tasks-service";
import { toast } from "sonner";
import { useTaskContext } from "~/context/TaskContext";

export function meta() {
  return [
    {
      title: "Solicitudes | Flowee",
    },
  ];
}

export async function loader({}: Route.LoaderArgs) {}

const Home = ({ loaderData }: Route.ComponentProps) => {
  const {
    tasks,
    setTasks,
    resetTasks,
    activeTask,
    setActiveTask,
    updateTaskStatus,
    originColumn,
    setOriginColumn,
    setTemporaryTasks,
  } = useTaskContext();

  const { currentBoard } = useBoardContext();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !tasks) return;

    const taskObjectKeys = Object.keys(tasks);

    const fromColumn = taskObjectKeys.find((status) =>
      tasks[status as Status].some((task) => task.id === active.id)
    ) as Status;

    const allTaskIds = Object.values(tasks)
      .flat()
      .map((t) => t.id);
    const allColumnIds = taskObjectKeys;

    let toColumn: Status | null = null;

    if (allTaskIds.includes(over.id)) {
      toColumn = taskObjectKeys.find((status) =>
        tasks[status as Status].some((task) => task.id === over.id)
      ) as Status;
    } else if (allColumnIds.includes(over.id as string)) {
      toColumn = over.id as Status;
    }

    if (!toColumn || !fromColumn || fromColumn === toColumn) {
      setActiveTask(null);
      setOriginColumn(null);
      return;
    }

    const movedTask = tasks[fromColumn].find(task => task.id === active.id);
    if (!movedTask) return;

    updateTaskStatus(movedTask, toColumn);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    const task = tasks[
      active.data.current?.sortable.containerId as Status
    ].find((task) => task.id === active.id);
    if (task) {
      setOriginColumn(task.status);
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!tasks || !activeTask) return;

    const { over } = event;
    if (!over) return;
  
    const overId = over.id;
  
    const overColumn = columns.find(
      (c) => c.id === overId || tasks[c.id]?.some((t) => t.id === overId)
    );

    const targetColumnId = overColumn?.id;

    if (!targetColumnId || targetColumnId === originColumn) return;

    if (tasks[targetColumnId].some((t) => t.id === activeTask.id)) return;

    setTemporaryTasks(targetColumnId);
  };

  const { mutate: getTasksMutation, isPending } = useMutation({
    mutationFn: async (term: string): Promise<void> => {
      const { error, message, tasks, statusCode } = await getTasksByBoard(term);

      if (error || !tasks)
        throw new Error(message, { cause: `Error ${statusCode}: ${error}` });

      setTasks(tasks);
    },
    onMutate: () => resetTasks(),
    onError: ({ message, cause }) => {
      toast.error(cause as string, {
        description: message,
      });
    },
    retry: false,
  });

  useEffect(() => {
    if (!currentBoard) return;
    getTasksMutation(currentBoard.id);
  }, [currentBoard]);

  return (
    <div className="grid grid-cols-5 max-h-full gap-4">
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
            tasks={tasks[column.id]}
            activeTaskId={activeTask?.id || ""}
            allowNewTask={index === 0}
          />
        ))}
        <DragOverlay>
          {activeTask && <TaskCardOverlay {...activeTask} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Home;
