import type { FC } from "react";
import { Link } from "react-router";
import { Bell, Search, Sun } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { BoardIcon } from "./BoardIcon";
import { useBoardContext } from "~/context/BoardContext";
import { useAuthContext } from "~/context/AuthContext";
import { cn } from "~/lib/utils";

export const Navbar: FC = () => {
  const { boards, setCurrentBoard, currentBoard, allow } = useBoardContext();
  const { user } = useAuthContext();

  return (
    <nav className="flex items-center justify-between w-full bg-white px-4 border-b border-gray-200 h-15 relative">
      <div className="flex items-center gap-2">
        <Breadcrumbs />
      </div>
      <div
        className={cn(
          "flex gap-1 p-1 rounded-full border border-gray-200 absolute left-1/2 -translate-x-1/2 transition-opacity",
          !allow && "opacity-60 pointer-events-none", !boards.length && "hidden"
        )}
      >
        {boards.map(({ id, prefix, color }) => (
          <BoardIcon
            key={id}
            prefix={prefix}
            color={color}
            onClick={() => setCurrentBoard(id)}
            active={currentBoard?.id === id}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Search size={16} strokeWidth={1.5} />
        <Bell size={16} strokeWidth={1.5} />
        <Sun size={16} strokeWidth={1.5} />
        <span className="text-gray-400">|</span>
        <Link to="/perfil" className="flex items-center gap-2">
          <span className="text-primary text-sm font-semibold">
            {user.name}
          </span>
          <img
            src={user.avatar ? user.avatar : "/images/default-user.webp"}
            alt={`${user.name} avatar`}
            className="size-6.5 rounded"
          />
        </Link>
      </div>
    </nav>
  );
};
