import { Outlet } from 'react-router'
import { TaskProvider } from '~/context/TaskContext'

const TasksLayout = () => {
  return (
    <TaskProvider>
      <Outlet />
    </TaskProvider>
  )
}

export default TasksLayout