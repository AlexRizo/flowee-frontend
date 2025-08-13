import type { FC } from "react";
import { useAuthContext } from "~/context/AuthContext";
import type { Roles } from "~/services/interfaces/users-service.interface";

interface Props {
  children: React.ReactNode;
  allowedRoles: Roles[];
}

export const ProtectedItem: FC<Props> = ({ children, allowedRoles }) => {
  const { user } = useAuthContext();

  if ((!user || !user.highestRole) || !allowedRoles.includes(user.highestRole)) {
    return null;
  }

  return children;
};
