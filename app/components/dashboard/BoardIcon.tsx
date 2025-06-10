export const BoardIcon = ({ prefix, color }: { prefix: string, color: string }) => {
  return (
    <span className="text-white rounded size-6 flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: color }}>
      { prefix }
    </span>
  )
}