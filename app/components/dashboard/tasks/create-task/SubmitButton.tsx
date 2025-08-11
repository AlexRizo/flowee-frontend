import { Loader2 } from "lucide-react";
import type { FC } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface SubmitButtonProps {
  label?: string;
  status: "idle" | "loading" | "submitting";
  className?: string;
  onClick?: () => void;
}

export const SubmitButton: FC<SubmitButtonProps> = ({
  label = "Siguiente",
  status,
  className,
  onClick,
}) => {
  return (
    <Button
      type="submit"
      className={cn("text-white bg-violet-700 hover:bg-violet-600 font-bold text-xl px-22.5 py-7.5", className)}
      disabled={status === "submitting"}
      onClick={onClick}
    >
      {status === "submitting" ? (
        <Loader2 className="size-4 animate-spin repeat-infinite" />
      ) : (
        label
      )}
    </Button>
  );
};
