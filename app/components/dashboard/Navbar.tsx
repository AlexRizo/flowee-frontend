import { Bell } from "lucide-react"
import { Breadcrumbs } from "./Breadcrumbs"
import { Link } from "react-router"

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between w-full bg-white px-4 border-b border-gray-200 h-15">
      <div className="flex items-center gap-2">
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-2">
        <Link to="/">
          <Bell size={16} strokeWidth={1.5}/>
        </Link>
      </div>
    </nav>
  )
}
