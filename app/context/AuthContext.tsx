import { createContext, useContext, useEffect, useState, type FC } from "react";
import { getMostHighestRole } from "~/helpers/userHelpers";
import type { AuthUser } from "~/services/interfaces/auth-service.interface";
import type { Roles } from "~/services/interfaces/users-service.interface";

interface User extends AuthUser {
  highestRole: Roles;
}

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  authUser: User;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children, authUser }) => {
  const [user, setUserState] = useState<User>(authUser);

  const setUser = (user: User): void => {
    setUserState(user);
  }

  useEffect(() => {
    const highestRole = getMostHighestRole(user.roles);
    setUserState({ ...user, highestRole });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = (): AuthContextType => {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error("useAuthContext debe ser usado dentro de AuthProvider");

  return ctx;
}