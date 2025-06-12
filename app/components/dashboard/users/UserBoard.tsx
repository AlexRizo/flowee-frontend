export const UserBoard = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) => {
  return (
    <div
      role="button"
      className="rounded-xs bg-gray-300 w-full min-h-36 flex flex-col items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-transform"
      style={{ backgroundColor: color }}
    >
      {children}
    </div>
  );
};
