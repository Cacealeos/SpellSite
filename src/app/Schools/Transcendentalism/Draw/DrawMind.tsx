import { useEffect, useMemo, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type Potency = "MINOR" | "MAJOR" | "EXTREME";
type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type DrawMindProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

// Lookups defined outside the component to avoid recreating them on every render
const COST_MAP: Record<MasteryType, Record<Potency, number>> = {
  NOVICE: { MINOR: 60, MAJOR: 120, EXTREME: 180 },
  INTERMEDIATE: { MINOR: 40, MAJOR: 100, EXTREME: 160 },
  MASTERED: { MINOR: 20, MAJOR: 80, EXTREME: 140 },
};

const POTENCY_OPTIONS: Array<{
  value: Potency;
  label: string;
  description: string;
}> = [
  { value: "MINOR", label: "Minor", description: "60 / 40 / 20 Manna" },
  { value: "MAJOR", label: "Major", description: "120 / 100 / 80 Manna" },
  { value: "EXTREME", label: "Extreme", description: "180 / 160 / 140 Manna" },
];

export const DrawMind = ({
  ParentMastery,
  active,
  updateSpell,
}: DrawMindProps) => {
  const [potency, setPotency] = useState<Potency>("MINOR");

  // Calculate cost declaratively using object lookup and memoization
  const cost = useMemo(() => {
    const masteryType = ParentMastery.getType() as MasteryType;
    return COST_MAP[masteryType]?.[potency] ?? 0;
  }, [ParentMastery, potency]);

  // Synchronize state changes with parent callback
  useEffect(() => {
    if (!active) {
      setPotency("MINOR");
      updateSpell("cost", 0 as Spell["cost"]);
      return;
    }

    updateSpell("cost", cost as Spell["cost"]);
  }, [active, cost, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* Spell Title */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Draw Mind</h1>
      </div>

      {/* Potency */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <PotencySelector
          options={POTENCY_OPTIONS}
          selectedPotency={potency}
          setSelectedPotency={setPotency}
        />

        <div className="mt-4 rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">
            Spell-craft Lore Threshold
          </p>

          <div className="mt-2 space-y-1 text-sm text-gray-400">
            <p>Minor — Lore 1</p>
            <p>Major — Lore 2</p>
            <p>Extreme — Lore 3</p>
          </div>
        </div>
      </div>

      {/* Spell Statistics */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 text-xl font-bold text-orange-400">
          Spell Statistics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Cost</p>
            <p className="text-xl font-bold text-white">{cost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Potency</p>
            <p className="text-xl font-bold text-white">{potency}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawMind;
