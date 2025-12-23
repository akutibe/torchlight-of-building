import { createFileRoute } from "@tanstack/react-router";
import { DivinitySection } from "../../components/builder/DivinitySection";

export const Route = createFileRoute("/builder/divinity")({
  component: DivinityPage,
});

function DivinityPage(): React.ReactNode {
  return <DivinitySection />;
}
