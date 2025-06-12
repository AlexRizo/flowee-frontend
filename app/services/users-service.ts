import { api, getErrorMessage } from "./api";
import type {
  CreateUser,
  CreateUserResponse,
  UserResponse,
  UsersResponse,
} from "./interfaces/users-service.interface";

export const getUsers = async () => {
  return await api.get("users").then((res: UsersResponse) => {
    if (res.error) {
      return {
        message: getErrorMessage(res.message),
        error: res.error,
        statusCode: res.statusCode,
      };
    }

    return { users: res.users };
  });
};

export const getUser = async (nickname: string, cookie: string) => {
  if (!cookie)
    throw new Error(
      "No se proporcionó una cookie. Los serverActions/serverLoaders deben proporcionar una cookie."
    );

  return await api
    .get(`users/${nickname}`, { cookie })
    .then((res: UserResponse) => res);
};

export const createUser = async (data: CreateUser) => {
  return await api.post("users", data).then((res: CreateUserResponse) => {
    console.log(res);
    if (res.error) {
      return {
        message: getErrorMessage(res.message),
        error: res.error,
        statusCode: res.statusCode,
      };
    }

    return {
      user: res.user,
      message: res.message,
    };
  });
};
