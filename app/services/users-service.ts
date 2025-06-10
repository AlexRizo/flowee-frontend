import { api, getErrorMessage } from "./api";
import type { UsersResponse } from "./interfaces/users-service.interface";

export const getUsers = async () => {
  return await api.get('users')
  .then((res: UsersResponse) => {
    if (res.error) {
      return {
        message: getErrorMessage(res.message),
        error: res.error,
        statusCode: res.statusCode,
      };
    }

    return { users: res.users };
  });
}