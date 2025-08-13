import { FileInput, Rocket } from "lucide-react";
import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { useCreateTaskContext } from "~/context/CreateTaskContext";

export function meta() {
  return [
    {
      title: "Solicitud enviada | Flowee",
    },
  ];
}

const TaskDone = () => {
  const { specialTask, digitalTask, printTask, ecommerceTask, handleReset } =
    useCreateTaskContext();

  useEffect(() => {
    return () => handleReset();
  }, []);

  if (!specialTask && !digitalTask && !printTask && !ecommerceTask) {
    return <Navigate to="/centro-de-asignaciones" />;
  }

  return (
    <div className="bg-white shadow-sm flex flex-col items-center justify-center gap-6 w-[400px] h-[440px] mx-auto p-10 rounded-lg">
      <Rocket size={173} strokeWidth={1} />
      <p className="text-2xl font-bold text-center">
        El equipo revisará tu solicitud y le asignará un diseñador
      </p>
      <Link to="/centro-de-asignaciones">
        <Button>
          Ver en mis solicitudes
          <FileInput />
        </Button>
      </Link>
    </div>
  );
};

export default TaskDone;
