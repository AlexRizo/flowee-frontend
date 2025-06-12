export const PageLoader = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-purple-500 rounded-full animate-spin-clockwise repeat-infinite" />
        </div>
        <p className="text-gray-500 text-sm animate-pulse">Cargando recursos...</p>
      </div>
    </div>
  )
}
