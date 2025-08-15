import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState, type FC } from "react";
import { toast } from "sonner";
import type { Task } from "~/services/interfaces/tasks-service.interface";
import { getPendingTasksByBoard } from "~/services/tasks-service";
import { getDesignersByBoardWithTasks } from "~/services/users-service";

export interface Designer {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  tasks: Task[];
}

interface AssignmentContextType {
  designers: Designer[];
  tasks: Task[];
  setDesigners: (designers: Designer[]) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  isDesignersPending: boolean;
  isTasksPending: boolean;
}

export const AssignmentContext = createContext<AssignmentContextType | null>(
  null
);

interface AssignmentProviderProps {
  children: React.ReactNode;
  boardId?: string;
}

export const AssignmentProvider: FC<AssignmentProviderProps> = ({
  children,
  boardId,
}) => {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const { mutate: getDesigners, isPending: isDesignersPending } = useMutation({
    mutationFn: async (boardId: string) => {
      const response = await getDesignersByBoardWithTasks(boardId);

      if (response.error) {
        throw new Error(response.message);
      }

      if (typeof response.designers === "object") {
        setDesigners(response.designers as Designer[]);
      }
    },
    onError: (error) => {
      toast.error(`${error.message}.`);
    },
  });

  const { mutate: getPendingTasks, isPending: isTasksPending } = useMutation({
    mutationFn: async (boardId: string) => {
      const response = await getPendingTasksByBoard(boardId);

      if (response.error) {
        throw new Error(response.message);
      }

      if (typeof response.tasks === "object") {
        setTasks(response.tasks as Task[]);
      }
    },
    onError: (error) => {
      toast.error(`${error.message}.`);
    },
  });

  useEffect(() => {
    setDesigners([]);
    setTasks([]);

    if (!boardId) return;
    getPendingTasks(boardId);
    getDesigners(boardId);
  }, [boardId]);

  const handleSetDesigners = (designers: Designer[]) => {
    setDesigners(designers);
  };

  const handleSetTasks = (tasks: Task[]) => {
    setTasks(tasks);
  };

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <AssignmentContext.Provider
      value={{
        designers,
        tasks,
        setDesigners: handleSetDesigners,
        setTasks: handleSetTasks,
        addTask: handleAddTask,
        removeTask: handleRemoveTask,
        isDesignersPending,
        isTasksPending,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignmentContext = (): AssignmentContextType => {
  const context = useContext(AssignmentContext);

  if (!context) {
    throw new Error(
      "useAssignmentContext debe ser usado dentro de AssignmentProvider"
    );
  }

  return context;
};
