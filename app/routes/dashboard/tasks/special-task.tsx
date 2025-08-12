import { useEffect } from "react";
import { Confirmation } from "~/components/dashboard/tasks/create-task/special-task/Confirmation";
import { Description } from "~/components/dashboard/tasks/create-task/special-task/Description";
import { GeneralInfo } from "~/components/dashboard/tasks/create-task/special-task/GeneralInfo";
import { TecnicalDetails } from "~/components/dashboard/tasks/create-task/special-task/TecnicalDetails";
import { useCreateTaskContext } from "~/context/CreateTaskContext";
import type { Route } from "./+types/special-task";
import { getFormData } from "~/helpers/formDataHelper";
import { createSpecialTask } from "~/services/tasks-service";
import { toast } from "sonner";
import { useNavigation } from "react-router";

export function meta() {
  return [
    {
      title: "Crear: solicitud especial | Flowee",
    },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  const response = await createSpecialTask(formData);
  
  if (response.error) {
    toast.error(response.message);
  }
}

const SpecialTask = () => {
  const { step, handleSetStep } = useCreateTaskContext();
  
  useEffect(() => {
    if (step !== 2) {
      handleSetStep(2);
    }
  }, [])
  
  return (step === 1 || step === 2) ? (
    <GeneralInfo />
  ) : step === 3 ? (
    <Description />
  ) : step === 4 ? (
    <TecnicalDetails />
  ) : step === 5 ? (
    <Confirmation />
  ) : null
};

export default SpecialTask;
