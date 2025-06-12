import { useState } from "react";
import { Form, useActionData, useSubmit, type SubmitFunction } from "react-router";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import {
  Form as ShadcnForm,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert } from "~/components/Alert";
import { SelecBoards } from "./SelecBoards";
import type { Board } from "~/services/interfaces/boards-service.interface";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  boards: z.array(z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
    slug: z.string(),
    prefix: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })),
  intent: z.string(),
});

export const AddBoardsModal = ({
  children,
  boards,
}: {
  children: React.ReactNode;
  boards: Board[];
}) => {
  const [open, setOpen] = useState(false);
  const [reseted, setReseted] = useState(false);
  const submit = useSubmit();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      boards: [],
      intent: "add-boards",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    submit(data, {
      method: "post",
    });
  };

  const { error, state, message } = useActionData<{
    error?: string;
    state: "idle" | "submitting" | "success" | "error";
    message?: string;
  }>() || { error: undefined, state: "idle", message: undefined };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
        </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] border-gray-300"
        onCloseAutoFocus={() => form.reset()}
      >
        <DialogHeader>
          <DialogTitle>Agregar tableros</DialogTitle>
          <DialogDescription>
            Agrega tableros a la cuenta del usuario.
          </DialogDescription>
        </DialogHeader>
        <ShadcnForm {...form}>
          <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
              control={form.control}
              name="intent"
              render={({ field }) => (
                <Input type="hidden" value={field.value}/>
              )}
            />
            <FormField
              control={form.control}
              name="boards"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelecBoards
                      boards={boards}
                      selectedBoards={field.value}
                      setSelectedBoards={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && state === "idle" && !reseted && (
              <Alert
                title="No se han podido agregar los tableros"
                content={message}
                variant="destructive"
              />
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={state === "submitting"}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={state === "submitting" || form.watch("boards").length === 0}>
                {state === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin-clockwise repeat-infinite" />
                    <span>Creando...</span>
                  </>
                ) : (
                  "Crear usuario"
                )}
              </Button>
            </DialogFooter>
          </Form>
        </ShadcnForm>
      </DialogContent>
    </Dialog>
  );
};
