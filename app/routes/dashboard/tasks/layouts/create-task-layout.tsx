import { Outlet } from "react-router";

const CreateTaskLayout = () => {
  return (
    <div className="place-objects-center flex-col m-auto bg-white rounded-lg px-18 py-8 w-[650px] shadow-sm">
      <Outlet/>
    </div>
  )
}

export default CreateTaskLayout;