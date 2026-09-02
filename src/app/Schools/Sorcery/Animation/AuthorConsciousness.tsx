import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";

type AuthorConsciousnessProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

export default function AuthorConsciousness({
  ParentMastery,
  active,
  updateSpell,
}: AuthorConsciousnessProps) {
  const [longevity, setLongevity] = useState(0);

  const mastery = ParentMastery.getType();

  const costPerTurn =
    mastery === "NOVICE" ? 32 : mastery === "INTERMEDIATE" ? 28 : 24;

  const totalCost = costPerTurn * longevity;

  useEffect(() => {
    updateSpell("cost", active ? totalCost : 0);
  }, [active, totalCost, updateSpell]);

  if (!active) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-200">
        Author Consciousness
      </h1>

      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-sm font-medium text-gray-300">
          Longevity | TURNS |
        </h2>

        <input
          type="number"
          min={0}
          step={1}
          value={longevity}
          onChange={(e) => setLongevity(Number(e.target.value))}
          className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 outline-none focus:border-gray-400"
        />

        <div className="mt-3 space-y-1 text-sm text-gray-400">
          <p>Brief: ~3 Turns</p>
          <p>Lengthy: ~6 Turns</p>
          <p>Prolonged: ~12 Turns</p>
          <p>Extended: ~24+ Turns</p>
        </div>

        <p className="mt-4 text-sm text-gray-400">
          Cost per Turn:{" "}
          <span className="font-medium text-gray-200">{costPerTurn}</span>
        </p>

        <p className="mt-1 text-sm text-gray-400">
          Total Cost:{" "}
          <span className="font-semibold text-gray-200">{totalCost}</span>
        </p>
      </section>
    </div>
  );
}
