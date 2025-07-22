import { useMemo, type FC } from "react";
import type { Type } from "~/services/interfaces/boards-service.interface";
import { DynamicIcon } from 'lucide-react/dynamic';

interface Props {
  type: Type;
  size?: number;
  color?: string;
}

type IconName = 'smartphone' | 'scroll-text' | 'store' | 'sparkles';

const icons : Record<Type, IconName> = {
  'DIGITAL': 'smartphone',
  'IMPRESO': 'scroll-text',
  'ECOMMERCE': 'store',
  'OTRO': 'sparkles',
}

export const TaskTypeIcon: FC<Props> = ({ type, size = 16, color = 'black' }) => {
  const icon : IconName = useMemo(() => {
    return icons[type as keyof typeof icons];
  }, [type]);

  return <DynamicIcon name={icon} size={size} color={color} />;
};
