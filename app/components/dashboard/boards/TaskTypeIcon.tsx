import { type FC } from "react";
import { type IconName, LucideDynamicIcon } from "~/components/LucideDynamicIcon";

interface Props {
  name: TaskType;
  size?: number;
  color?: string;
}

type Icons = 'Smartphone' | 'ScrollText' | 'Store' | 'Sparkles';
type TaskType = 'DIGITAL' | 'IMPRESO' | 'ECOMMERCE' | 'ESPECIAL';

const icons : Record<TaskType, Icons> = {
  'DIGITAL': 'Smartphone',
  'IMPRESO': 'ScrollText',
  'ECOMMERCE': 'Store',
  'ESPECIAL': 'Sparkles',
}

export const TaskTypeIcon: FC<Props> = ({ name, size = 16, color = 'black' }) => {
  return <LucideDynamicIcon name={ icons[name as TaskType] as IconName } size={size} color={color} />;
};
