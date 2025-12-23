import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "../../components/builder/HeroSection";

export const Route = createFileRoute("/builder/hero")({
  component: HeroPage,
});

function HeroPage(): React.ReactNode {
  return <HeroSection />;
}
