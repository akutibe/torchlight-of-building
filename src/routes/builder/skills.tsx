import { createFileRoute } from "@tanstack/react-router";
import { SkillsSection } from "../../components/builder/SkillsSection";

export const Route = createFileRoute("/builder/skills")({
  component: SkillsPage,
});

function SkillsPage(): React.ReactNode {
  return <SkillsSection />;
}
