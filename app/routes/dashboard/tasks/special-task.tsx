import { useEffect } from "react";
import { Description } from "~/components/dashboard/tasks/create-task/specal-task/Description";
import { GeneralInfo } from "~/components/dashboard/tasks/create-task/specal-task/GeneralInfo";
import { useCreateTaskContext } from "~/context/CreateTaskContext";

export function meta() {
  return [
    {
      title: "Crear: solicitud especial | Flowee",
    },
  ];
}

const SpecialTask = () => {
  const { handleSetSpecialTask, step, nextStep } = useCreateTaskContext();
  
  useEffect(() => {
    if (step === 1) {
      nextStep();
    }
  }, [])
  
  return (step === 1 || step === 2) ? (
    <GeneralInfo />
  ) : step === 3 ? (
    <Description />
  ) : step === 4 ? (
    <></>
  ) : step === 5 ? (
    <></>
  ) : null
};

export default SpecialTask;
