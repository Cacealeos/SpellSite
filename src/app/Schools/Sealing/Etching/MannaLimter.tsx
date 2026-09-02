import { useState } from "react";

import { Mastery } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type MannaLimiterProps = {
  ParentMastery: Mastery;
  active: boolean;
};

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

export default function MannaLimiter({
  ParentMastery,
  active,
}: MannaLimiterProps) {
  const [potency, setPotency] = useState<PotencyType>("MINOR");
  const [currentIncrement, setCurrentIncrement] = useState(0);
  const [strength, setStrength] = useState(0);

  if (!active) return null;

  const potencyData = {
    MINOR: {
      maxIncrement: 15,
      maxStrength: 90,
    },
    MAJOR: {
      maxIncrement: 30,
      maxStrength: 180,
    },
    EXTREME: {
      maxIncrement: 45,
      maxStrength: 270,
    },
  };

  const { maxIncrement, maxStrength } = potencyData[potency];

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "Maximum increment: 15 • Maximum strength: 90",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "Maximum increment: 30 • Maximum strength: 180",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "Maximum increment: 45 • Maximum strength: 270",
    },
  ];

  const handlePotencyChange = (value: PotencyType) => {
    setPotency(value);

    const newMaxIncrement = potencyData[value].maxIncrement;
    const newMaxStrength = potencyData[value].maxStrength;

    setCurrentIncrement((current) => Math.min(current, newMaxIncrement));

    setStrength((current) => Math.min(current, newMaxStrength));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-100">Manna Limiter</h1>

      <p className="text-sm font-medium uppercase tracking-wide text-gray-400">
        Direct Damage
      </p>

      {/* Potency */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={potency}
          setSelectedPotency={handlePotencyChange}
        />
      </section>

      {/* Seal Values */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Set Seal Values
        </h2>

        <div className="space-y-5">
          {/* Seal Strength */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Seal Strength
            </label>

            <input
              type="number"
              min={0}
              max={maxStrength}
              step={1}
              value={strength}
              onChange={(e) =>
                setStrength(Math.min(Number(e.target.value), maxStrength))
              }
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-blue-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              Maximum strength: {maxStrength}
            </p>
          </div>

          {/* Manna Drain Increment */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Manna Drain Increment
            </label>

            <input
              type="number"
              min={0}
              max={maxIncrement}
              step={1}
              value={currentIncrement}
              onChange={(e) =>
                setCurrentIncrement(
                  Math.min(Number(e.target.value), maxIncrement),
                )
              }
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-blue-500"
            />

            <p className="mt-2 text-sm text-gray-400">
              Manna will drain until a maximum of{" "}
              <span className="font-medium text-gray-200">{strength}</span> is
              depleted.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
