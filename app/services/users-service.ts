import { api, getErrorMessage } from "./api";
import type {
  CreateUser,
  CreateUserResponse,
  UpdateUser,
  UpdateUserResponse,
  UploadAvatarResponse,
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

export const updateUser = async (userId: string, userData: UpdateUser) => {
  let isActive = undefined;

  if (userData.isActive) {
    switch (userData.isActive) {
      case "true":
        isActive = true;
        break;
      case "false":
        isActive = false;
        break;
    }
  }

  return await api
    .patch(`users/${userId}`, {
      ...userData,
      isActive,
    })
    .then((res: UpdateUserResponse) => {
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

export const uploadAvatar = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return await api.patch(`users/${userId}/avatar`, formData, {}, true)
    .then(({ url, error, message, statusCode }: UploadAvatarResponse) => {
      
      if (error || statusCode !== 200) {
        return {
          message: getErrorMessage(message),
          error: error,
          statusCode,
        };
      }

      return {
        url,
        message,
      }
    });
}