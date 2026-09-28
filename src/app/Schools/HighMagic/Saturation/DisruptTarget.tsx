import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Static Data
// ==================================================

const masteryData = {
  NOVICE: {
    rate: 6,
    max: 50,
  },
  INTERMEDIATE: {
    rate: 4,
    max: 100,
  },
  MASTERED: {
    rate: 2,
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

const aoeOptions = [
  {
    value: "SMALL" as const,
    label: "Small AOE",
    description: "Cost ×1",
    multiplier: 1,
  },
  {
    value: "MODERATE" as const,
    label: "Moderate AOE",
    description: "Cost ×3",
    multiplier: 3,
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

  const [disruption, setDisruption] = useState(0);

  const [selectedAOE, setSelectedAOE] = useState<"SMALL" | "MODERATE">("SMALL");
  const [spellCharge, setSpellCharge] = useState(false);

  // ==================================================
  // Derived Values
  // ==================================================
  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const rate = masteryData[mastery].rate;

  const maxDisruption = masteryData[mastery].max;

  const aoeMultiplier =
    aoeOptions.find((option) => option.value === selectedAOE)?.multiplier ?? 1;

  const cost = Math.round(disruption * rate * aoeMultiplier);

  const spellChargeDamage = Math.floor(disruption * 0.2);

  // ==================================================
  // Spell Updates
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      <SpellTechniquesTable techniques={Techniques} />
      {/*  Calibration */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Disruption Calibration
        </h3>

        <label className="mb-2 block text-sm text-gray-300">
          Desired Disruption
        </label>

        <input
          type="number"
          min={0}
          max={maxDisruption}
          value={disruption}
          onChange={(e) =>
            setDisruption(
              Math.min(maxDisruption, Math.max(0, Number(e.target.value) || 0)),
            )
          }
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-center text-lg text-cyan-400 focus:border-orange-500 focus:outline-none"
        />

        <p className="mt-4 text-center text-sm text-gray-400">
          Maximum Disruption
        </p>

        <p className="text-center text-xl font-semibold text-cyan-400">
          {maxDisruption}
        </p>
      </div>

      {/* Statistics */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-orange-400">
            Disruption Statistics
          </h3>

          <button
            type="button"
            onClick={() => setSpellCharge((prev) => !prev)}
            className={`
      rounded-lg border px-3 py-1.5 text-sm font-semibold
      transition-all
      ${
        spellCharge
          ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
          : "border-gray-700 bg-gray-900 text-gray-300 hover:border-cyan-400 hover:text-cyan-300"
      }
    `}
          >
            Spell Charge
          </button>
        </div>
        <div className="mt-2 h-px bg-gray-700" />

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Damage Type</span>
            <span className="font-semibold text-cyan-400">Kinetic</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Range</span>
            <span className="font-semibold text-cyan-400">Cloud</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Current Disruption</span>

            <span className="font-semibold text-cyan-400">
              {disruption}

              {spellCharge && (
                <span className="ml-2 text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">
                  (+{spellChargeDamage})
                </span>
              )}
            </span>
          </div>
          {spellCharge && (
            <p className="mt-4 text-center text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
              Spell Charge: +20% Damage per charge • Maximum +100% Damage
            </p>
          )}

          <div className="flex justify-between">
            <span className="text-gray-300">Cost</span>
            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>
        </div>
      </div>

      {/* Range */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Area of Effect
        </h3>

        <div className="space-y-3">
          {aoeOptions.map((option) => (
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
                name="aoe"
                checked={selectedAOE === option.value}
                onChange={() => setSelectedAOE(option.value)}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
