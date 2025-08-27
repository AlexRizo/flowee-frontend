import { Outlet } from "react-router";
import { TaskProvider } from "~/context/TaskContext";
import { TaskPreviewProvider } from "~/context/TaskPreviewContext";

const MyTasksLayout = () => {
  return (
    <TaskPreviewProvider>
      <TaskProvider>
        <Outlet />
      </TaskProvider>
    </TaskPreviewProvider>
  );
};

export default MyTasksLayout;
