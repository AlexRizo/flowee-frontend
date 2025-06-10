import { NavLink } from "react-router";

export const SidebarMenuItem = ({
  to,
  children,
  label,
}: {
  to: string;
  children: React.ReactNode;
  label: string;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-2.5 h-9 rounded ${
          isActive ? "bg-violet-200 text-violet-700" : "bg-gray-100 text-gray-950"
        }`
      }
    >

      {children}
      <span className="text-gray-950 text-xs">{label}</span>
    </NavLink>
  );
};
