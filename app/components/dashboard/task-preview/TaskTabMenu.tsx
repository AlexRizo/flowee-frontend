import type { FC } from "react";
import {
  LucideDynamicIcon,
  type IconName,
} from "~/components/LucideDynamicIcon";
import { cn } from "~/lib/utils";

const TabItem = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: IconName;
  label: string;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <span
      className={cn(
        "flex flex-col items-center justify-center text-xs gap-1 h-1/8 cursor-pointer transition-colors",
        active && "text-purple-500"
      )}
      onClick={onClick}
    >
      <LucideDynamicIcon
        name={icon}
        size={24}
        className={`transition-colors ${
          active ? "text-purple-500" : "text-black"
        }`}
      />
      {label}
    </span>
  );
};

type Tab = "Detalles" | "Chat" | "Entregables";

interface Props {
  tab: Tab;
  setTab: (tab: Tab) => void;
}

export const TaskTabMenu: FC<Props> = ({ tab, setTab }) => {
  const handleTabClick = (tab: Tab) => {
    setTab(tab);
  };

  return (
    <nav className="min-w-20 flex flex-col border border-gray-200 divide-y divide-gray-200">
      <TabItem
        icon="Text"
        label="Detalles"
        active={tab === "Detalles"}
        onClick={() => handleTabClick("Detalles")}
      />
      <TabItem
        icon="MessagesSquare"
        label="Chat"
        active={tab === "Chat"}
        onClick={() => handleTabClick("Chat")}
      />
      <TabItem
        icon="FileStack"
        label="Entregas"
        active={tab === "Entregables"}
        onClick={() => handleTabClick("Entregables")}
      />
    </nav>
  );
};
