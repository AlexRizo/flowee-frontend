import { CircleAlert, ImageUp, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { type FetcherWithComponents } from "react-router";
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
import { createFormData } from "~/helpers/formDataHelper";

interface Props {
  children: React.ReactNode;
  fetcher: FetcherWithComponents<any>;
  userId: string;
  avatar: string | null;
}

export const EditAvatar: FC<Props> = ({ children, fetcher, userId, avatar = null }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

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
      userId,
      formType: "avatar",
    });

    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  const [open, setOpen] = useState<boolean>(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) setFile(null);
    setOpen(open);
  };

  useEffect(() => {
    if (fetcher.data?.url) {
      handleOpenChange(false);
    }
  }, [fetcher.data]);

  const { state } = fetcher;

  const formDisabled = useMemo(() => {
    return !file || state !== "idle";
  }, [file, state]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="border-gray-200"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <DialogHeader>
          <div className="flex">
            <img
              src={avatar ? avatar : "/images/default-user.webp"}
              alt="Avatar"
              className="size-10 rounded-full object-cover mr-2"
            />
            <article>
              <DialogTitle>Editar avatar</DialogTitle>
              <DialogDescription>Actualiza tu foto de perfil</DialogDescription>
            </article>
          </div>
        </DialogHeader>
        <fetcher.Form onSubmit={handleSubmit} id="avatar-form">
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
          <small className="text-gray-600 flex items-center gap-0.5 mt-1">
            <CircleAlert size={16} /> Tamaño máximo de 15MB.
          </small>
        </fetcher.Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" disabled={formDisabled} form="avatar-form">
            {state === "submitting" ? (
              <>
                <Loader2 className="animate-spin-clockwise repeat-infinite" />
                <span>Subiendo</span>
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
