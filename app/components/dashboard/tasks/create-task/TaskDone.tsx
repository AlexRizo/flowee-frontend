import { Rocket } from "lucide-react";
import type { FC } from "react";

export const TaskDone: FC = () => {
  return (
    <div className="bg-white shadow-sm flex flex-col items-center justify-center">
      <Rocket className="size-10" />
      <h1 className="text-2xl font-bold">
        Solicitud enviada
      </h1>
      <p className="text-sm text-gray-500">
        Tu solicitud ha sido enviada correctamente.
      </p>
    </div>
  );
};
