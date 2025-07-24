import { Roles } from "~/services/interfaces/users-service.interface";

// Asigna una prioridad a cada rol según la jerarquía deseada
const rolePriority: Record<Roles, number> = {
  [Roles.SUPER_ADMIN]: 7,
  [Roles.ADMIN]: 6,
  [Roles.READER]: 5,
  [Roles.DESIGN_MANAGER]: 4,
  [Roles.PUBLISHER_MANAGER]: 3,
  [Roles.PUBLISHER]: 2,
  [Roles.DESIGNER]: 1,
};

// Devuelve el rol de mayor jerarquía según la prioridad definida en rolePriority
export const getMostHighestRole = (userRoles: Roles[]) => {
  return userRoles.reduce((max, role) => {
    return rolePriority[role] > rolePriority[max] ? role : max;
  }, userRoles[0]);
}