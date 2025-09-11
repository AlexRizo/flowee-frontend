import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { updateDoneUrl } from "~/services/versions-service";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { useAuthContext } from "~/context/AuthContext";
import { Roles } from "~/services/interfaces/users-service.interface";

const formSchema = z.object({
  doneUrl: z.string().min(1, { message: "La URL es requerida" }),
});

const checkForDesigner = (role?: Roles) => {
  if (!role) return false;
  if (
    role === Roles.DESIGNER ||
    role === Roles.DESIGN_MANAGER ||
    role === Roles.SUPER_ADMIN ||
    role === Roles.ADMIN
  ) {
    return true;
  }
  return false;
};

export const DoneUrlForm = ({ versionId, doneUrl }: { versionId: string, doneUrl: string | null }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      versionId,
      doneUrl,
    }: {
      versionId: string;
      doneUrl: string;
    }) => {
      const { message } = await updateDoneUrl(versionId, doneUrl);
      toast.info(message);
      return;
    },
  });

  const form = useForm({
    defaultValues: {
      doneUrl: doneUrl ?? "",
    },
    resolver: zodResolver(formSchema),
  });

  const { user } = useAuthContext();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate({ versionId, doneUrl: data.doneUrl });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
      >
        <FormField
          control={form.control}
          name="doneUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la entrega</FormLabel>
              <FormControl>
                <Input {...field} maxLength={100} disabled={!checkForDesigner(user.highestRole)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {checkForDesigner(user.highestRole) && (
          <Button type="submit" disabled={isPending}>
            {isPending ? "Espera..." : "Guardar"}
          </Button>
        )}
      </form>
    </Form>
  );
};
