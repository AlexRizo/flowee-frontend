import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { DeliveriesTable } from "../DeliveriesTable";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { CreateDelivery } from "../deliveries/CreateDelivery";
import { useTaskPreview } from "~/context/TaskPreviewContext";
import { useEffect } from "react";
import { ProtectedItem } from "../../auth/ProtectedItem";
import { Roles } from "~/services/interfaces/users-service.interface";
import { DeliverySkeleton } from "../skeletons/DeliverySkeleton";

export const Deliveries = () => {
  const {
    taskDeliveries,
    handleGetTaskDeliveries,
    isLoadingTaskDeliveries,
    previewTask,
    resetTaskDeliveries,
  } = useTaskPreview();

  useEffect(() => {
    handleGetTaskDeliveries();
  }, [previewTask]);

  useEffect(() => {
    return () => {
      resetTaskDeliveries();
    };
  }, []);

  return (
    <div role="group" className="px-4 size-full flex flex-col">
      <header className="flex items-center justify-between mb-8 mt-4">
        <h1 className="font-bold">Listado de entregas</h1>
        {previewTask?.id && (
          <ProtectedItem
            allowedRoles={[
              Roles.ADMIN,
              Roles.DESIGN_MANAGER,
              Roles.PUBLISHER,
              Roles.PUBLISHER_MANAGER,
              Roles.SUPER_ADMIN,
            ]}
          >
            <CreateDelivery taskId={previewTask.id}>
              <Button size="sm" className="bg-violet-700 hover:bg-violet-800">
                <Plus />
                Agregar Entrega
              </Button>
            </CreateDelivery>
          </ProtectedItem>
        )}
      </header>
      <Alert className="border-none bg-yellow-50">
        <AlertTitle className="text-sm">Pro Tip</AlertTitle>
        <AlertDescription className="text-xs text-black">
          Crea todas las versiones necesarias. Nombra cada una de forma simple y
          escalable, pensando en que puedas generar múltiples entregables de
          este proyecto.
        </AlertDescription>
      </Alert>
      <div className="flex flex-col gap-4 mt-5">
        {isLoadingTaskDeliveries && !taskDeliveries ? (
          <DeliverySkeleton />
        ) : taskDeliveries ? (
          taskDeliveries?.map((delivery) => (
            <DeliveriesTable key={delivery.id} delivery={delivery} />
          ))
        ) : (
          <div className="flex items-center justify-center py-2 px-4">
            <span className="text-xs text-gray-500">No hay entregables</span>
          </div>
        )}
      </div>
    </div>
  );
};
