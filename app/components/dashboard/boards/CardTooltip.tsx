import type { FC, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface Props {
  children: ReactNode;
  text: string;
  className?: string;
  tooltipColor?: string;
}

export const CardTooltip: FC<Props> = ({
  children,
  text,
  className,
  tooltipColor = "none",
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "place-objects-center size-5 rounded bg-gray-100 text-xs",
            className
          )}
          {...(tooltipColor !== "none" && {
            style: { backgroundColor: tooltipColor },
          })}
        >
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};
