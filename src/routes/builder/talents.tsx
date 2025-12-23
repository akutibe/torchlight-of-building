import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/builder/talents")({
  component: TalentsLayout,
});

function TalentsLayout(): React.ReactNode {
  return <Outlet />;
}
