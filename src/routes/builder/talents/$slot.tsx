import { createFileRoute, redirect } from "@tanstack/react-router";
import { TalentsSection } from "../../../components/builder/TalentsSection";
import {
  paramToTreeSlot,
  TALENT_SLOT_PARAMS,
  type TalentSlotParam,
} from "../../../lib/types";

export const Route = createFileRoute("/builder/talents/$slot")({
  component: TalentsSlotPage,
  beforeLoad: ({ params, search }) => {
    if (
      !TALENT_SLOT_PARAMS.includes(
        params.slot as (typeof TALENT_SLOT_PARAMS)[number],
      )
    ) {
      throw redirect({
        to: "/builder/talents/$slot",
        params: { slot: "slot_1" },
        search,
      });
    }
  },
});

function TalentsSlotPage(): React.ReactNode {
  const { slot } = Route.useParams();
  const treeSlot = paramToTreeSlot(slot as TalentSlotParam);

  return <TalentsSection activeTreeSlot={treeSlot} />;
}
