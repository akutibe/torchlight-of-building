import { createFileRoute } from "@tanstack/react-router";
import { EquipmentSection } from "../../components/builder/EquipmentSection";

export const Route = createFileRoute("/builder/equipment")({
  component: EquipmentPage,
});

function EquipmentPage(): React.ReactNode {
  return <EquipmentSection />;
}
