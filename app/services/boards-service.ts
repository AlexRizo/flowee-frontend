import { api, getErrorMessage } from "./api";
import type { BoardResponse, BoardsResponse } from "./interfaces/boards-service.interface";

export const getBoards = async (cookie?: string) => {
  return await api.get("boards", { cookie }).then((res: BoardsResponse) => {
    if (res.error) {
      return {
        message: getErrorMessage(res.message),
        error: res.error,
        statusCode: res.statusCode,
      };
    }

    return { boards: res.boards };
  });
};

export const getBoard = async (slug: string, cookie?: string) => {
  return await api
    .get(`boards/${slug}`, { cookie })
    .then((res: BoardResponse) => {
      if (res.error) {
        return {
          message: getErrorMessage(res.message),
          error: res.error,
          statusCode: res.statusCode,
        };
      }

      return { board: res.board };
    });
};

// export const getBoardTasks = async (slug: string, cookie?: string) => {
//   return await api
//     .get(`tasks/board/${slug}`, { cookie })
//     .then((res: BoardTasksResponse) => {
//       if (res.error) {
//         return {
//           message: getErrorMessage(res.message),
//           error: res.error,
//           statusCode: res.statusCode,
//         };
//       }

//       return { tasks: res.tasks };
//     });
// };
