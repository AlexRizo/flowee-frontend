import { CirclePlus, FileImage, Paperclip, ThumbsUp } from "lucide-react";
import { ChatBubble } from "../ChatBubble";
import { Input } from "~/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "~/context/AuthContext";
import { useSocket } from "~/context/SocketContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getChatMessages } from "~/services/chat-service";
import { queryClient } from "~/services/queryClient";

interface Message {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  id: string;
}

interface Props {
  taskId: string | null;
}

export const Chat = ({ taskId }: Props) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  
  const { user } = useAuthContext();

  const socket = useSocket();

  const scrollToBottom = () => {
    chatRef.current?.scrollTo({
      top: chatRef.current?.scrollHeight,
      behavior: "smooth",
    });
  };

  const updateMessages = (message: Message) => {
    queryClient.setQueryData(
      ["chat-messages", taskId],
      (oldData: Message[]) => [...oldData, message]
    );
  };

  useEffect(() => {
    if (!socket || !taskId) return;

    socket.emit("join-chat", { taskId });

    socket.on("new-message", ({ message }: { message: Message }) => {
      updateMessages(message);
    });

    socket.on("error-message", (response: { message: string }) => {
      toast.error(response.message);
    });

    return () => {
      socket.off("new-message");
      socket.emit("leave-chat-room", taskId);
    };
  }, [socket, taskId]);

  const { data: messages } = useQuery({
    queryKey: ["chat-messages", taskId],
    queryFn: async () => {
      if (!taskId) return [];

      console.log("taskId", taskId);

      const response = await getChatMessages(taskId);
      if (!response.messages) {
        toast.error(response.message, {
          position: "top-center",
        });
        return [];
      }

      return response.messages;
    },
    enabled: !!taskId,
    retry: false,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!socket || !taskId || !inputValue || !user) return;
      socket.emit("on-send-message", {
        taskId,
        content: inputValue,
        userId: user.id,
      });

      setInputValue("");
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div role="group" className="pl-4 size-full flex flex-col pb-4">
      <h1 className="font-bold mb-8 mt-4">Conversación</h1>
      <div ref={chatRef} role="textbox" className="flex flex-col gap-5 overflow-y-auto h-[calc(100vh-220px)] pr-4">
        {messages?.map((message) => (
          <ChatBubble
            key={message.id}
            user={message.user}
            message={message.content}
            createdAt={message.createdAt}
            isUser={message.user.id === user?.id}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-auto pr-4">
        <CirclePlus strokeWidth={1.5} />
        <FileImage strokeWidth={1.5} />
        <Paperclip strokeWidth={1.5} />
        <Input
          type="text"
          placeholder="Escribe un mensaje..."
          className="rounded-full py-6"
          onChange={onInputChange}
          value={inputValue}
          onKeyDown={handleKeyDown}
        />
        <ThumbsUp strokeWidth={1.5} />
      </div>
    </div>
  );
};
