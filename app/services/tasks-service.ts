import { api, getErrorMessage } from "./api";
import type { RestResponse, Task } from "./interfaces/tasks-service.interface";

export const getTasksByBoard = async (boardTerm: string) => {
  return await api.get(`tasks/board/${boardTerm}`)
  .then((response: RestResponse) => {
    if ('error' in response) {
      return {
        message: getErrorMessage(response.message),
        error: response.error,
        statusCode: response.statusCode,
      };
    }

    console.log(response);
    
    return { tasks: response as Task[] };
  });
}