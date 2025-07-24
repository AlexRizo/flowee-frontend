import { ImageUp } from "lucide-react";
import { useRef, useState } from "react";
import { Form, useSubmit } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useAuthContext } from "~/context/AuthContext";
import { createFormData } from "~/helpers/formDataHelper";

export const EditAvatar = ({ children }: { children: React.ReactNode }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const { user } = useAuthContext();

  const submit = useSubmit();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setFile(file);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = createFormData({
      file,
      userId: user.id,
      formType: "avatar",
    });

    submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="border-gray-200"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <DialogHeader>
          <div className="flex">
            <img
              src={user.avatar ? user.avatar : "/images/default-user.webp"}
              alt={`${user.name} avatar`}
              className="size-10 rounded-full object-cover mr-2"
            />
            <article>
              <DialogTitle>Editar avatar</DialogTitle>
              <DialogDescription>Actualiza tu foto de perfil</DialogDescription>
            </article>
          </div>
        </DialogHeader>
        <Form onSubmit={handleSubmit} id="avatar-form">
          <input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleFileChange}
            accept="image/*"
            name="avatar"
          />
          <div
            className={`p-4 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
              isDragging || file
                ? "border-violet-500 bg-violet-50"
                : "border-gray-200"
            }`}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <article className="flex flex-col items-center justify-center">
              <span className="p-4 flex items-center justify-center bg-gray-50 rounded-full">
                <ImageUp size={30} className="text-violet-500" />
              </span>
              {file ? (
                <p className="text-sm text-violet-500 text-center">
                  {file.name}
                </p>
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  Arrastra y suelta tu imagen o<br />
                  <span className="text-violet-500 cursor-pointer underline">
                    haz click para seleccionar
                  </span>
                </p>
              )}
            </article>
          </div>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setFile(null)}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={!file} form="avatar-form">
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
