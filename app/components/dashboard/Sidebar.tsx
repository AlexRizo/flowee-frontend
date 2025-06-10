import type { Board } from "~/services/interfaces/boards-service.interface"
import { SidebarMenuItem } from "./SidebarMenuItem"
import { ClipboardList, Home, LogOut, Rocket, Settings, Users } from "lucide-react"
import { BoardIcon } from "./BoardIcon"
import { SidebarMenuBoard } from "./SidebarMenuBoard"
import { Button } from "../ui/button"
import { Form } from "react-router"

export const Sidebar = ({ boards = [] }: { boards: Board[]}) => {
  return (
    <section className="min-w-60 h-screen bg-white border-r border-gray-200 p-4 flex flex-col">
      <header className="flex items-center gap-2">
        <h1 className="text-xl font-black ">Flowee</h1>
        <img src="/images/flowee.webp" alt="Flowee" className="w-4" />
      </header>
      <nav className="py-4 space-y-4">
        {/* ? Rutas estáticas */}
        <div className="flex flex-col gap-2">
          <small className="text-gray-400">Centro de control</small>
          <SidebarMenuItem to="/" label="Dashboard">
            <Home size={16} strokeWidth={1.5}/>
          </SidebarMenuItem>
          <SidebarMenuItem to="/centro-de-asignaciones" label="Centro de asignaciones">
            <ClipboardList size={16} strokeWidth={1.5}/>
          </SidebarMenuItem>
          <SidebarMenuItem to="/autoasignaciones" label="Autoasignaciones">
            <Rocket size={16} strokeWidth={1.5}/>
          </SidebarMenuItem>
        </div>

        {/* ? Rutas dinámicas */}
        <div className="flex flex-col gap-2">
          <small className="text-gray-400">Tableros</small>
          {boards.map((board) => (
            <SidebarMenuBoard to={`/tablero/${board.slug}`} label={board.name} key={board.id}>
              <BoardIcon prefix={board.prefix} color={board.color}/>
            </SidebarMenuBoard>
          ))}
        </div>

        {/* ? Rutas de configuración */}
        <div className="flex flex-col gap-2">
          <small className="text-gray-400">Configuración</small>
          <SidebarMenuItem to="/usuarios" label="Usuarios">
            <Users size={16} strokeWidth={1.5}/>
          </SidebarMenuItem>
          <SidebarMenuItem to="/configuracion" label="Configuración">
            <Settings size={16} strokeWidth={1.5}/>
          </SidebarMenuItem>
        </div>
      </nav>
      <Form method="post" action="/logout" className="mt-auto">
        <Button size="icon" className="w-full" type="submit">
          <LogOut size={16} strokeWidth={1.5}/>
          Cerrar sesión
        </Button>
      </Form>
    </section>
  )
}
