import {
  Status,
  type Task,
} from "~/services/interfaces/tasks-service.interface";
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
import { useSocket } from "~/context/SocketContext";
import { PageLoader } from "~/components/dashboard/PageLoader";
import { useAuthContext } from "~/context/AuthContext";
import { TaskSidebar } from "~/components/dashboard/task-preview/TaskSidebar";
import { useTaskPreview } from "~/context/TaskPreviewContext";

export function meta() {
  return [
    {
      title: "Solicitudes | Flowee",
    },
  ];
}

const Home = () => {
  const socket = useSocket();

  const {
    tasks: tasksState,
    setTasks,
    resetTasks,
    addTask,
    activeTask,
    setActiveTask,
    updateTaskStatus,
    updateTaskFromServer,
    originColumn,
    setOriginColumn,
  } = useTaskContext();

  const { currentBoard } = useBoardContext();
  const { user } = useAuthContext();

  const { setPreviewTask } = useTaskPreview();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenSidebar = (task: Task) => {
    setIsOpen(true);
    setPreviewTask(task);
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

  const [overState, setOverState] = useState<{
    active: boolean;
    column: Status;
  } | null>(null);

  useEffect(() => {
    if (!currentBoard) return;
    getTasksMutation(currentBoard.id);

    if (!socket || !user) return;
    socket.emit("join-board", {
      boardId: currentBoard.id,
      role: user.highestRole,
    });

    return () => {
      socket.emit("leave-board", { boardId: currentBoard.id });
    };
  }, [currentBoard]);

  useEffect(() => {
    if (!socket) return;
    socket.on(
      "task-status-updated",
      ({ taskId, status }: { taskId: string; status: Status }) => {
        updateTaskFromServer(taskId, status);
      }
    );

    socket.on("unassigned-task-created", (task: Task) => {
      addTask(task);
    });

    socket.on(
      "task-assigned",
      ({ message, task }: { message: string; task?: Task }) => {
        if (!task) {
          toast.error(message);
          return;
        }

        addTask(task);

        toast.info("Se te ha asignado una tarea", {
          description: task.title,
        });
      }
    );

    return () => {
      socket.off("task-status-updated");
      socket.off("unassigned-task-created");
      socket.off("task-assigned");
    };
  }, [tasksState, updateTaskFromServer, socket]);

  if (!socket) return <PageLoader message="Generando tableros..." />;

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
    socket.emit("task-status-update", {
      taskId: movedTask.id,
      status: toColumn,
      boardId: currentBoard!.id,
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

export default Home;
