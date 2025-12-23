import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/builder/talents/")({
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/builder/talents/$slot",
      params: { slot: "slot_1" },
      search,
    });
  },
  component: () => null,
});
