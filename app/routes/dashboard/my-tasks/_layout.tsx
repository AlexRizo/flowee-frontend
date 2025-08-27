import { Outlet } from 'react-router'
import { TaskProvider } from '~/context/TaskContext'

const MyTasksLayout = () => {
  return (
    <TaskProvider>
      <Outlet />
    </TaskProvider>
  )
}

export default MyTasksLayout