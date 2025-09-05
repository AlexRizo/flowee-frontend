import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Skeleton } from "~/components/ui/skeleton";
import type { Version } from "~/services/interfaces/versions-interface";
import { VersionStatus } from "~/services/interfaces/versions-interface";
import { AcceptForm } from "./AcceptForm";
import { RejectForm } from "./RejectForm";
import { ProtectedItem } from "../../auth/ProtectedItem";
import { Roles } from "~/services/interfaces/users-service.interface";
import { useTaskPreview } from "~/context/TaskPreviewContext";

export const VersionPreview = ({
  version,
  isOpen,
  onOpenChange,
}: {
  version: Version | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { taskDeliveries } = useTaskPreview();

  const notAllowed = useMemo(() => {
    if (!taskDeliveries || !version?.deliveryId) return false;

    const deliveryIndex = taskDeliveries.findIndex(
      (delivery) => delivery.id === version.deliveryId
    );

    const delivery = taskDeliveries[deliveryIndex];

    const somePending = delivery.versions?.some((v) => v.status === VersionStatus.PENDING);
    const someAccepted = delivery.versions?.some((v) => v.status === VersionStatus.ACCEPTED);
    const currentVersion = delivery.versions?.find(
      (v) => v.id === version?.id
    );

    if (currentVersion?.status === VersionStatus.REJECTED && somePending) return true;
    if (currentVersion?.status === VersionStatus.REJECTED && someAccepted) return true;
  }, [taskDeliveries, version?.deliveryId]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Entregable: {version?.description}</SheetTitle>
          <SheetDescription>
            {version?.status === VersionStatus.REJECTED
              ? "La versión ha sido rechazada."
              : version?.status === VersionStatus.PENDING
              ? "La versión está pendiente de revisión."
              : "La versión ha sido aceptada."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 p-4">
          <div className="relative">
            {isLoading && <Skeleton className="w-full h-full absolute" />}
            <img
              src={version?.url}
              alt={version?.filename}
              onLoad={() => setIsLoading(false)}
              className={`w-full max-h-48 object-contain rounded ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
          {version?.status === VersionStatus.REJECTED ||
          version?.status === VersionStatus.ACCEPTED ? (
            <article className="bg-gray-100 p-2 rounded-md">
              <h2 className="font-semibold">Comentarios:</h2>
              <p>{version?.comments ?? "No hay comentarios"}</p>
            </article>
          ) : (
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Esta versión aún no ha sido revisada.
            </span>
          )}
        </div>
        <SheetFooter>
          <ProtectedItem
            allowedRoles={[
              Roles.ADMIN,
              Roles.PUBLISHER,
              Roles.DESIGN_MANAGER,
              Roles.SUPER_ADMIN,
              Roles.PUBLISHER_MANAGER,
            ]}
          >
            {!notAllowed && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <AcceptForm
                  deliveryId={version?.deliveryId ?? ""}
                  versionId={version?.id ?? ""}
                >
                  <Button
                    className="bg-violet-500 hover:bg-violet-600 w-full"
                    disabled={version?.status === VersionStatus.ACCEPTED}
                  >
                    Aceptar
                  </Button>
                </AcceptForm>
              </div>
              <RejectForm
                deliveryId={version?.deliveryId ?? ""}
                versionId={version?.id ?? ""}
              >
                <Button
                  variant="destructive"
                  disabled={version?.status === VersionStatus.REJECTED}
                >
                  Rechazar
                </Button>
              </RejectForm>
            </div>
            )}
          </ProtectedItem>
          <SheetClose asChild>
            <Button>Cerrar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
