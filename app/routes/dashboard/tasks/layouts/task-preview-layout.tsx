import { Outlet } from 'react-router';
import { TaskPreviewProvider } from '~/context/TaskPreviewContext';

const TaskPreviewLayout = () => {
  return (
    <TaskPreviewProvider>
      <Outlet />
    </TaskPreviewProvider>
  )
}

export default TaskPreviewLayout;