export const BoardIcon = ({
  prefix,
  color,
}: {
  prefix: string;
  color: string;
}) => {
  return (
    <button
      className="text-white rounded-full size-7.5 flex items-center justify-center text-xs font-semibold border-2 border-gray-300 cursor-pointer"
      style={{ backgroundColor: color }}
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
