import { useEffect, useState } from "react";
import { Form, useActionData, useLoaderData, useSubmit, type SubmitFunction } from "react-router";
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
import { getBoards } from "~/services/boards-service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { User } from "~/services/interfaces/users-service.interface";

const formSchema = z.object({
  boards: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })),
});

export const AddBoardsModal = ({
  children,
  selectedBoards,
}: {
  children: React.ReactNode;
  selectedBoards: {id: string, name: string}[];
}) => {
  const [open, setOpen] = useState(false);
  const submit = useSubmit();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      boards: selectedBoards,
    },
  });

  const { user } = useLoaderData<{ user: User }>();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    const boards = data.boards.map((board) => board.id);

    formData.append("boards", JSON.stringify(boards));
    formData.append("userId", user.id);

    submit(formData, {
      method: "post",
    });
  };

  const { error, state, message } = useActionData<{
    error?: string;
    state: "idle" | "submitting" | "success" | "error";
    message?: string;
  }>() || { error: undefined, state: "idle", message: undefined };

  const { data:boardsQuery, isError, error:errorQuery } = useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const { boards, message } = await getBoards();

      if (!boards) throw new Error(message);

      return boards;
    },
    enabled: open,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      toast.error(errorQuery?.message);
    }
  }, [isError]);

  useEffect(() => {
    if (state === "success") {
      setOpen(false);
      form.reset({
        boards: selectedBoards,
      });
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
        </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] border-gray-300"
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
              name="boards"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelecBoards
                      boards={boardsQuery || []}
                      selectedBoards={field.value}
                      setSelectedBoards={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && state === "idle" && (
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
                  "Agregar tableros"
                )}
              </Button>
            </DialogFooter>
          </Form>
        </ShadcnForm>
      </DialogContent>
    </Dialog>
  );
};
