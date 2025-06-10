import { Bell } from "lucide-react"
import { Button } from "../ui/button"
import { Breadcrums } from "./Breadcrums"
import { Link } from "react-router"

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between w-full bg-white px-4 border-b border-gray-200 h-15">
      <div className="flex items-center gap-2">
        <Breadcrums />
      </div>
      <div className="flex items-center gap-2">
        <Link to="/">
          <Bell size={16} strokeWidth={1.5}/>
        </Link>
      </div>
    </nav>
  )
}
