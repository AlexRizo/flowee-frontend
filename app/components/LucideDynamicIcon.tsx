import { type FC } from "react";
import * as Icons from 'lucide-react';
import { cn } from "~/lib/utils";

export type IconName = keyof typeof Icons;

interface Props {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const LucideDynamicIcon: FC<Props> = ({ name, size = 16, strokeWidth = 1.5, className }) => {
  const DynamicIcon = Icons[name] as React.ComponentType<any>;

  if (!DynamicIcon) {
    return null;
  }

  return <DynamicIcon size={size} strokeWidth={strokeWidth} className={cn(className)} />;
};
