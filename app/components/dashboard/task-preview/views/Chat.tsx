import { CirclePlus, FileImage, Paperclip, ThumbsUp } from "lucide-react";
import { ChatBubble } from "../ChatBubble";
import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import { useAuthContext } from "~/context/AuthContext";
import { useSocket } from "~/context/SocketContext";
import { toast } from "sonner";

interface Message {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  message: string;
  createdAt: string;
  id: string;
}

interface Props {
  taskId: string | null;
}

export const Chat = ({ taskId }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuthContext();

  const socket = useSocket()

  useEffect(() => {
    if (!socket || !taskId) return;

    socket.emit('join-chat', { taskId })

    socket.on('new-message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(message)
    })

    socket.on('error-message', (response: { message: string }) => {
      toast.error(response.message)
    })
    
    return () => {
      socket.off('new-message')
      socket.emit('leave-chat-room', taskId)
    }
  }, [socket, taskId]);
  
  return (
    <div role="group" className="px-4 size-full flex flex-col pb-4">
      <h1 className="font-bold mb-8 mt-4">Conversación</h1>
      <div role="textbox" className="flex flex-col gap-5">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            user={message.user}
            message={message.message}
            createdAt={message.createdAt}
            isUser={message.user.id === user?.id}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <CirclePlus strokeWidth={1.5} />
        <FileImage strokeWidth={1.5} />
        <Paperclip strokeWidth={1.5} />
        <Input
          type="text"
          placeholder="Escribe un mensaje..."
          className="rounded-full py-6"
        />
        <ThumbsUp strokeWidth={1.5} />
      </div>
    </div>
  );
};
