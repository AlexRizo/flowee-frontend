import { Navigate, Outlet, useLocation } from "react-router";
import { CreateTaskProvider } from "~/context/CreateTaskContext";
import { CreateTaskCard } from "~/components/dashboard/tasks/create-task/CreateTaskCard";
import { useAuthContext } from "~/context/AuthContext";
import { Roles } from "~/services/interfaces/users-service.interface";

const CreateTaskLayout = () => {
  const { pathname } = useLocation();
  const { protectedRoute } = useAuthContext();

  if (!protectedRoute([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.PUBLISHER_MANAGER, Roles.DESIGN_MANAGER])) {
    return <Navigate to="/" />;
  }
  
  return (
    <CreateTaskProvider>
      {
        pathname.includes('solicitud-enviada') ? (
          <Outlet />
        ) : (
          <CreateTaskCard>
            <Outlet />
          </CreateTaskCard>
        )
      }
    </CreateTaskProvider>
  );
};

export default CreateTaskLayout;
