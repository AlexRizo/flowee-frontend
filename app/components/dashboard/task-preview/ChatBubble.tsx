import type { FC } from "react";
import { CardTooltip } from "../boards/CardTooltip";
import { getTaskDate } from "~/helpers/taskHelpers";

interface Props {
  user: {
    name: string;
    avatar?: string;
  };
  message: string;
  createdAt: string;
  isUser: boolean;
  showDate?: boolean;
}

export const ChatBubble: FC<Props> = ({ user, message, createdAt, isUser, showDate = true }) => {
  return (
    <div
      role="article"
      className={`flex gap-0.5 flex-col ${
        isUser ? "items-end" : "items-start"
      }`}
    >
      <span
        className={`flex gap-2 items-end ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <CardTooltip text={ user.name }>
          <img
            src={user.avatar || "/images/default-user.webp"}
            alt={user.name || "Usuario desconocido"}
            className="size-5 rounded"
          />
        </CardTooltip>
        <p
          className={`py-1.5 pl-3.5 pr-5 rounded-2xl w-fit ${
            isUser
              ? "rounded-br-none bg-black text-white"
              : "rounded-bl-none bg-gray-200"
          }`}
        >
          {message}
        </p>
      </span>
      {showDate && (
        <p className={`text-xs text-gray-400 ${isUser ? "mr-7" : "ml-7"}`}>
          {getTaskDate(createdAt)}
        </p>
      )}
    </div>
  );
};
