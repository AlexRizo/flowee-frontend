import { getSanitizedSlug, getTitle } from "~/lib/utils";
import type { Route } from "./+types/board";

export function meta({ params }: Route.ComponentProps) {
  const { slug } = params;
  return [
    {
      title: getTitle(`Tablero ${getSanitizedSlug(slug)}`),
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;

  console.log('tasks');
}

const board = ({ params }: Route.ComponentProps) => {
  const { slug } = params;

  return <div role="grid" className="grid grid-cols-5 h-min max-h-full gap-4">
    {/* {columns.map((column) => (
      <Column key={column.id} { ...column } tasks={[]} activeTaskId={""} allowNewTask={false} />
    ))} */}
  </div>;
};

export default board;
