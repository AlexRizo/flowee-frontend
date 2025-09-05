import { api, getErrorMessage } from "./api";
import type {
  CreateDeliveryResponse,
  CreateSpecialTaskResponse,
  DownloadFileResponse,
  Delivery,
  GetMyTasksResponse,
  RestResponse,
  Task,
  TaskFile,
  TaskFiles,
  TaskDeliveries,
  CreateVersionResponse,
} from "./interfaces/tasks-service.interface";
import type { CreateVersion, Version } from "./interfaces/versions-interface";

export const getTasksByBoard = async (board: string) => {
  return await api
    .get(`tasks/board/${board}`)
    .then((response: RestResponse) => {
      if ("error" in response) {
        return {
          message: getErrorMessage(response.message),
          error: response.error,
          statusCode: response.statusCode,
        };
      }

      return { tasks: response as Task[] };
    });
};

export const createSpecialTask = async (task: FormData) => {
  return await api
    .post("tasks/special", task, {}, true)
    .then(
      ({
        task,
        filesResponse,
        message,
        error,
        statusCode,
      }: CreateSpecialTaskResponse) => {
        if (error) {
          return {
            message: getErrorMessage(message),
            error: error,
            statusCode: statusCode,
          };
        }

        return {
          task: task as Task,
          filesResponse: filesResponse as { message: string },
        };
      }
    );
};

export const getPendingTasksByBoard = async (board: string) => {
  return await api
    .get(`tasks/board/${board}/pending`)
    .then((response: RestResponse) => {
      if ("error" in response) {
        return {
          message: getErrorMessage(response.message),
          error: response.error,
          statusCode: response.statusCode,
        };
      }

      return { tasks: response as Task[] };
    });
};

export const getTaskFiles = async (taskId: string) => {
  return await api.get(`files/task/${taskId}`).then((response: TaskFiles) => {
    if ("error" in response) {
      return {
        message: getErrorMessage(response.message),
      };
    }

    return {
      includeFiles: response.includeFiles as TaskFile[],
      referenceFiles: response.referenceFiles as TaskFile[],
    };
  });
};

export const downloadFile = async (id: string) => {
  return await api
    .get(`files/task/download/${id}`)
    .then((response: DownloadFileResponse) => {
      if ("error" in response) {
        return {
          message: getErrorMessage(response.message),
        };
      }

      return {
        signedUrl: response.signedUrl,
      };
    });
};

export const downloadVersion = async (id: string) => {
  return await api
    .get(`files/task/versions/download/${id}`)
    .then((response: DownloadFileResponse) => {
      if ("error" in response) {
        return {
          message: getErrorMessage(response.message),
        };
      }

      return {
        signedUrl: response.signedUrl,
      };
    });
};

export const getTaskDeliveries = async (taskId: string) => {
  return await api
    .get(`deliveries/task/${taskId}`)
    .then((response: TaskDeliveries) => {
      if ("error" in response) {
        return {
          message: getErrorMessage(response.message),
        };
      }
      return {
        deliveries: response.deliveries as Delivery[],
      };
    });
};

export const createDelivery = async (delivery: {
  description: string;
  taskId: string;
}) => {
  return await api
    .post("deliveries", delivery)
    .then((response: CreateDeliveryResponse) => {
      if ("error" in response) {
        return {
          message: getErrorMessage(response.message),
        };
      }

      return {
        message: response.message,
        delivery: response.delivery as Delivery,
      };
    });
};

export const createVersion = async (version: CreateVersion) => {
  const formData = new FormData();

  formData.append("description", version.description);
  formData.append("deliveryId", version.deliveryId);
  formData.append("file", version.file);

  return await api
    .post("versions", formData, {}, true)
    .then((response: CreateVersionResponse) => {
      if ("error" in response) {
        return {
          message: getErrorMessage(response.message),
        };
      }

      return {
        message: response.message,
        version: response.version as Version,
      };
    });
};

export const getMyTasks = async () => {
  return await api.get("tasks/user").then((response: GetMyTasksResponse) => {
    if ("error" in response) {
      return {
        message: getErrorMessage(response.message),
      };
    }

    return {
      pendingTasks: response.pendingTasks as Task[],
      doneTasks: response.doneTasks as Task[],
    };
  });
};
