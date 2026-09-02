import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type AnimateEphemeralProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

export default function AnimateEphemeral({
  ParentMastery,
  active,
  updateSpell,
}: AnimateEphemeralProps) {
  const [potency, setPotency] = useState<PotencyType>("MINOR");
  const [increment, setIncrement] = useState(0);

  const mastery = ParentMastery.getType();

  const tttRates = {
    MINOR: {
      NOVICE: 12,
      INTERMEDIATE: 8,
      MASTERED: 4,
    },
    MAJOR: {
      NOVICE: 18,
      INTERMEDIATE: 12,
      MASTERED: 6,
    },
    EXTREME: {
      NOVICE: 24,
      INTERMEDIATE: 16,
      MASTERED: 8,
    },
  };

  const tttRate = tttRates[potency][mastery];

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "12 / 8 / 4 TTT per increment",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "18 / 12 / 6 TTT per increment",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "24 / 16 / 8 TTT per increment",
    },
  ];

  useEffect(() => {
    if (!active) {
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("ttt", tttRate * increment);
  }, [active, increment, tttRate, updateSpell]);

  if (!active) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-100">Animate Ephemeral</h1>

      {/* Potency */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={potency}
          setSelectedPotency={setPotency}
        />
      </section>

      {/* Increment */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Cost
        </h2>

        <label className="mb-2 block text-sm font-medium text-gray-300">
          Increment
        </label>

        <input
          type="number"
          min={0}
          step={1}
          value={increment}
          onChange={(e) => setIncrement(Number(e.target.value))}
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-blue-500"
        />

        <p className="mt-3 text-sm text-gray-400">
          TTT:{" "}
          <span className="font-medium text-gray-200">
            {tttRate * increment}
          </span>
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {tttRate} TTT per increment
        </p>
      </section>
    </div>
  );
}
