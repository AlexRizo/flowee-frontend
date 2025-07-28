import { type FC } from "react";
import * as Icons from 'lucide-react';

export type IconName = keyof typeof Icons;

interface Props {
  name: IconName;
  size?: number;
  color?: string;
}

export const LucideDynamicIcon: FC<Props> = ({ name, size = 16, color = 'black' }) => {
  const DynamicIcon = Icons[name] as React.ComponentType<any>;

  if (!DynamicIcon) {
    return null;
  }

  return <DynamicIcon size={size} color={color} />;
};
