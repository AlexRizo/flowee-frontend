import { PageLoader } from "~/components/dashboard/PageLoader"
import { getTitle } from "~/lib/utils"

export function meta() {
  return [
    {
      title: getTitle('Centro de asignaciones'),
    }
  ]
}

const centroDeAsignaciones = () => {
  return (
    <PageLoader />
  )
}

export default centroDeAsignaciones