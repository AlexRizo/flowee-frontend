import type { FC } from "react";

interface Props {
  user: {
    name: string;
    avatar?: string;
  };
  message: string;
  createdAt: string;
  isUser: boolean;
}

export const ChatBubble: FC<Props> = ({ user, message, createdAt, isUser }) => {
  return (
    <div
      role="article"
      className={`flex gap-0.5 flex-col ${
        !isUser ? "items-end" : "items-start"
      }`}
    >
      <span
        className={`flex gap-2 items-end ${
          !isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <img
          src={user.avatar || "/images/default-user.webp"}
          alt={user.name || "Usuario desconocido"}
          className="size-5 rounded"
        />
        <p
          className={`py-1.5 pl-3.5 pr-5 rounded-2xl ${
            !isUser
              ? "rounded-br-none bg-black text-white"
              : "rounded-bl-none bg-gray-200"
          }`}
        >
          {message}
        </p>
      </span>
      <p className={`text-xs text-gray-400 ${!isUser ? "mr-7" : "ml-7"}`}>
        {createdAt}
      </p>
    </div>
  );
};
