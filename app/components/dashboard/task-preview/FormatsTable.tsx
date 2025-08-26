import {
  Ban,
  ChevronRight,
  Clock,
  Download,
  Loader2,
  MessageSquare,
  Plus,
  SquareCheckBig,
} from "lucide-react";
import { LucideDynamicIcon } from "~/components/LucideDynamicIcon";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from "~/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { getFileIcon } from "~/helpers/fileHelper";
import type { Format } from "~/services/interfaces/tasks-service.interface";
import {
  type Delivery,
  DeliveryStatus,
} from "~/services/interfaces/deliveries-interface";
import { CreateDelivery } from "./formats/CreateDelivery";
import { AddToTableTooltip } from "./tooltips/AddToTableTooltip";
import { useMutation } from "@tanstack/react-query";
import { downloadDelivery } from "~/services/tasks-service";
import { toast } from "sonner";
import { useState } from "react";
import { ProtectedItem } from "../auth/ProtectedItem";
import { Roles } from "~/services/interfaces/users-service.interface";
import { DeliveryPreview } from "./deliveries/DeliveryPreview";
import { DeliveryOptionsTooltip } from "./tooltips/DeliveryOptionsTooltip";

const FormatRow = ({
  delivery,
  version,
  handleDownload,
  isPending,
  idDownload,
  setDelivery,
  handleOpenChange,
}: {
  delivery: Delivery;
  version: number;
  handleDownload: (id: string) => void;
  isPending: boolean;
  idDownload: string | null;
  setDelivery: (delivery: Delivery) => void;
  handleOpenChange: (open: boolean) => void;
}) => {
  return (
    <div
      role="row"
      className={`flex items-center justify-between py-2 px-4 ${
        delivery.status === DeliveryStatus.REJECTED && "opacity-50"
      }`}
    >
      <span className="flex items-center gap-1 text-xs">
        <LucideDynamicIcon name={getFileIcon(delivery.filename)} size={16} />
        {`Versión ${version}: ${delivery.description}`}
      </span>
      <aside className="flex items-center gap-5">
        <button
          onClick={() => handleDownload(delivery.id)}
          className="cursor-pointer disabled:opacity-50"
        >
          {isPending && idDownload === delivery.id ? (
            <Loader2
              size={17}
              strokeWidth={1.5}
              className="animate-spin-clockwise repeat-infinite"
            />
          ) : (
            <Download size={17} strokeWidth={1.5} />
          )}
        </button>
        <button>
          {delivery.status === DeliveryStatus.ACCEPTED ? (
            <DeliveryOptionsTooltip content="Aceptado">
              <SquareCheckBig size={17} strokeWidth={1.5} />
            </DeliveryOptionsTooltip>
          ) : delivery.status === DeliveryStatus.PENDING ? (
            <DeliveryOptionsTooltip content="Pendiente">
              <Clock size={17} strokeWidth={1.5} />
            </DeliveryOptionsTooltip>
          ) : (
            <DeliveryOptionsTooltip content="Rechazado">
              <Ban size={17} strokeWidth={1.5} />
            </DeliveryOptionsTooltip>
          )}
        </button>
        <MessageSquare
          size={17}
          strokeWidth={1.5}
          className="cursor-pointer"
          onClick={() => {
            setDelivery(delivery);
            handleOpenChange(true);
          }}
        />
      </aside>
    </div>
  );
};

export const FormatsTable = ({ format }: { format: Format }) => {
  const disabledButton = () => {
    return format.deliveries?.some(
      (delivery) =>
        delivery.status === DeliveryStatus.PENDING ||
        delivery.status === DeliveryStatus.ACCEPTED
    );
  };

  const [idDownload, setIdDownload] = useState<string | null>(null);

  const { isPending, mutate: downloadFileMutate } = useMutation({
    mutationFn: async (id: string) => {
      const { signedUrl, message } = await downloadDelivery(id);

      if (message) {
        toast.error(message);
      }

      if (signedUrl) {
        window.open(signedUrl);
      }
    },
    onSettled() {
      setIdDownload(null);
    },
  });

  const handleDownload = (id: string) => {
    setIdDownload(id);
    downloadFileMutate(id);
  };

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDelivery(null);
    }
    setIsOpen(open);
  };

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="border border-gray-200 rounded bg-gray-50"
      >
        <AccordionItem value={format.id} role="heading">
          <AccordionPrimitive.Header className="text-xs flex px-4 py-2 bg-purple-100">
            <AccordionPrimitive.Trigger className="group flex items-center gap-2 w-full">
              <ChevronRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform group-data-[state=open]:rotate-90"
              />
              {format.description}
            </AccordionPrimitive.Trigger>
            <ProtectedItem
              allowedRoles={[
                Roles.ADMIN,
                Roles.SUPER_ADMIN,
                Roles.DESIGN_MANAGER,
                Roles.DESIGNER,
              ]}
            >
              <CreateDelivery
                formatId={format.id}
                formatDescription={format.description}
              >
                <button
                  className="flex items-center gap-2 w-36 cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabledButton()}
                >
                  <AddToTableTooltip
                    content={
                      disabledButton()
                        ? "Este formato tiene una versión pendiente o aceptada"
                        : "Agrega una nueva versión"
                    }
                  >
                    <div className="flex items-center gap-2">
                      Nueva versión
                      <Plus size={16} strokeWidth={2} />
                    </div>
                  </AddToTableTooltip>
                </button>
              </CreateDelivery>
            </ProtectedItem>
          </AccordionPrimitive.Header>
          <AccordionContent className="pb-0 divide-y divide-gray-200 border-t border-gray-200">
            {format?.deliveries && format.deliveries.length ? (
              format.deliveries
                .map((d) => d)
                .reverse()
                .map((delivery, index) => (
                  <FormatRow
                    key={delivery.id}
                    delivery={delivery}
                    version={index + 1}
                    handleDownload={handleDownload}
                    isPending={isPending}
                    idDownload={idDownload}
                    setDelivery={setDelivery}
                    handleOpenChange={handleOpenChange}
                  />
                ))
                .reverse()
            ) : (
              <div
                role="row"
                className="flex items-center justify-center py-2 px-4"
              >
                <span className="text-xs text-gray-500">
                  No hay entregables
                </span>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <DeliveryPreview
        delivery={delivery}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
      />
    </>
  );
};
