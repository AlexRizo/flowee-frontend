import { createContext, useContext, useEffect, useState, type FC } from "react";
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
  addTask: (task: Task) => void;
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  updateTaskFromServer: (taskId: string, newStatus: Status) => void;
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

  const updateTaskStatus = (taskId: string, status: Status) => {
    if (!originColumn || !taskId) return;

    const task = tasks[originColumn].find((t) => t.id === taskId);
    // console.log({task, originColumn})

    setTasks((prev) => {
      return {
        ...prev,
        [originColumn]: prev[originColumn].filter((t) => t.id !== taskId),
        [status]: [...prev[status], { ...task, status }],
      };
    });

    // ? Reset state
    setOriginColumn(null);
    setActiveTask(null);
  };

  const updateTaskFromServer = (taskId: string, newStatus: Status) => {
    const findOrigin = Object.keys(tasks).find((key) => tasks[key as Status].find((t) => t.id === taskId)) as Status;

    if (!findOrigin) return;

    const task = tasks[findOrigin].find((t) => t.id === taskId);

    setTasks((prev) => {
      return {
        ...prev,
        [findOrigin]: prev[findOrigin].filter((t) => t.id !== taskId),
        [newStatus]: [...prev[newStatus], { ...task, status: newStatus }],
      };
    });
  }
  
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

  const handleAddTask = (task: Task) => {
    setTasks(prev => ({
      ...prev,
      AWAIT: [...prev.AWAIT, task]
    }))
  }

  const handleSetActiveTask = (task: Task | null) => {
    setActiveTask(task);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks: handleSetTasks,
        addTask: handleAddTask,
        updateTaskStatus,
        updateTaskFromServer,
        resetTasks,
        activeTask,
        setActiveTask: handleSetActiveTask,
        originColumn,
        setOriginColumn,
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
