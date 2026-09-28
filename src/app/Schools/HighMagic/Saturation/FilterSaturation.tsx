import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Static Data
// ==================================================

const masteryData = {
  NOVICE: {
    rate: 5,
    max: 50,
  },
  INTERMEDIATE: {
    rate: 4,
    max: 100,
  },
  MASTERED: {
    rate: 3,
    max: 150,
  },
};

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": false,
  "Carry Spell": true,
  "Spell Shift": false,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": false,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": true,
  "Father Spell": false,
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

export default function FilterSaturation({
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
  const [filtration, setFiltration] = useState(0);

  const [selectedRange, setSelectedRange] = useState<
    "ENCLOSED" | "OPEN" | "LARGE" | "MASSIVE"
  >("OPEN");
  const [spellCharge, setSpellCharge] = useState(false);

  // ==================================================
  // Derived Values
  // ==================================================
  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const rate = masteryData[mastery].rate;

  const maxFiltration = masteryData[mastery].max;

  const rangeMultiplier =
    rangeOptions.find((option) => option.value === selectedRange)?.multiplier ??
    1;

  const ttt = Math.round(filtration * rate * rangeMultiplier);
  const spellChargeFiltration = Math.floor(filtration * 0.2);
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
      <SpellTechniquesTable techniques={Techniques} />

      {/* Filtration Calibration */}
      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Filtration Calibration
        </h3>

        <label className="mb-2 block text-sm text-gray-300">
          Desired Saturation Filtered
        </label>

        <input
          type="number"
          min={0}
          max={maxFiltration}
          value={filtration}
          onChange={(e) =>
            setFiltration(
              Math.min(maxFiltration, Math.max(0, Number(e.target.value) || 0)),
            )
          }
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-center text-lg text-cyan-400 focus:border-orange-500 focus:outline-none"
        />

        <p className="mt-4 text-center text-sm text-gray-400">
          Maximum Filtration
        </p>

        <p className="text-center text-xl font-semibold text-cyan-400">
          {maxFiltration}
        </p>
      </div>
      {/* Statistics */}
      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <div className="mb-3 flex items-center justify-between border-b border-gray-700 pb-2">
          <h3 className="text-lg font-semibold text-orange-400">
            Filtration Statistics
          </h3>

          <button
            type="button"
            onClick={() => setSpellCharge((prev) => !prev)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
              spellCharge
                ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                : "border-gray-600 bg-gray-900 text-gray-400 hover:border-cyan-500 hover:text-cyan-300"
            }`}
          >
            Spell Charge
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Damage Type</span>
            <span className="font-semibold text-cyan-400">Kinetic</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Range</span>
            <span className="font-semibold text-cyan-400">Radial</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Current Filtration</span>

            <span className="font-semibold text-cyan-400">
              {filtration}

              {spellCharge && (
                <span className="ml-2 text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">
                  (+{spellChargeFiltration})
                </span>
              )}
            </span>
          </div>
          {spellCharge && (
            <p className="mt-4 text-center text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
              Spell Charge: +20% Filtration per charge • Maximum +100%
              Filtration
            </p>
          )}

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
                checked={selectedRange === option.value}
                onChange={() => setSelectedRange(option.value)}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
