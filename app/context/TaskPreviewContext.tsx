import { useMutation } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { toast } from "sonner";
import type {
  CreateDelivery,
  Format,
  Delivery,
  Task,
  TaskFiles,
} from "~/services/interfaces/tasks-service.interface";
import {
  createDelivery,
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
  resetTaskFormats: () => void;
  handleGetTaskFormats: () => void;
  isLoadingCreateFormat: boolean;
  handleCreateFormat: ({ description }: { description: string }) => void;
  isLoadingCreateDelivery: boolean;
  handleCreateDelivery: ({ description, formatId, file }: CreateDelivery) => void;
  deliveryData?: Delivery;
}

const TaskPreviewContext = createContext<TaskPreviewContextType>({
  previewTask: null,
  taskFiles: undefined,
  isLoadingTaskFiles: false,
  setPreviewTask: (): void => {},
  handleGetTaskFiles: (): void => {},
  taskFormats: undefined,
  isLoadingTaskFormats: false,
  resetTaskFormats: (): void => {},
  handleGetTaskFormats: (): void => {},
  isLoadingCreateFormat: false,
  handleCreateFormat: (): void => {},
  isLoadingCreateDelivery: false,
  handleCreateDelivery: (): void => {},
  deliveryData: undefined,
});

export const TaskPreviewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [taskFormats, setTaskFormats] = useState<Format[] | undefined>(
    undefined
  );

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

  const { mutate: getTaskFormatsMutation, isPending: isLoadingTaskFormats, reset: resetTaskFormats } =
    useMutation({
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

  const { mutate: createDeliveryMutation, isPending: isLoadingCreateDelivery, data: createDeliveryData } =
    useMutation({
      mutationFn: async (delivery: CreateDelivery) => {
        const { message, delivery: createdDelivery } = await createDelivery(delivery);

        if (message) {
          toast.info(message);
        }

        if (createdDelivery) {
          setTaskFormats(prev => {
            if (!prev) return [];

            const formatIndex = prev.findIndex(format => format.id === createdDelivery.formatId);

            if (formatIndex === -1) return prev;

            return prev.map((format, index) => 
              index === formatIndex 
                ? {
                    ...format,
                    deliveries: [createdDelivery, ...(format.deliveries || [])],
                  }
                : format
            );
          })
          return createdDelivery;
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

  const handleCreateDelivery = useCallback(
    ({ description, formatId, file }: CreateDelivery) => {
      if (!previewTask) return;
      createDeliveryMutation({ description, formatId, file });
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
        resetTaskFormats,
        handleGetTaskFormats,
        isLoadingCreateFormat,
        handleCreateFormat,
        isLoadingCreateDelivery,
        handleCreateDelivery,
        deliveryData: createDeliveryData,
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
