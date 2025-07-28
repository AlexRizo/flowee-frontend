import { type FC } from "react";
import { type IconName, LucideDynamicIcon } from "~/components/LucideDynamicIcon";

interface Props {
  name: TaskType;
  size?: number;
  color?: string;
}

type Icons = 'smartphone' | 'scroll-text' | 'store' | 'sparkles';
type TaskType = 'DIGITAL' | 'IMPRESO' | 'ECOMMERCE' | 'OTRO';

const icons : Record<TaskType, Icons> = {
  'DIGITAL': 'smartphone',
  'IMPRESO': 'scroll-text',
  'ECOMMERCE': 'store',
  'OTRO': 'sparkles',
}

export const TaskTypeIcon: FC<Props> = ({ name, size = 16, color = 'black' }) => {
  return <LucideDynamicIcon name={ icons[name as TaskType] as IconName } size={size} color={color} />;
};
