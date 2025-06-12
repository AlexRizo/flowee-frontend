import { ChevronRight, Home } from "lucide-react"
import { Fragment } from "react"
import { Link } from "react-router"
import { useBreadcrumbs } from "~/hooks/useBreadcrumbs"

export const Breadcrumbs = () => {
  const { breadcrumbs } = useBreadcrumbs()

  return (
    <div className="flex items-center gap-1.5">
      <Link to="/" className="text-gray-500">
        <Home size={16} strokeWidth={1.5}/>
      </Link>
      {breadcrumbs.segments.map((breadcrumb, index) => (
        <Fragment key={index}>
          <span className="text-gray-500">
            <ChevronRight size={16} strokeWidth={1.5}/>
          </span>
          <Link to={breadcrumbs.breadcrumbsPaths[index]} className="text-gray-500 text-xs">
            {breadcrumb.replace(/-/g, " ")}
          </Link>
        </Fragment>
      ))}
    </div>
  )
}
