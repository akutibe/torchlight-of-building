import { createFileRoute } from "@tanstack/react-router";
import { PactspiritSection } from "../../components/builder/PactspiritSection";

export const Route = createFileRoute("/builder/pactspirit")({
  component: PactspiritPage,
});

function PactspiritPage(): React.ReactNode {
  return <PactspiritSection />;
}
