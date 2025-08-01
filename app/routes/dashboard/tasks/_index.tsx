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

export function meta() {
  return [
    {
      title: "Solicitudes | Flowee",
    },
  ];
}

export async function loader({}: Route.LoaderArgs) {

}

type Tasks = Record<Status, Task[]>;

const Home = ({ loaderData }: Route.ComponentProps) => {
  const [tasks, setTasks] = useState<Tasks | null>();
  const [active, setActive] = useState<Task | null>(null);
  const [originColumn, setOriginColumn] = useState<Status | null>(null);

  const { currentBoard } = useBoardContext();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !tasks) return;

    const fromColumn = Object.keys(tasks).find((status) =>
      tasks[status as Status].some((task) => task.id === active.id)
    ) as Status;

    const allTaskIds = Object.values(tasks)
      .flat()
      .map((t) => t.id);
    const allColumnIds = Object.keys(tasks);

    let toColumn: Status | null = null;

    if (allTaskIds.includes(over.id as string)) {
      toColumn = Object.keys(tasks).find((status) =>
        tasks[status as Status].some((task) => task.id === over.id)
      ) as Status;
    } else if (allColumnIds.includes(over.id as string)) {
      toColumn = over.id as Status;
    }

    if (!fromColumn || !toColumn || fromColumn === toColumn) {
      setOriginColumn(null);
      setActive(null);
      return;
    }

    const movingTask = tasks[fromColumn].find((task) => task.id === active.id);
    if (!movingTask) return;

    setTasks((prev) => {
      const updated: Tasks = {
        ...prev!,
        [fromColumn]: prev![fromColumn].filter((task) => task.id !== active.id),
        [toColumn]: [...prev![toColumn], { ...movingTask, status: toColumn }],
      };
      
      setOriginColumn(null);
      setActive(null);
      
      return updated;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks?.[
      active.data.current?.sortable.containerId as Status
    ].find((task) => task.id === active.id);
    if (task) {
      setOriginColumn(task.status);
      setActive(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!tasks || !active) return;

    const { over } = event;
    if (!over) return;

    const overId = over.id;
    const overColumn = columns.find(
      (c) => c.id === overId || tasks[c.id]?.some((t) => t.id === overId)
    );
    const targetColumnId = overColumn?.id;

    if (!targetColumnId || targetColumnId === originColumn) return;

    // Ya está en la columna actual
    console.log({targetColumnId, tasks})
    if (tasks[targetColumnId].some((t) => t.id === active.id)) return;

    // Mover temporalmente la tarea
    setTasks((prev) => {
      if (!prev || !originColumn || !active) return prev;

      return {
        ...prev,
        [originColumn]: prev[originColumn].filter((t) => t.id !== active.id),
        [targetColumnId]: [
          ...prev[targetColumnId],
          { ...active, status: targetColumnId },
        ],
      };
    });

    setOriginColumn(targetColumnId);
  };

  const { mutate: getTasksMutation, isPending } = useMutation({
    mutationFn: async (term: string): Promise<void> => {
      const { error, message, tasks, statusCode } = await getTasksByBoard(term);
      
      if (error || !tasks) throw new Error(message, { cause: `Error ${statusCode}: ${error}` });

      const tasksByStatus = tasks.reduce((acc, task) => {
        acc[task.status as Status] = [...(acc[task.status as Status] || []), task];
        return acc;
      }, {} as Record<Status, Task[]>);

      setTasks(tasksByStatus);
    },
    onError: ({ message, cause }) => {
      toast.error(cause as string, {
        description: message,
      })
    }
  });

  useEffect(() => {
    if (!currentBoard) return;
    getTasksMutation(currentBoard.id)
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
            tasks={tasks?.[column.id] || []}
            activeTaskId={active?.id || ''}
            allowNewTask={index === 0}
          />
        ))}
        <DragOverlay>{active && <TaskCardOverlay {...active} />}</DragOverlay>
      </DndContext>
    </div>
  );
};

export default Home;
