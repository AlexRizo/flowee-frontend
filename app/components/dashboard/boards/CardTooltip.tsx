import type { FC, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"

interface Props {
  children: ReactNode;
  text: string;
}

export const CardTooltip: FC<Props> = ({ children, text }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}
