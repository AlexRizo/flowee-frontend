import {
  ChevronRight,
  Download,
  EllipsisVertical,
  ExternalLink,
  File,
  Plus,
} from "lucide-react";
import { LucideDynamicIcon } from "~/components/LucideDynamicIcon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  getFileIcon,
  getFileName,
  getFlAttachmentUrl,
} from "~/helpers/fileHelper";
import type {
  Format,
  FormatDelivery,
  TaskFile,
} from "~/services/interfaces/tasks-service.interface";

const FormatRow = ({ delivery }: { delivery: FormatDelivery }) => {
  return (
    <div role="row" className="flex items-center justify-between py-2 px-4">
      {/* <span className="flex items-center gap-1 text-xs">
        <LucideDynamicIcon name={getFileIcon(format.url)} size={16} />
        {getFileName(format)}
      </span>
      <aside className="flex items-center gap-5">
        <a href={format.url} target="_blank">
          <ExternalLink size={17} strokeWidth={1.5} />
        </a>
        <a href={getFlAttachmentUrl(format.url)} download target="_blank">
          <Download size={17} strokeWidth={1.5} />
        </a>
        <EllipsisVertical size={17} strokeWidth={1.5} />
      </aside> */}
      <pre>{JSON.stringify(delivery, null, 2)}</pre>
    </div>
  );
};

export const FormatsTable = ({ format }: { format: Format }) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="border border-gray-200 rounded bg-gray-50"
    >
      <AccordionItem
        value={format.id}
        role="heading"
        className="py-2 px-4"
      >
        <AccordionPrimitive.Header className="text-xs flex justify-between">
          <AccordionPrimitive.Trigger className="group flex items-center gap-2 w-full">
            <ChevronRight size={16} strokeWidth={1.5} className="transition-transform group-data-[state=open]:rotate-90"/>
            {format.description}
          </AccordionPrimitive.Trigger>
          <Plus size={16} strokeWidth={1.5} className="cursor-pointer" />
        </AccordionPrimitive.Header>
        <AccordionContent className="divide-y divide-gray-200">
          {format?.deliveries && format.deliveries.length ? (
            format.deliveries.map((delivery) => (
              <FormatRow key={delivery.id} delivery={delivery} />
            ))
          ) : (
            <div
              role="row"
              className="flex items-center justify-center py-2 px-4"
            >
              <span className="text-xs text-gray-500">No hay entregables</span>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
