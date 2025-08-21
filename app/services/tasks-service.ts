import { api, getErrorMessage } from "./api";
import type {
  CreateFormatResponse,
  CreateSpecialTaskResponse,
  Format,
  RestResponse,
  Task,
  TaskFile,
  TaskFiles,
  TaskFormats,
} from "./interfaces/tasks-service.interface";

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

export const getTaskFormats = async (taskId: string) => {
  return await api
    .get(`formats/task/${taskId}`)
    .then((response: TaskFormats) => {
      if ("error" in response) {
        return {
          message: getErrorMessage(response.message),
        };
      }
      return {
        formats: response.formats as Format[],
      };
    });
};

export const createFormat = async (format: {
  description: string;
  taskId: string;
}) => {
  return await api.post("formats", format).then((response: CreateFormatResponse) => {
    if ("error" in response) {
      return {
        message: getErrorMessage(response.message),
      };
    }

    return {
      message: response.message,
      format: response.format as Format,
    };
  });
};
