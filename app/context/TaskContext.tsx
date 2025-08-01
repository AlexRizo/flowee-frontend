import { createContext, useContext, useEffect, useState, type FC } from "react";
import {
  Status,
  type Task,
} from "~/services/interfaces/tasks-service.interface";

interface Tasks {
  await: Task[];
  attention: Task[];
  inProgress: Task[];
  review: Task[];
  done: Task[];
}

type TaskStatus = "await" | "attention" | "inProgress" | "review" | "done";

interface TaskContextType {
  tasks: Tasks;
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (task: Task, status: Status) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider: FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Tasks>({
    await: [],
    attention: [],
    inProgress: [],
    review: [],
    done: [],
  });

  const getTaskStatus = (taskStatus: Status): TaskStatus => {
    switch (taskStatus) {
      case Status.AWAIT:
        return "await";
      case Status.ATTENTION:
        return "attention";
      case Status.IN_PROGRESS:
        return "inProgress";
      case Status.REVIEW:
        return "review";
      case Status.DONE:
        return "done";
      default:
        return "await";
    }
  };

  const updateTaskStatus = (task: Task, status: Status) => {
    const findTask = tasks[getTaskStatus(task.status)].find(
      (t) => t.id === task.id
    );

    if (!findTask) return;

    setTasks((prev) => {
      return {
        ...prev,
        [getTaskStatus(task.status)]: prev[getTaskStatus(task.status)].filter(
          (t) => t.id !== task.id
        ),
        [getTaskStatus(status)]: [...prev[getTaskStatus(status)], findTask],
      };
    });
  };

  const handleSetTasks = (tasksArr: Task[]) => {
    const orderedTasks = tasksArr.reduce(
      (acc, task) => {
        acc[getTaskStatus(task.status)] = [
          ...acc[getTaskStatus(task.status)],
          task,
        ];
        return acc;
      },
      {
        await: [],
        attention: [],
        inProgress: [],
        review: [],
        done: [],
      } as Tasks
    );

    setTasks(orderedTasks);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, setTasks: handleSetTasks, updateTaskStatus }}
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
