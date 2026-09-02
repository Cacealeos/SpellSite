import { useState } from "react";

import { Mastery } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type MemoryLimiterProps = {
  ParentMastery: Mastery;
  active: boolean;
};

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

export default function MemoryLimiter({
  ParentMastery,
  active,
}: MemoryLimiterProps) {
  const [potency, setPotency] = useState<PotencyType>("MINOR");

  if (!active) return null;

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "Res Check: +7",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "Res Check: +9",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "Res Check: +11",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-100">Memory Seal</h1>

      {/* Potency */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={potency}
          setSelectedPotency={setPotency}
        />
      </section>
    </div>
  );
}
