import { type FC } from "react";
import { type IconName, LucideDynamicIcon } from "~/components/LucideDynamicIcon";

interface Props {
  name: TaskType;
  size?: number;
  className?: string;
}

type Icons = 'Smartphone' | 'ScrollText' | 'Store' | 'Sparkles';
type TaskType = 'DIGITAL' | 'PRINT' | 'ECOMMERCE' | 'SPECIAL';

const icons : Record<TaskType, Icons> = {
  'DIGITAL': 'Smartphone',
  'PRINT': 'ScrollText',
  'ECOMMERCE': 'Store',
  'SPECIAL': 'Sparkles',
}

export const TaskTypeIcon: FC<Props> = ({ name, size = 16, className = 'text-black' }) => {
  return <LucideDynamicIcon name={ icons[name as TaskType] as IconName } size={size} className={className} />;
};
