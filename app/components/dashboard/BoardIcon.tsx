import type { FC, MouseEventHandler } from "react";
import { cn } from "~/lib/utils";

interface Props {
  prefix: string;
  color: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  active: boolean;
}

export const BoardIcon: FC<Props> = ({
  prefix,
  color,
  onClick,
  active,
}) => {
  return (
    <button
      className={cn(
        "text-white rounded-full size-7.5 flex items-center justify-center text-xs font-semibold border-2 cursor-pointer",
        active ? "border-purple-500 animate-heartbeat"  : "border-gray-200"
      )}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {prefix}
    </button>
  );
};

{
  /* <span className="text-white rounded size-6 flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: color }}>
{ prefix }
</span> */
}
