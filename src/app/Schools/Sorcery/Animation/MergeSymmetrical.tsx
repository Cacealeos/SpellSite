import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import DynamicValueEntries from "@/app/SpellCreation/DynamicValueEntry";

type MergeSymmetricalProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type MergePercentage = 100 | 50 | 10;

export default function MergeSymmetrical({
  ParentMastery,
  active,
  updateSpell,
}: MergeSymmetricalProps) {
  const [mergedTTT, setMergedTTT] = useState<number[]>([]);

  const mastery = ParentMastery.getType();

  const percentage: MergePercentage =
    mastery === "NOVICE" ? 100 : mastery === "INTERMEDIATE" ? 50 : 10;

  const cumulativeTTT = mergedTTT.reduce((total, value) => total + value, 0);

  const finalTTT = Math.trunc(cumulativeTTT * (percentage / 100));

  useEffect(() => {
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalTTT, updateSpell]);

  if (!active) return null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-gray-200">
          Merge Symmetrical
        </h1>
      </div>

      {/* Merged Spells */}
      <DynamicValueEntries
        title="Spell"
        values={mergedTTT}
        setValues={setMergedTTT}
      />

      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <p className="text-sm text-gray-400">
          Mastery Effect:{" "}
          <span className="font-medium text-gray-200">{percentage}%</span>
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Final TTT:{" "}
          <span className="font-semibold text-gray-200">{finalTTT}</span>
        </p>
      </section>
    </div>
  );
}
