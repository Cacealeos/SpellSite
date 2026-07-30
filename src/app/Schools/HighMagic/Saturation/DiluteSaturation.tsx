import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";

// ==================================================
// Static Data
// ==================================================

const masteryData = {
  NOVICE: {
    rate: 3,
    max: 50,
  },
  INTERMEDIATE: {
    rate: 2,
    max: 100,
  },
  MASTERED: {
    rate: 1,
    max: 150,
  },
};

const rangeOptions = [
  {
    value: "ENCLOSED" as const,
    label: "Enclosed Area",
    description: "TTT ×0.5",
    multiplier: 0.5,
  },
  {
    value: "OPEN" as const,
    label: "Open Area",
    description: "TTT ×1",
    multiplier: 1,
  },
  {
    value: "LARGE" as const,
    label: "Large Area",
    description: "TTT ×3",
    multiplier: 3,
  },
  {
    value: "MASSIVE" as const,
    label: "Massive Area",
    description: "TTT ×9",
    multiplier: 9,
  },
];

export default function DiluteSaturation({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) {
  // ==================================================
  // State
  // ==================================================

  const [saturation, setSaturation] = useState(0);

  const [range, setRange] = useState<"ENCLOSED" | "OPEN" | "LARGE" | "MASSIVE">(
    "OPEN",
  );

  // ==================================================
  // Derived Values
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const rate = masteryData[mastery].rate;

  const maxDilution = masteryData[mastery].max;

  const selectedRange = rangeOptions.find((option) => option.value === range);

  const rangeMultiplier = selectedRange?.multiplier ?? 1;

  const ttt = Math.round(saturation * rate * rangeMultiplier);

  // ==================================================
  // Spell Updates
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("ttt", ttt);
  }, [active, ttt, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* Saturation Calibration */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Saturation Calibration
        </h3>

        <label className="mb-2 block text-sm text-gray-300">
          Desired Saturation
        </label>

        <input
          type="number"
          min={0}
          max={maxDilution}
          value={saturation}
          onChange={(e) =>
            setSaturation(
              Math.min(maxDilution, Math.max(0, Number(e.target.value) || 0)),
            )
          }
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-center text-lg text-cyan-400 focus:border-orange-500 focus:outline-none"
        />

        <p className="mt-4 text-center text-sm text-gray-400">
          Maximum Saturation
        </p>

        <p className="text-center text-xl font-semibold text-cyan-400">
          {maxDilution}
        </p>
      </div>

      {/* Statistics */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Dilution Statistics
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Damage Type</span>
            <span className="font-semibold text-cyan-400">KINETIC</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Range</span>
            <span className="font-semibold text-cyan-400">RADIAL</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">TTT Cost</span>
            <span className="font-semibold text-cyan-400">{ttt}</span>
          </div>
        </div>
      </div>
      {/* Range */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Range
        </h3>

        <div className="space-y-3">
          {rangeOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-4 py-3 hover:border-orange-500"
            >
              <div>
                <p className="font-medium text-gray-100">{option.label}</p>

                <p className="text-sm text-gray-400">{option.description}</p>
              </div>

              <input
                type="radio"
                name="range"
                checked={range === option.value}
                onChange={() => setRange(option.value)}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
