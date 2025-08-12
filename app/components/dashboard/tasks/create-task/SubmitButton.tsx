import { Loader2 } from "lucide-react";
import type { FC } from "react";
import { useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface SubmitButtonProps {
  label?: string;
  loadingLabel?: string;
  className?: string;
  onClick?: () => void;
}

export const SubmitButton: FC<SubmitButtonProps> = ({
  label = "Siguiente",
  loadingLabel = "Cargando...",
  className,
  onClick,
}) => {
  const { state } = useNavigation();
  
  return (
    <Button
      type="submit"
      className={cn("text-white bg-violet-700 hover:bg-violet-600 font-bold text-xl w-67.5 py-7.5", className)}
      disabled={state !== "idle"}
      onClick={onClick}
    >
      {state !== "idle" ? (
        <span className="flex items-center gap-2">
          <Loader2 className="size-6 animate-spin-clockwise repeat-infinite" />
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </Button>
  );
};
