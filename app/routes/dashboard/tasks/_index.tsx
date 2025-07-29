import {
  Status,
  type Task,
} from "~/services/interfaces/boards-service.interface";
import type { Route } from "../tasks/+types/_index";
import { Column } from "~/components/dashboard/boards/Column";
import { useEffect, useState } from "react";
import { tasks as tasksData } from "./data";
import {
  closestCenter,
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Active,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { TaskCardOverlay } from "~/components/dashboard/boards/TaskCardOverlay";

export function meta() {
  return [
    {
      title: "Solicitudes | Flowee",
    },
  ];
}

interface Column {
  id: Status;
  name: string;
  color: string;
}

export async function loader({}: Route.LoaderArgs) {
  const columns: Column[] = [
    {
      id: Status.AWAIT,
      name: "En espera",
      color: "gray",
    },
    {
      id: Status.ATTENTION,
      name: "En atención",
      color: "blue",
    },
    {
      id: Status.IN_PROGRESS,
      name: "En proceso",
      color: "purple",
    },
    {
      id: Status.REVIEW,
      name: "En revisión",
      color: "yellow",
    },
    {
      id: Status.DONE,
      name: "Finalizado",
      color: "green",
    },
  ];

  return { columns };
}

type Tasks = Record<Status, Task[]>;

const Home = ({ loaderData }: Route.ComponentProps) => {
  const { columns } = loaderData;
  const [tasks, setTasks] = useState<Tasks | null>(null);
  const [active, setActive] = useState<Task | null>(null);
  const [originColumn, setOriginColumn] = useState<Status | null>(null);

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const tasks = tasksData.reduce((acc, task) => {
      acc[task.status] = [...(acc[task.status] || []), task];
      return acc;
    }, {} as Record<Status, Task[]>);
    setTasks(tasks);
  }, []);

  return (
    <div className="grid grid-cols-5 max-h-full gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        {columns.map((column) => (
          <Column
            key={column.id}
            {...column}
            tasks={tasks?.[column.id] || []}
            activeTaskId={active?.id || ''}
          />
        ))}
        <DragOverlay>{active && <TaskCardOverlay {...active} />}</DragOverlay>
      </DndContext>
    </div>
  );
};

export default Home;
