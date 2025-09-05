import { useMutation } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useState } from "react";
import { toast } from "sonner";
import type {
  CreateVersion,
  Version,
  VersionStatus,
} from "~/services/interfaces/versions-interface";
import type {
  Delivery,
  Task,
  TaskFiles,
} from "~/services/interfaces/tasks-service.interface";
import {
  createDelivery,
  createVersion,
  getTaskFiles,
  getTaskDeliveries,
} from "~/services/tasks-service";

interface TaskPreviewContextType {
  previewTask: Task | null;
  taskFiles?: TaskFiles;
  isLoadingTaskFiles: boolean;
  setPreviewTask: (task: Task | null) => void;
  handleGetTaskFiles: () => void;
  taskDeliveries?: Delivery[];
  isLoadingTaskDeliveries: boolean;
  resetTaskDeliveries: () => void;
  handleGetTaskDeliveries: () => void;
  isLoadingCreateDelivery: boolean;
  handleCreateDelivery: ({ description }: { description: string }) => void;
  isLoadingCreateVersion: boolean;
  handleCreateVersion: ({
    description,
    deliveryId,
    file,
  }: CreateVersion) => void;
  versionData?: Version;
  handleUpdateVersionStatus: (
    deliveryId: string,
    versionId: string,
    status: VersionStatus,
    comments?: string
  ) => void;
}

const TaskPreviewContext = createContext<TaskPreviewContextType>({
  previewTask: null,
  taskFiles: undefined,
  isLoadingTaskFiles: false,
  setPreviewTask: (): void => {},
  handleGetTaskFiles: (): void => {},
  taskDeliveries: undefined,
  isLoadingTaskDeliveries: false,
  resetTaskDeliveries: (): void => {},
  handleGetTaskDeliveries: (): void => {},
  isLoadingCreateDelivery: false,
  handleCreateDelivery: (): void => {},
  isLoadingCreateVersion: false,
  handleCreateVersion: (): void => {},
  versionData: undefined,
  handleUpdateVersionStatus: (): void => {},
});

export const TaskPreviewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [taskDeliveries, setTaskDeliveries] = useState<Delivery[] | undefined>(
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

  const {
    mutate: getTaskDeliveriesMutation,
    isPending: isLoadingTaskDeliveries,
    reset: resetTaskDeliveriesMutation,
  } = useMutation({
    mutationFn: async (taskId: string) => {
      const { deliveries, message } = await getTaskDeliveries(taskId);

      if (message) {
        toast.error(message, {
          position: "top-center",
        });
        return;
      }

      setTaskDeliveries(deliveries);
    },
  });

  const resetTaskDeliveries = useCallback(() => {
    resetTaskDeliveriesMutation();
    setTaskDeliveries(undefined);
  }, [resetTaskDeliveriesMutation]);

  const { mutate: createDeliveryMutation, isPending: isLoadingCreateDelivery } =
    useMutation({
      mutationFn: async (delivery: { description: string; taskId: string }) => {
        const { message, delivery: createdDelivery } = await createDelivery(
          delivery
        );

        console.log(createdDelivery);

        if (message) {
          toast.info(message);
        }

        if (createdDelivery) {
          setTaskDeliveries([...(taskDeliveries || []), createdDelivery]);
        }
      },
    });

  const {
    mutate: createVersionMutation,
    isPending: isLoadingCreateVersion,
    data: createVersionData,
  } = useMutation({
    mutationFn: async (version: CreateVersion) => {
      const { message, version: createdVersion } = await createVersion(version);

      if (message) {
        toast.info(message);
      }

      if (createdVersion) {
        setTaskDeliveries((prev) => {
          if (!prev) return [];

          const deliveryIndex = prev.findIndex(
            (delivery) => delivery.id === createdVersion.deliveryId
          );

          if (deliveryIndex === -1) return prev;

          return prev.map((delivery, index) =>
            index === deliveryIndex
              ? {
                  ...delivery,
                  versions: [createdVersion, ...(delivery.versions || [])],
                }
              : delivery
          );
        });
        return createdVersion;
      }
    },
  });

  const handleGetTaskFiles = useCallback(() => {
    if (!previewTask) return;
    getTaskFilesMutation(previewTask.id);
  }, [previewTask]);

  const handleGetTaskDeliveries = useCallback(() => {
    if (!previewTask) return;
    getTaskDeliveriesMutation(previewTask.id);
  }, [previewTask]);

  const handleCreateDelivery = useCallback(
    ({ description }: { description: string }) => {
      if (!previewTask) return;
      createDeliveryMutation({
        description,
        taskId: previewTask.id,
      });
    },
    [previewTask]
  );

  const handleCreateVersion = useCallback(
    ({ description, deliveryId, file }: CreateVersion) => {
      if (!previewTask) return;
      createVersionMutation({ description, deliveryId, file });
    },
    [previewTask]
  );

  const handleUpdateVersionStatus = useCallback(
    (
      deliveryId: string,
      versionId: string,
      status: VersionStatus,
      comments?: string
    ) => {
      setTaskDeliveries((prev) => {
        if (!prev) return prev;

        const deliveryIndex = prev.findIndex(
          (delivery) => delivery.id === deliveryId
        );
        
        if (deliveryIndex === -1) return prev;

        return prev.map((delivery) => {
          if (delivery.id === deliveryId) {
            return {
              ...delivery,
              versions: delivery.versions?.map((version) =>
                version.id === versionId
                  ? { ...version, status, comments: comments || null }
                  : version
              ),
            };
          }
          return delivery;
        });
      });
    },
    []
  );

  return (
    <TaskPreviewContext.Provider
      value={{
        previewTask,
        setPreviewTask,
        taskFiles,
        isLoadingTaskFiles,
        handleGetTaskFiles,
        taskDeliveries,
        isLoadingTaskDeliveries,
        resetTaskDeliveries,
        handleGetTaskDeliveries,
        isLoadingCreateDelivery,
        handleCreateDelivery,
        isLoadingCreateVersion,
        handleCreateVersion,
        versionData: createVersionData,
        handleUpdateVersionStatus,
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
