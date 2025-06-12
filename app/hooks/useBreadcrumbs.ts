import { useEffect, useState } from "react"
import { useLocation } from "react-router"

export const useBreadcrumbs = () => {
  const { pathname } = useLocation()
  const [breadcrumbs, setBreadcrumbs] = useState<{ segments: string[], breadcrumbsPaths: string[] }>({ segments: [], breadcrumbsPaths: [] })

  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const segments = pathSegments.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));
    const breadcrumbsPaths = pathSegments.map((segment, index) => `/${pathSegments.slice(0, index + 1).join("/")}`);
    setBreadcrumbs({ segments, breadcrumbsPaths })
  }, [pathname])

  return {
    breadcrumbs,
  }
}