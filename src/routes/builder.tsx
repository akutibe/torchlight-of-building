import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BuilderLayout } from "../components/builder/BuilderLayout";
import { useBuilderActions } from "../stores/builderStore";

export const Route = createFileRoute("/builder")({
  component: BuilderLayoutRoute,
  validateSearch: (
    search: Record<string, unknown>,
  ): { id: string | undefined } => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
});

function BuilderLayoutRoute(): React.ReactNode {
  const navigate = useNavigate();
  const { id: saveId } = Route.useSearch();

  const { loadFromSave } = useBuilderActions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (saveId === undefined) {
      navigate({ to: "/", replace: true });
      return;
    }

    const success = loadFromSave(saveId);
    if (!success) {
      navigate({ to: "/", replace: true });
    }
  }, [saveId, navigate, loadFromSave]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <BuilderLayout>
      <Outlet />
    </BuilderLayout>
  );
}
