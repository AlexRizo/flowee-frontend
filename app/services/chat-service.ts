import { api } from "./api";
import type { GetChatMessagesResponse } from "./interfaces/chat-service.interface";

export const getChatMessages = async (taskId: string) => {
  return api
    .get(`chat/messages/${taskId}`)
    .then((response: GetChatMessagesResponse) => {
      return response;
    });
};
