import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { FormatsTable } from "../FormatsTable";

export const Formats = () => {
  return (
    <div role="group" className="px-4 size-full flex flex-col">
      <h1 className="font-bold mb-8 mt-4">Listado de entregas</h1>
      <Alert className="border-none bg-yellow-50">
        <AlertTitle className="text-sm">Pro Tip</AlertTitle>
        <AlertDescription className="text-xs text-black">
          Crea todas las versiones necesarias. Nombra cada una de forma simple y
          escalable, pensando en que puedas generar múltiples entregables de
          este proyecto.
        </AlertDescription>
      </Alert>
      <FormatsTable formats={[]} />
    </div>
  );
};
