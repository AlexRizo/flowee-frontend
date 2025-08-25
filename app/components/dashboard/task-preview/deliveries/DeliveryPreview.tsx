import { AlertCircle } from "lucide-react";
import { useState } from "react";
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
import type { Delivery } from "~/services/interfaces/deliveries-interface";
import { DeliveryStatus } from "~/services/interfaces/deliveries-interface";
import { AcceptForm } from "./AcceptForm";
import { RejectForm } from "./RejectForm";

export const DeliveryPreview = ({
  delivery,
  isOpen,
  onOpenChange,
}: {
  delivery: Delivery | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Entregable: {delivery?.description}</SheetTitle>
          <SheetDescription>
            {delivery?.status === DeliveryStatus.REJECTED
              ? "El entregable ha sido rechazado."
              : delivery?.status === DeliveryStatus.PENDING
              ? "El entregable está pendiente de revisión."
              : "El entregable ha sido aceptado."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 p-4">
          <div className="relative">
            {isLoading && <Skeleton className="w-full h-full absolute" />}
            <img
              src={delivery?.url}
              alt={delivery?.filename}
              onLoad={() => setIsLoading(false)}
              className={`w-full max-h-48 object-contain rounded ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
          {delivery?.status === DeliveryStatus.REJECTED ||
          delivery?.status === DeliveryStatus.ACCEPTED ? (
            <article className="bg-gray-100 p-2 rounded-md">
              <h2 className="font-semibold">Comentarios:</h2>
              <p>{delivery?.comments ?? "No hay comentarios"}</p>
            </article>
          ) : (
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Esta entrega aún no ha sido revisada.
            </span>
          )}
        </div>
        <SheetFooter>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <AcceptForm deliveryId={delivery?.id ?? ""}>
                <Button className="bg-violet-500 hover:bg-violet-600 w-full">
                  Aceptar
                </Button>
              </AcceptForm>
            </div>
            <RejectForm deliveryId={delivery?.id ?? ""}>
              <Button variant="destructive">Rechazar</Button>
            </RejectForm>
          </div>
          <SheetClose asChild>
            <Button>Cerrar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
