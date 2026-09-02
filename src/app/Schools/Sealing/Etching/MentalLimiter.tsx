import { useState } from "react";

import { Mastery } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type MentalLimiterProps = {
  ParentMastery: Mastery;
  active: boolean;
};

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

export default function MentalLimiter({
  ParentMastery,
  active,
}: MentalLimiterProps) {
  const [potency, setPotency] = useState<PotencyType>("MINOR");

  if (!active) return null;

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "Res Check: +8",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "Res Check: +10",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "Res Check: +12",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-100">Mental Seal</h1>

      {/* Potency */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={potency}
          setSelectedPotency={setPotency}
        />

        <div className="mt-4 rounded-md border border-gray-700 bg-gray-900/60 px-3 py-2">
          <p className="text-sm text-gray-400">
            <span className="font-medium text-gray-300">
              Training Required:
            </span>{" "}
            Sorcery
          </p>
        </div>
      </section>
    </div>
  );
}
