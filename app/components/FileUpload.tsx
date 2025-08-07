import React, { useEffect, useRef, useState, type FC } from "react";
import { useFormContext, type Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Clipboard, File, FileWarning, Paperclip, Trash, UploadIcon, X } from "lucide-react";
import { Badge } from "./ui/badge";

interface Props {
  control: Control<any>;
  label?: string;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
}

export const FileUpload: FC<Props> = ({
  control,
  label = "Archivos",
  maxSize = 5,
  accept = "image/*, application/pdf",
  multiple = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [invalidFiles, setInvalidFiles] = useState<string[]>([]);
  const { clearErrors, setValue } = useFormContext();

  const [maxFileSize] = useState(maxSize * 1024 * 1024);

  const handleAddFiles = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    handleClearErrors();

    const searchInvalidFilesSize = files.filter((file) => file.size > maxFileSize);
    
    if (searchInvalidFilesSize.length > 0) {
      setInvalidFiles(searchInvalidFilesSize.map((file) => file.name));
      setSelectedFiles(files);
      control.setError("files", { message: `El tamaño máximo por archivo es de ${maxSize}Mb` })
      return;
    }

    setSelectedFiles(files);
    setValue("files", files);
  };

  const handleClearErrors = () => {
    setInvalidFiles([]);
    setSelectedFiles([]);
    clearErrors("files");
  }

  const handleRemoveFile = (file: File) => {
    const newFiles = selectedFiles.filter(f => f.name !== file.name);
    setSelectedFiles(newFiles);
    setValue("files", newFiles);
    if (newFiles.length <= 5) {
      clearErrors("files");
    }
  }

  return (
    <>
      <FormField
        control={control}
        name="files"
        render={({ field: { name, onBlur, disabled } }) => (
          <FormItem className="w-full">
            <FormControl>
              <Input
                type="file"
                multiple={multiple}
                accept={accept}
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
              <p className="text-sm text-gray-500">{label}</p>
            </div>
            <div className="max-h-41 overflow-y-auto flex flex-col gap-1">
              {selectedFiles?.map((file, index) => (
                <span
                  key={file.name}
                  className="place-objects-center bg-gray-50 hover:bg-gray-100 transition-colors gap-2 w-full justify-start cursor-pointer py-1 px-2 rounded-md"
                >
                  {invalidFiles.includes(file.name) ? <FileWarning size={16} className="text-red-600" /> : <File size={16} />}
                  <small className="truncate">
                    {file.name.length > 25
                      ? file.name.slice(0, 25) + "..."
                      : file.name}{" "}
                    {invalidFiles.includes(file.name) && (
                      <span className="text-red-600">
                        {" "}
                        (Archivo demasiado grande)
                      </span>
                    )}
                  </small>
                  <Trash size={20} className="ml-auto" onClick={() => handleRemoveFile(file)} />
                </span>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
