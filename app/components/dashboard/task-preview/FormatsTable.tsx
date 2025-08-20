import {
  Download,
  EllipsisVertical,
  ExternalLink,
  File,
  Plus,
} from "lucide-react";
import { LucideDynamicIcon } from "~/components/LucideDynamicIcon";
import { getFileIcon, getFileName, getFlAttachmentUrl } from "~/helpers/fileHelper";
import type { TaskFile } from "~/services/interfaces/tasks-service.interface";

const FormatRow = ({ format }: { format: TaskFile }) => {
  return (
    <div
      key={format.id}
      role="row"
      className="flex items-center justify-between py-2 px-4"
    >
      <span className="flex items-center gap-1 text-xs">
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
      </aside>
    </div>
  );
};

export const FormatsTable = ({ formats }: { formats?: TaskFile[] }) => {
  return (
    <div
      role="table"
      className="border border-gray-200 rounded bg-gray-50 divide-y divide-gray-200"
    >
      <div
        role="heading"
        className="flex items-center justify-between py-2 px-4"
      >
        <span className="text-xs text-gray-500">Nombre</span>
        <Plus size={16} strokeWidth={1.5} />
      </div>
      {formats && formats.length > 0 ? (
        formats.map((format) => <FormatRow key={format.id} format={format} />)
      ) : (
        <div role="row" className="flex items-center justify-center py-2 px-4">
          <span className="text-xs">No hay archivos</span>
        </div>
      )}
    </div>
  );
};
