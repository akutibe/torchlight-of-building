import { createFileRoute } from "@tanstack/react-router";
import { ConfigurationSection } from "../../components/builder/ConfigurationSection";

export const Route = createFileRoute("/builder/configuration")({
  component: ConfigurationPage,
});

function ConfigurationPage(): React.ReactNode {
  return <ConfigurationSection />;
}
