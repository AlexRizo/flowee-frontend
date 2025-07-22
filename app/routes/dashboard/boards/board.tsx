import { getSanitizedSlug, getTitle } from "~/lib/utils";
import type { Route } from "./+types/board";
import { getBoardTasks } from "~/services/boards-service";
import { Column } from "~/components/dashboard/boards/Column";
import { columns } from "./helpers/board.data";

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
  const { tasks } = await getBoardTasks(slug);

  console.log(tasks);
}

const board = ({ params }: Route.ComponentProps) => {
  const { slug } = params;

  return <div role="grid" className="grid grid-cols-5 h-min max-h-full gap-4">
    {columns.map((column) => (
      <Column key={column.id} { ...column } tasks={[]} />
    ))}
  </div>;
};

export default board;
