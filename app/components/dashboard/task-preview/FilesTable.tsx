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

const FileRow = ({ file }: { file: TaskFile }) => {
  return (
    <div
      key={file.id}
      role="row"
      className="flex items-center justify-between py-2 px-4"
    >
      <span className="flex items-center gap-1 text-xs">
        <LucideDynamicIcon name={getFileIcon(file.url)} size={16} />
        {getFileName(file)}
      </span>
      <aside className="flex items-center gap-5">
        <a href={file.url} target="_blank">
          <ExternalLink size={17} strokeWidth={1.5} />
        </a>
        <a href={getFlAttachmentUrl(file.url)} download target="_blank">
          <Download size={17} strokeWidth={1.5} />
        </a>
        <EllipsisVertical size={17} strokeWidth={1.5} />
      </aside>
    </div>
  );
};

export const FilesTable = ({ files }: { files?: TaskFile[] }) => {
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
      {files && files.length > 0 ? (
        files.map((file) => <FileRow key={file.id} file={file} />)
      ) : (
        <div role="row" className="flex items-center justify-center py-2 px-4">
          <span className="text-xs">No hay archivos</span>
        </div>
      )}
    </div>
  );
};
