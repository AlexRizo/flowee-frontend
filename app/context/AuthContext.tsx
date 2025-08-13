import { createContext, useContext, useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router";
import { getMostHighestRole } from "~/helpers/userHelpers";
import type { AuthUser } from "~/services/interfaces/auth-service.interface";
import type { Roles } from "~/services/interfaces/users-service.interface";

interface User extends AuthUser {
  highestRole?: Roles;
}

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  protectedRoute: (allowedRoles: Roles[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  authUser: User;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children, authUser }) => {
  const [user, setUserState] = useState<User>(authUser);
  const navigate = useNavigate();

  const setUser = (user: User): void => {
    setUserState(user);
  };

  useEffect(() => {
    const highestRole = getMostHighestRole(user.roles);
    setUserState({ ...user, highestRole });
  }, []);

  const protectedRoute = (allowedRoles: Roles[]) => {
    if (
      !user ||
      !user.highestRole ||
      !allowedRoles.includes(user.highestRole)
    ) {
      return false;
    }

    return true;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, protectedRoute }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const ctx = useContext(AuthContext);

  if (!ctx)
    throw new Error("useAuthContext debe ser usado dentro de AuthProvider");

  return ctx;
};
