export interface GetChatMessagesResponse {
  message: string;
  messages: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    }
  }[]
}