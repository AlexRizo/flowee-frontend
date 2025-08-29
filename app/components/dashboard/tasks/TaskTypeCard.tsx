import { Circle, CircleCheck } from "lucide-react";
import { useMemo } from "react";
import { cn } from "~/lib/utils";

interface Props {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  selected: number | null;
  setSelected: (id: number | null) => void;
}

const taskBaseStyle =
  "bg-gray-100 rounded-2xl px-2.5 py-7.5 flex flex-col justify-center items-center cursor-pointer max-w-55 border border-gray-300 relative transition-all";

export const TaskTypeCard = ({
  id,
  name,
  description,
  icon,
  selected,
  setSelected,
}: Props) => {
  const handleClick = () => {
    if (selected === id) {
      setSelected(null);
    } else {
      setSelected(id);
    }
  };

  const isSelected = useMemo(() => selected === id, [selected, id]);

  return (
    <div
      onClick={handleClick}
      className={cn(
        taskBaseStyle,
        isSelected && "border-violet-700 bg-violet-50 shadow-md"
      )}
    >
      <div className="absolute top-2 right-2">
        {isSelected ? (
          <CircleCheck size={16} className="text-violet-700" />
        ) : (
          <Circle size={16} className="text-gray-400" />
        )}
      </div>
      {icon}
      <h2 className="text-3xl font-bold">{name}</h2>
      <p className="text-center">{description}</p>
    </div>
  );
};
