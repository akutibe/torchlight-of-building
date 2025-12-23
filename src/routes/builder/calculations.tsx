import { createFileRoute } from "@tanstack/react-router";
import { CalculationsSection } from "../../components/builder/CalculationsSection";

export const Route = createFileRoute("/builder/calculations")({
  component: CalculationsPage,
});

function CalculationsPage(): React.ReactNode {
  return <CalculationsSection />;
}
