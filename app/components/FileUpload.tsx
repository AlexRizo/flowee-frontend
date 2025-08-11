import React, { useRef, useState, type FC } from "react";
import { useFormContext, type Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { File, FileWarning, Trash, UploadIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface Props {
  control: Control<any>;
  label?: string;
  description?: string;
  maxSize?: number;
  mimeTypes?: string[];
  multiple?: boolean;
  initialFiles?: File[];
}

const ACCEPTED_FILES = [
  // Imágenes
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
  // Documentos
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.oasis.opendocument.text",
  "text/plain",
  "text/rtf",
];

export const FileUpload: FC<Props> = ({
  initialFiles = [],
  control,
  label = "Archivos",
  description = "Arrastra los archivos aquí",
  maxSize = 5,
  mimeTypes = ACCEPTED_FILES.join(", "),
  multiple = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>(initialFiles);
  const [invalidFiles, setInvalidFiles] = useState<
    { razon: string; file: string }[]
  >([]);
  const { clearErrors, setValue, setError } = useFormContext();

  const [maxFileSize] = useState(maxSize * 1024 * 1024);

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleClearErrors();

    const searchInvalidFilesSize = files.filter(
      (file) => file.size > maxFileSize
    );

    if (searchInvalidFilesSize.length > 0) {
      setInvalidFiles((prev) => [
        ...prev,
        ...searchInvalidFilesSize.map((file) => {
          return {
            razon: "Archivo demasiado grande",
            file: file.name,
          };
        }),
      ]);
    }

    const searchInvalidFilesType = files.filter(
      (file) => !mimeTypes.includes(file.type)
    );

    if (searchInvalidFilesType.length > 0) {
      setInvalidFiles((prev) => [
        ...prev,
        ...searchInvalidFilesType.map((file) => {
          return {
            razon: "Archivo no permitido",
            file: file.name,
          };
        }),
      ]);
    }

    setSelectedFiles(files);
    setValue("files", files);
  };

  const handleClearErrors = () => {
    setInvalidFiles([]);
    setSelectedFiles([]);
    clearErrors("files");
  };

  const handleRemoveFile = (file: File) => {
    const newFiles = selectedFiles.filter((f) => f.name !== file.name);
    setSelectedFiles(newFiles);
    setValue("files", newFiles);
    if (newFiles.length <= 5) {
      clearErrors("files");
    }
  };

  return (
    <>
      <FormField
        control={control}
        name="files"
        render={({ field: { name, onBlur, disabled } }) => (
          <FormItem className="w-full">
            <FormLabel>{ label }</FormLabel>
            <FormControl>
              <Input
                type="file"
                multiple={multiple}
                accept="image/*, application/pdf"
                className="hidden"
                name={name}
                onBlur={onBlur}
                onChange={handleAddFiles}
                disabled={disabled}
                ref={inputRef}
              />
            </FormControl>
            <div
              className="place-objects-center flex-col gap-2 w-full py-6 px-4 rounded-lg border border-gray-300 bg-gray-50 border-dashed transition-colors cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              <UploadIcon size={24} className="text-gray-500" />
              <p className="text-sm text-gray-500">{ description }</p>
            </div>
            <div
              className={cn(
                "max-h-41 overflow-y-auto hidden flex-col gap-1",
                selectedFiles.length > 0 && "flex"
              )}
            >
              {selectedFiles?.map((file, index) => (
                <FileItem
                  key={file.name}
                  file={file}
                  onRemove={() => handleRemoveFile(file)}
                  isInvalid={invalidFiles.some(
                    (invalidFile) => invalidFile.file === file.name
                  )}
                  razon={
                    invalidFiles.find(
                      (invalidFile) => invalidFile.file === file.name
                    )?.razon || ""
                  }
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const FileItem = ({
  file,
  onRemove,
  isInvalid,
  razon,
}: {
  file: File;
  onRemove: () => void;
  isInvalid: boolean;
  razon: string;
}) => {
  return (
    <span className="place-objects-center bg-gray-50 hover:bg-gray-100 transition-colors gap-2 w-full justify-start cursor-pointer py-1 px-2 rounded-md">
      {isInvalid ? (
        <FileWarning size={16} className="text-red-600" />
      ) : (
        <File size={16} />
      )}
      <small className="truncate">
        {isInvalid ? file.name.slice(0, 25) + "..." : file.name}{" "}
        {isInvalid && <span className="text-red-600"> ({razon})</span>}
      </small>
      <Trash size={20} className="ml-auto" onClick={onRemove} />
    </span>
  );
};
