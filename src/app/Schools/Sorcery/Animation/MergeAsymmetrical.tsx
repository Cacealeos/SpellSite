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
  const [percentage, setPercentage] = useState<MergePercentage>(100);

  const mastery = ParentMastery.getType();

  const availablePercentages: MergePercentage[] =
    mastery === "NOVICE"
      ? [100]
      : mastery === "INTERMEDIATE"
        ? [100, 50]
        : [100, 50, 10];

  const effectivePercentage = availablePercentages.includes(percentage)
    ? percentage
    : availablePercentages[0];

  const cumulativeTTT = mergedTTT.reduce((total, value) => total + value, 0);

  const finalTTT = Math.trunc(cumulativeTTT * (effectivePercentage / 100));

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

      {/* Mastery Effect */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-sm font-medium text-gray-300">
          Mastery Effect
        </h2>

        <div className="flex gap-4">
          {availablePercentages.map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-300"
            >
              <input
                type="radio"
                name="merge-symmetrical-percentage"
                value={value}
                checked={effectivePercentage === value}
                onChange={() => setPercentage(value)}
                className="accent-gray-400"
              />
              {value}%
            </label>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-400">
          Final TTT:{" "}
          <span className="font-semibold text-gray-200">{finalTTT}</span>
        </p>
      </section>
    </div>
  );
}
