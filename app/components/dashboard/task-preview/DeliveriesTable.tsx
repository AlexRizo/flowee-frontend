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
import type { Delivery } from "~/services/interfaces/tasks-service.interface";
import {
  type Version,
  VersionStatus,
} from "~/services/interfaces/versions-interface";
import { AddToTableTooltip } from "./tooltips/AddToTableTooltip";
import { useMutation } from "@tanstack/react-query";
import { downloadVersion } from "~/services/tasks-service";
import { toast } from "sonner";
import { useMemo, useState, type FC } from "react";
import { ProtectedItem } from "../auth/ProtectedItem";
import { Roles } from "~/services/interfaces/users-service.interface";
import { VersionPreview } from "./versions/VersionPreview";
import { DeliveryOptionsTooltip } from "./tooltips/DeliveryOptionsTooltip";
import { CreateVersion } from "./deliveries/CreateVersion";

interface FormatRowProps {
  version: Version;
  number: number;
  handleDownload: (id: string) => void;
  isPending: boolean;
  idDownload: string | null;
  setVersion: (version: Version) => void;
  handleOpenChange: (open: boolean) => void;
}

const FormatRow: FC<FormatRowProps> = ({
  version,
  number,
  handleDownload,
  isPending,
  idDownload,
  setVersion,
  handleOpenChange,
}) => {
  return (
    <div
      role="row"
      className={`flex items-center justify-between py-2 px-4 ${
        version.status === VersionStatus.REJECTED && "opacity-50"
      }`}
    >
      <span className="flex items-center gap-1 text-xs">
        <LucideDynamicIcon name={getFileIcon(version.filename)} size={16} />
        {`Versión ${number}: ${version.description}`}
      </span>
      <aside className="flex items-center gap-5">
        <button
          onClick={() => handleDownload(version.id)}
          className="cursor-pointer disabled:opacity-50"
        >
          {isPending && idDownload === version.id ? (
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
          {version.status === VersionStatus.ACCEPTED ? (
            <DeliveryOptionsTooltip content="Aceptada">
              <SquareCheckBig size={17} strokeWidth={1.5} />
            </DeliveryOptionsTooltip>
          ) : version.status === VersionStatus.PENDING ? (
            <DeliveryOptionsTooltip content="Pendiente">
              <Clock size={17} strokeWidth={1.5} />
            </DeliveryOptionsTooltip>
          ) : (
            <DeliveryOptionsTooltip content="Rechazada">
              <Ban size={17} strokeWidth={1.5} />
            </DeliveryOptionsTooltip>
          )}
        </button>
        <MessageSquare
          size={17}
          strokeWidth={1.5}
          className="cursor-pointer"
          onClick={() => {
            setVersion(version);
            handleOpenChange(true);
          }}
        />
      </aside>
    </div>
  );
};

export const DeliveriesTable = ({ delivery }: { delivery: Delivery }) => {
  const disabledButton = () => {
    return delivery.versions?.some(
      (version) =>
        version.status === VersionStatus.PENDING ||
        version.status === VersionStatus.ACCEPTED
    );
  };

  const [idDownload, setIdDownload] = useState<string | null>(null);

  const { isPending, mutate: downloadFileMutate } = useMutation({
    mutationFn: async (id: string) => {
      const { signedUrl, message } = await downloadVersion(id);

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

  const [version, setVersion] = useState<Version | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setVersion(null);
      }, 500);
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
        <AccordionItem value={delivery.id} role="heading">
          <AccordionPrimitive.Header className="text-xs flex px-4 py-2 bg-purple-100">
            <AccordionPrimitive.Trigger className="group flex items-center gap-2 w-full">
              <ChevronRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform group-data-[state=open]:rotate-90"
              />
              {delivery.description}
            </AccordionPrimitive.Trigger>
            <ProtectedItem
              allowedRoles={[
                Roles.ADMIN,
                Roles.SUPER_ADMIN,
                Roles.DESIGN_MANAGER,
                Roles.DESIGNER,
              ]}
            >
              <CreateVersion
                deliveryId={delivery.id}
                deliveryDescription={delivery.description}
              >
                <button
                  className="flex items-center gap-2 w-36 cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabledButton()}
                >
                  <AddToTableTooltip
                    content={
                      disabledButton()
                        ? "Esta entrega tiene una versión pendiente o aceptada"
                        : "Agrega una nueva versión"
                    }
                  >
                    <div className="flex items-center gap-2">
                      Nueva versión
                      <Plus size={16} strokeWidth={2} />
                    </div>
                  </AddToTableTooltip>
                </button>
              </CreateVersion>
            </ProtectedItem>
          </AccordionPrimitive.Header>
          <AccordionContent className="pb-0 divide-y divide-gray-200 border-t border-gray-200">
            {delivery?.versions && delivery.versions.length ? (
              delivery.versions
                .map((d) => d)
                .reverse()
                .map((version, index) => (
                  <FormatRow
                    key={version.id}
                    version={version}
                    number={index + 1}
                    handleDownload={handleDownload}
                    isPending={isPending}
                    idDownload={idDownload}
                    setVersion={setVersion}
                    handleOpenChange={handleOpenChange}
                  />
                ))
                .reverse()
            ) : (
              <div
                role="row"
                className="flex items-center justify-center py-2 px-4"
              >
                <span className="text-xs text-gray-500">No hay versiones</span>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <VersionPreview
        version={version}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
      />
    </>
  );
};
