import { api, getErrorMessage } from "./api";
import type {
  CreateSpecialTaskResponse,
  RestResponse,
  Task,
} from "./interfaces/tasks-service.interface";

export const getTasksByBoard = async (boardTerm: string) => {
  return await api
    .get(`tasks/board/${boardTerm}`)
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
    .then((response: CreateSpecialTaskResponse) => {
      if (response.error) {
        return {
          message: getErrorMessage(response.message),
          error: response.error,
          statusCode: response.statusCode,
        };
      }

      return { task: response.task as Task, message: response.message };
    });
};

// export const createTaskFiles = async (taskId: string, referenceFiles: File[], includeFiles: File[]) => {
//   return await api.post(``)
// }