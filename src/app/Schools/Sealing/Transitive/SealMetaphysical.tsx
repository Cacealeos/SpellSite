import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type SealMetaphysicalProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

export default function SealMetaphysical({
  ParentMastery,
  active,
  updateSpell,
}: SealMetaphysicalProps) {
  const [potency, setPotency] = useState<PotencyType>("MINOR");
  const [power, setPower] = useState(0);

  const mastery = ParentMastery.getType();

  const tttRate = mastery === "NOVICE" ? 6 : mastery === "INTERMEDIATE" ? 4 : 2;

  const potencyCosts = {
    MINOR: {
      NOVICE: 40,
      INTERMEDIATE: 30,
      MASTERED: 20,
    },
    MAJOR: {
      NOVICE: 70,
      INTERMEDIATE: 60,
      MASTERED: 50,
    },
    EXTREME: {
      NOVICE: 100,
      INTERMEDIATE: 90,
      MASTERED: 80,
    },
  };

  const cost = potencyCosts[potency][mastery];

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "40 / 30 / 20 • Generates 1 PPP",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "70 / 60 / 50 • Generates 1 PPP",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "100 / 90 / 80 • Generates 1 PPP",
    },
  ];

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("cost", cost);
    updateSpell("ttt", power * tttRate);
  }, [active, cost, power, tttRate, updateSpell]);

  const handlePotencyChange = (value: PotencyType) => {
    setPotency(value);
  };

  if (!active) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-100">
          Seal Metaphysical
        </h1>

        <div className="mt-3 rounded-md border border-gray-700 bg-gray-900/60 px-3 py-2">
          <p className="text-sm text-gray-400">
            <span className="font-medium text-gray-300">
              Training Required:
            </span>{" "}
            Sorcery
          </p>
        </div>
      </div>

      {/* PPP Generation */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Generate PPP
        </h2>

        <label className="mb-2 block text-sm font-medium text-gray-300">
          PPP Generated
        </label>

        <input
          type="number"
          min={0}
          max={13}
          step={1}
          value={power}
          onChange={(e) => setPower(Number(e.target.value))}
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-blue-500"
        />

        <p className="mt-2 text-sm text-gray-400">
          TTT cost: <span className="font-medium text-gray-200">{tttRate}</span>{" "}
          per PPP
        </p>

        <p className="mt-1 text-xs text-gray-500">Maximum PPP: 13</p>
      </section>

      {/* Potency */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={potency}
          setSelectedPotency={handlePotencyChange}
        />
      </section>
    </div>
  );
}
