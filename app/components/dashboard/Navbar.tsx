import { Bell } from "lucide-react"
import { Breadcrumbs } from "./Breadcrumbs"
import { Link } from "react-router"
import type { Board } from "~/services/interfaces/boards-service.interface";
import type { FC } from "react";
import { SidebarMenuBoard } from "./SidebarMenuBoard";
import { BoardIcon } from "./BoardIcon";
import { useBoardContext } from "~/context/BoardContext";

export const Navbar = () => {
  const { boards } = useBoardContext();

  return (
    <nav className="flex items-center justify-between w-full bg-white px-4 border-b border-gray-200 h-15">
      <div className="flex items-center gap-2">
        <Breadcrumbs />
      </div>
      <div className="flex gap-1 p-1 rounded-full border border-gray-200">
        {boards.map((board) => (
          // <SidebarMenuBoard key={board.id}>
          <BoardIcon prefix={board.prefix} color={board.color}/>
          // </SidebarMenuBoard>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Link to="/">
          <Bell size={16} strokeWidth={1.5}/>
        </Link>
      </div>
    </nav>
  )
}
