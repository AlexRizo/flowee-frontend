import { Skeleton } from "~/components/ui/skeleton"

export const FormatSkeleton = () => {

  const getIterations = () => {
    const i = Math.floor(Math.random() * 4) + 1;
    return Array.from({ length: i }, (_, index) => index);
  }
  
  return (
    <div className="flex flex-col gap-4">
      {getIterations().map((iteration) => (
        <Skeleton key={iteration} className="h-10 w-full" />
      ))}
    </div>
  )
}
