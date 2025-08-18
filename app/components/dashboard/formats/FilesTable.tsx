import { File, Plus } from "lucide-react";

export const FilesTable = ({ files }: { files?: File[] }) => {
  return (
    <div role="table" className="border border-gray-200 rounded bg-gray-50">
      <div
        role="heading"
        className="flex items-center justify-between border-b border-gray-200 py-2 px-4"
      >
        <span className="text-xs text-gray-500">Nombre</span>
        <Plus size={16} strokeWidth={1.5} />
      </div>
      {files ? files.map((file) => (
        <div role="row" className="flex items-center justify-between py-2 px-4">
          <File size={16} strokeWidth={1.5} />
          <span className="text-xs">{file.name}</span>
        </div>
      )) : (
        <div role="row" className="flex items-center justify-center py-2 px-4">
          <span className="text-xs">No hay archivos</span>
        </div>
      )}
    </div>
  );
};
