import { Outlet } from "react-router";
import { AssignmentProvider } from "~/context/AssignmentContext";
import { useBoardContext } from "~/context/BoardContext";
import { getTitle } from "~/lib/utils";

export function meta() {
  return [
    {
      title: getTitle("Centro de asignaciones"),
    },
  ];
}

const AssignmentCenterLayout = () => {
  const { currentBoard } = useBoardContext();

  return (
    <AssignmentProvider boardId={currentBoard?.id}>
      <Outlet />
    </AssignmentProvider>
  );
};

export default AssignmentCenterLayout;
