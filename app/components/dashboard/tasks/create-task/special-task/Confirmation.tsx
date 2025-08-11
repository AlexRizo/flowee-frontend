import { type FC } from "react";
import { SquarePen } from "lucide-react";
import { SubmitButton } from "../SubmitButton";
import { useCreateTaskContext } from "~/context/CreateTaskContext";
import { useSubmit } from "react-router";
import { createFormData } from "~/helpers/formDataHelper";

const Step: FC<{label: string, onClick: () => void}> = ({label, onClick}) => {
  return (
    <span onClick={onClick} className="flex items-center gap-1 text-gray-500 text-sm font-medium cursor-pointer">
      <SquarePen className="size-4"/>
      {label}
    </span>
  )
}

export const Confirmation: FC = () => {
  const { handleSetStep, specialTask } = useCreateTaskContext();

  const submit = useSubmit();

  const handleCreateTask = () => {
    const formData = createFormData(specialTask);

    submit(formData, {
      method: 'post',
      encType: 'multipart/form-data',
    })
  }

  return (
    <>
      <header className="text-center">
        <h1 className="text-xl font-bold mb-4">
          Confirmación
        </h1>
        <p>
          Revisa los detalles y confirma tu solicitud.
        </p>
      </header>
      <div className="place-objects-center flex-col h-full mt-4">
        <nav className="flex flex-col gap-2">
          <Step label="Nombre de la tarea" onClick={() => handleSetStep(2)} />
          <Step label="Fecha y hora" onClick={() => handleSetStep(2)} />
          <Step label="Descripción" onClick={() => handleSetStep(3)} />
          <Step label="Referencias" onClick={() => handleSetStep(3)} />
          <Step label="Medidas" onClick={() => handleSetStep(4)} />
          <Step label="Legales" onClick={() => handleSetStep(4)} />
          <Step label="Materiales" onClick={() => handleSetStep(4)} />
        </nav>
        <SubmitButton status="idle" className="mt-auto" label="Crear" onClick={handleCreateTask} />
      </div>
    </>
  );
};
