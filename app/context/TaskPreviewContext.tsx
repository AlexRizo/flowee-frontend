import { useMutation } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import type {
  Format,
  Task,
  TaskFiles,
} from "~/services/interfaces/tasks-service.interface";
import {
  createFormat,
  getTaskFiles,
  getTaskFormats,
} from "~/services/tasks-service";

interface TaskPreviewContextType {
  previewTask: Task | null;
  taskFiles?: TaskFiles;
  isLoadingTaskFiles: boolean;
  setPreviewTask: (task: Task | null) => void;
  handleGetTaskFiles: () => void;
  taskFormats?: Format[];
  isLoadingTaskFormats: boolean;
  handleGetTaskFormats: () => void;
  isLoadingCreateFormat: boolean;
  handleCreateFormat: ({ description }: { description: string }) => void;
}

const TaskPreviewContext = createContext<TaskPreviewContextType>({
  previewTask: null,
  taskFiles: undefined,
  isLoadingTaskFiles: false,
  setPreviewTask: (): void => {},
  handleGetTaskFiles: (): void => {},
  taskFormats: undefined,
  isLoadingTaskFormats: false,
  handleGetTaskFormats: (): void => {},
  isLoadingCreateFormat: false,
  handleCreateFormat: (): void => {},
});

export const TaskPreviewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [taskFormats, setTaskFormats] = useState<Format[] | undefined>(undefined);

  const {
    mutate: getTaskFilesMutation,
    data: taskFiles,
    isPending: isLoadingTaskFiles,
  } = useMutation({
    mutationFn: async (taskId: string) => {
      const { message, includeFiles, referenceFiles } = await getTaskFiles(
        taskId
      );
      if (message) {
        toast.error(message);
        return;
      }

      return { includeFiles, referenceFiles };
    },
  });

  const {
    mutate: getTaskFormatsMutation,
    isPending: isLoadingTaskFormats,
  } = useMutation({
    mutationFn: async (taskId: string) => {
      const { formats, message } = await getTaskFormats(taskId);

      if (message) {
        toast.error(message, {
          position: "top-center",
        });
        return;
      }

      setTaskFormats(formats);
    },
  });

  const { mutate: createFormatMutation, isPending: isLoadingCreateFormat } =
    useMutation({
      mutationFn: async (format: { description: string; taskId: string }) => {
        const { message, format: createdFormat } = await createFormat(format);

        console.log("createdFormat", createdFormat, message);

        if (message) {
          toast.info(message);
        }

        if (createdFormat) {
          setTaskFormats([...(taskFormats || []), createdFormat]);
        }
      },
    });

  const handleGetTaskFiles = useCallback(() => {
    if (!previewTask) return;
    getTaskFilesMutation(previewTask.id);
  }, [previewTask]);

  const handleGetTaskFormats = useCallback(() => {
    if (!previewTask) return;
    getTaskFormatsMutation(previewTask.id);
  }, [previewTask]);

  const handleCreateFormat = useCallback(
    ({ description }: { description: string }) => {
      if (!previewTask) return;      
      createFormatMutation({
        description,
        taskId: previewTask.id,
      });
    },
    [previewTask]
  );

  return (
    <TaskPreviewContext.Provider
      value={{
        previewTask,
        setPreviewTask,
        taskFiles,
        isLoadingTaskFiles,
        handleGetTaskFiles,
        taskFormats,
        isLoadingTaskFormats,
        handleGetTaskFormats,
        isLoadingCreateFormat,
        handleCreateFormat,
      }}
    >
      {children}
    </TaskPreviewContext.Provider>
  );
};

export const useTaskPreview = () => {
  const context = useContext(TaskPreviewContext);

  if (!context) {
    throw new Error("useTaskPreview must be used within a TaskPreviewProvider");
  }

  return context;
};
