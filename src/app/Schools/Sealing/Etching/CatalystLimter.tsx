import { useState } from "react";

import { Mastery } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type CatalystLimiterProps = {
  ParentMastery: Mastery;
  active: boolean;
};

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

export default function CatalystLimiter({
  ParentMastery,
  active,
}: CatalystLimiterProps) {
  const [potency, setPotency] = useState<PotencyType>("MINOR");
  const [sealStrength, setSealStrength] = useState(0);

  if (!active) return null;

  const penalty = {
    MINOR: 5,
    MAJOR: 10,
    EXTREME: 15,
  }[potency];

  const adjustedStrength = Math.max(
    sealStrength - (sealStrength * penalty) / 100,
    0,
  );

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "|-5%|",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "|-10%|",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "|-15%|",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-100">Catalyst Limiter</h1>

      {/* Potency */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={potency}
          setSelectedPotency={setPotency}
        />
      </section>

      {/* Seal Strength */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Seal Strength
        </h2>

        <input
          type="number"
          min={0}
          value={sealStrength}
          onChange={(e) => setSealStrength(Number(e.target.value))}
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-blue-500"
        />

        <p className="mt-2 text-sm text-gray-400">Penalty: -{penalty}%</p>

        <p className="mt-1 text-sm text-gray-300">
          Adjusted Seal Strength: {adjustedStrength}
        </p>
      </section>
    </div>
  );
}
