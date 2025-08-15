import { api, getErrorMessage } from "./api";
import type {
  CreateSpecialTaskResponse,
  RestResponse,
  Task,
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
}