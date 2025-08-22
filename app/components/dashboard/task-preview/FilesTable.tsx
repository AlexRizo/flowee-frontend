import { useMutation } from "@tanstack/react-query";
import {
  Download,
  EllipsisVertical,
  ExternalLink,
  Loader2,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LucideDynamicIcon } from "~/components/LucideDynamicIcon";
import { getFileIcon } from "~/helpers/fileHelper";
import type { TaskFile } from "~/services/interfaces/tasks-service.interface";
import { downloadFile } from "~/services/tasks-service";

const FileRow = ({ file }: { file: TaskFile }) => {
  const [idDownload, setIdDownload] = useState<string | null>(null);

  const { isPending, mutate: downloadFileMutate } = useMutation({
    mutationFn: async (id: string) => {
      const { signedUrl, message } = await downloadFile(id);

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

  return (
    <div
      key={file.id}
      role="row"
      className="flex items-center justify-between py-2 px-4"
    >
      <span className="flex items-center gap-1 text-xs">
        <LucideDynamicIcon name={getFileIcon(file.url)} size={16} />
        {file.name}
      </span>
      <aside className="flex items-center gap-5">
        <a href={file.url} target="_blank">
          <ExternalLink size={17} strokeWidth={1.5} />
        </a>
        <button
          onClick={() => handleDownload(file.id)}
          className="cursor-pointer disabled:opacity-50"
          disabled={isPending && idDownload === file.id}
        >
          {isPending && idDownload === file.id ? (
            <Loader2
              size={17}
              strokeWidth={1.5}
              className="animate-spin-clockwise repeat-infinite"
            />
          ) : (
            <Download size={17} strokeWidth={1.5} />
          )}
        </button>
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
