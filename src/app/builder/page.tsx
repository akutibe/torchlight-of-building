"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BuilderLayout } from "../components/builder/BuilderLayout";
import { DivinitySection } from "../components/builder/DivinitySection";
import { EquipmentSection } from "../components/builder/EquipmentSection";
import { HeroSection } from "../components/builder/HeroSection";
import { PactspiritSection } from "../components/builder/PactspiritSection";
import { SkillsSection } from "../components/builder/SkillsSection";
import { TalentsSection } from "../components/builder/TalentsSection";
import type { ActivePage } from "../lib/types";
import { useBuilderStore } from "../stores/builderStore";

const BuilderPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const saveId = searchParams.get("id");

  const loadFromSave = useBuilderStore((state) => state.loadFromSave);
  const [mounted, setMounted] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>("equipment");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only hydration pattern
    setMounted(true);

    if (!saveId) {
      router.replace("/");
      return;
    }

    const success = loadFromSave(saveId);
    if (!success) {
      router.replace("/");
    }
  }, [saveId, router, loadFromSave]);

  if (!mounted) {
    return null;
  }

  return (
    <BuilderLayout activePage={activePage} setActivePage={setActivePage}>
      {activePage === "equipment" && <EquipmentSection />}
      {activePage === "talents" && <TalentsSection />}
      {activePage === "skills" && <SkillsSection />}
      {activePage === "hero" && <HeroSection />}
      {activePage === "pactspirit" && <PactspiritSection />}
      {activePage === "divinity" && <DivinitySection />}
    </BuilderLayout>
  );
};

const BuilderPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
          <div className="text-zinc-400">Loading...</div>
        </div>
      }
    >
      <BuilderPageContent />
    </Suspense>
  );
};

export default BuilderPage;
