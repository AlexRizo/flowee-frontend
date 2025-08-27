import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

export const AlertTooltip = ({ total }: { total: number }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertCircle
            size={16}
            className={cn("ml-1", {
              "fill-yellow-500": total > 5 && total <= 10,
              "fill-red-500": total > 10,
            })}
          />
        </TooltipTrigger>
        <TooltipContent>
          {total > 10
            ? "El diseñador tiene una carga de trabajo alta"
            : "El diseñador tiene una carga de trabajo moderada"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
