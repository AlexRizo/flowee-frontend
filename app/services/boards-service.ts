import { api, getErrorMessage } from "./api";
import type { BoardsResponse } from "./interfaces/boards-service.interface";

export const getBoards = async (cookie?: string) => {
  return await api.get('boards', { cookie })
  .then((res: BoardsResponse) => {
    if (res.error) {
      return {
        message: getErrorMessage(res.message),
        error: res.error,
        statusCode: res.statusCode,
      };
    }
    
    return { boards: res.boards };
  });
}