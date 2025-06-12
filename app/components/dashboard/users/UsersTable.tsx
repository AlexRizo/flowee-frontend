import { Eye, Pencil, Trash } from "lucide-react"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Roles, type User } from "~/services/interfaces/users-service.interface"

const setRoles = (roles: Roles[]) => {
  const rolesMap = {
    [Roles.ADMIN]: 'Administrador',
    [Roles.SUPER_ADMIN]: 'Super administrador',
    [Roles.PUBLISHER]: 'Publicador',
    [Roles.DESIGNER]: 'Diseñador',
    [Roles.DESIGN_MANAGER]: 'Gestor de diseño',
    [Roles.PUBLISHER_MANAGER]: 'Gestor de publicaciones',
    [Roles.READER]: 'Lector',
  }

  if (roles.length === 0) {
    return 'N/A'
  }

  if (roles.length <= 2) {
    return roles.map((role) => rolesMap[role]).join(', ')
  }

  return `${rolesMap[roles[0]]}, ${rolesMap[roles[1]]}...(${roles.length - 2})`
}

export const UsersTable = ({ users = [] }: { users: User[] }) => {
  return (
    <Table className="bg-white rounded shadow mt-4">
      <TableCaption>Listado de usuarios.</TableCaption>
      <TableHeader>
        <TableRow className="border-gray-300">
          <TableHead className="w-[100px] text-center">N°</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead className="text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={user.id} className="border-gray-200">
            <TableCell className="font-medium text-center">{index + 1}</TableCell>
            <TableCell>@{user.nickname}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{setRoles(user.roles)}</TableCell>
          <TableCell className="items-center justify-center flex">
            <Link to={`/usuarios/${user.nickname}`} className="bg-blue-500 text-white p-1.5 rounded">
              <Eye size={16} strokeWidth={1.5}/>
            </Link>
          </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
