import { createContext, useContext, useState, type FC } from "react";
import {
  Status,
  type Task,
} from "~/services/interfaces/tasks-service.interface";

interface Tasks {
  AWAIT: Task[];
  ATTENTION: Task[];
  IN_PROGRESS: Task[];
  REVIEW: Task[];
  DONE: Task[];
}

interface TaskContextType {
  tasks: Tasks;
  setTasks: (tasks: Task[]) => void;
  setTemporaryTasks: (targetColumnId: Status) => void;
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;
  updateTaskStatus: (task: Task, status: Status) => void;
  resetTasks: () => void;
  originColumn: Status | null;
  setOriginColumn: (column: Status | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: React.ReactNode;
}

const initialTasksState: Tasks = {
  AWAIT: [],
  ATTENTION: [],
  IN_PROGRESS: [],
  REVIEW: [],
  DONE: [],
};

export const TaskProvider: FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Tasks>(initialTasksState);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [originColumn, setOriginColumn] = useState<Status | null>(null);

  const updateTaskStatus = (task: Task, status: Status) => {
    if (!originColumn) return;

    setTasks((prev) => {
      return {
        ...prev,
        [originColumn]: prev[originColumn].filter((t) => t.id !== task.id),
        [status]: [...prev[status], { ...task, status }],
      };
    });

    // ? Reset state
    setOriginColumn(null);
    setActiveTask(null);
  };

  const resetTasks = () => {
    setTasks(initialTasksState);
  };

  const handleSetTasks = (tasksArr: Task[]) => {
    const orderedTasks = tasksArr.reduce((acc, task) => {
      acc[task.status] = [...acc[task.status], task];
      return acc;
    }, {
      ...initialTasksState
    });

    setTasks(orderedTasks);
  };

  const handleSetTemporaryTasks = (
    targetColumnId: Status
  ) => {
    setTasks((prev) => {
      if (!prev || !originColumn || !activeTask) return prev;

      return {
        ...prev,
        [originColumn]: prev[originColumn].filter(
          (t) => t.id !== activeTask.id
        ),
        [targetColumnId]: [
          ...prev[targetColumnId],
          { ...activeTask, status: targetColumnId },
        ],
      };
    });

    setOriginColumn(targetColumnId);
  };

  const handleSetActiveTask = (task: Task | null) => {
    setActiveTask(task);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks: handleSetTasks,
        updateTaskStatus,
        resetTasks,
        activeTask,
        setActiveTask: handleSetActiveTask,
        originColumn,
        setOriginColumn,
        setTemporaryTasks: handleSetTemporaryTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const ctx = useContext(TaskContext);

  if (!ctx)
    throw new Error("useTaskContext debe ser usado dentro de TaskProvider");

  return ctx;
};
