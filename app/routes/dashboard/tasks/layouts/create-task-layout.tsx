import { Outlet, useLocation } from "react-router";
import { CreateTaskProvider } from "~/context/CreateTaskContext";
import { CreateTaskCard } from "~/components/dashboard/tasks/create-task/CreateTaskCard";

const CreateTaskLayout = () => {
  const { pathname } = useLocation();
  
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
