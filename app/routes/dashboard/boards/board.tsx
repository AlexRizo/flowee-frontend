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

const board = ({ params }: Route.ComponentProps) => {
  const { slug } = params;

  return <div>board: {slug}</div>;
};

export default board;
