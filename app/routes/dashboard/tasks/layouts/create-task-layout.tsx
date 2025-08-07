import { Outlet } from "react-router";
import { CreateTaskProvider } from "~/context/CreateTaskContext";
import { CreateTaskCard } from "~/components/dashboard/tasks/create-task/CreateTaskCard";

const CreateTaskLayout = () => {
  return (
    <CreateTaskProvider>
      <CreateTaskCard>
        <Outlet />
      </CreateTaskCard>
    </CreateTaskProvider>
  );
};

export default CreateTaskLayout;
