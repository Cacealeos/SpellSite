"use client";

import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// TYPES
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type RangeType = "ENCLOSED" | "OPEN" | "LARGE" | "MASSIVE";

type AuraEnergy = "BODY" | "SPIRITUAL" | "MEMORY";

// ==================================================
// SPELL TECHNIQUES
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": false,
  "Soul Cast": false,
  "Full Cast": false,
  "Counter Spell": true,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": false,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": true,
  "Aura Surge": true,
};

// ==================================================
// MASTERY DATA
// ==================================================

const masteryData: Record<MasteryType, { rate: number; max: number }> = {
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

// ==================================================
// RANGE OPTIONS
// ==================================================

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

// ==================================================
// AURA SURGE OPTIONS
// ==================================================

const auraOptions: {
  value: AuraEnergy;
  label: string;
  description: string;
}[] = [
  {
    value: "BODY",
    label: "Body Energy",
    description: "Damage increased by 20% when cast.",
  },
  {
    value: "SPIRITUAL",
    label: "Spiritual Energy",
    description: "Construct is highly resistant to disruption.",
  },
  {
    value: "MEMORY",
    label: "Memory Energy",
    description: "Construct Vitality increased by 30%.",
  },
];

// ==================================================
// COMPONENT
// ==================================================

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
  // STATE
  // ==================================================

  const [saturation, setSaturation] = useState(0);

  const [range, setRange] = useState<RangeType>("OPEN");

  // ==================================================
  // TECHNIQUE STATE
  // ==================================================

  const [hyperSpell, setHyperSpell] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);

  const [auraEnergy, setAuraEnergy] = useState<AuraEnergy>("BODY");

  // ==================================================
  // DERIVED VALUES
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const rate = masteryData[mastery].rate;

  const maxDilution = masteryData[mastery].max;

  const selectedRange = rangeOptions.find((option) => option.value === range);

  const rangeMultiplier = selectedRange?.multiplier ?? 1;

  const effectiveSaturation = Math.min(saturation, maxDilution);

  const ttt = Math.round(effectiveSaturation * rate * rangeMultiplier);

  const selectedAuraOption = auraOptions.find(
    (option) => option.value === auraEnergy,
  );

  // ==================================================
  // SPELL UPDATES
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("ttt", ttt);
  }, [active, ttt, updateSpell]);

  // ==================================================
  // RESET TECHNIQUES
  // ==================================================

  useEffect(() => {
    if (!active) {
      setHyperSpell(false);
      setAuraSurge(false);
      setAuraEnergy("BODY");
    }
  }, [active]);

  // ==================================================
  // TECHNIQUE BUTTON STYLES
  // ==================================================

  const techniqueButtonClass = (enabled: boolean) =>
    `rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
      enabled
        ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
        : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-400 hover:text-purple-300"
    }`;

  // ==================================================
  // RENDER
  // ==================================================

  if (!active) return null;

  return (
    <>
      {/* ================================================== */}
      {/* SPELL TECHNIQUES */}
      {/* ================================================== */}

      <SpellTechniquesTable techniques={Techniques} />

      {/* ================================================== */}
      {/* TECHNIQUE BUTTONS */}
      {/* ================================================== */}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setHyperSpell((prev) => !prev)}
          aria-pressed={hyperSpell}
          className={techniqueButtonClass(hyperSpell)}
        >
          Hyper Spell
        </button>

        <button
          type="button"
          onClick={() => setAuraSurge((prev) => !prev)}
          aria-pressed={auraSurge}
          className={techniqueButtonClass(auraSurge)}
        >
          Aura Surge
        </button>
      </div>

      {/* ================================================== */}
      {/* TECHNIQUE EFFECTS */}
      {/* ================================================== */}

      {hyperSpell && (
        <div className="mt-3 rounded-lg border border-purple-800 bg-purple-950/30 p-3">
          <p className="text-sm text-gray-300">
            <strong className="text-purple-300">Hyper Spell:</strong> Enabled.
            No numerical modifier has been defined for this spell.
          </p>
        </div>
      )}

      {/* ================================================== */}
      {/* AURA SURGE CONFIGURATION */}
      {/* ================================================== */}

      {auraSurge && (
        <div className="mt-3 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Aura Surge Configuration
          </h3>

          <p className="mb-4 text-sm text-gray-400">
            Select the energy being channeled.
          </p>

          <div className="space-y-3">
            {auraOptions.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-md border px-4 py-3 transition ${
                  auraEnergy === option.value
                    ? "border-purple-500 bg-purple-950/20"
                    : "border-gray-700 bg-gray-900 hover:border-purple-500"
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-100">{option.label}</p>

                  <p className="mt-1 text-sm text-gray-400">
                    {option.description}
                  </p>
                </div>

                <input
                  type="radio"
                  name="dilute-aura-energy"
                  value={option.value}
                  checked={auraEnergy === option.value}
                  onChange={() => setAuraEnergy(option.value)}
                  className="h-5 w-5 accent-purple-500"
                />
              </label>
            ))}
          </div>

          {/* ACTIVE AURA EFFECT */}

          <div className="mt-4 rounded-lg border border-purple-800 bg-purple-950/30 p-4">
            <p className="mb-2 text-sm font-semibold text-purple-300">
              Active Aura Surge Effect
            </p>

            <p className="text-sm text-gray-300">
              <span className="font-semibold text-purple-300">
                {selectedAuraOption?.label}:
              </span>{" "}
              {selectedAuraOption?.description}
            </p>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* SATURATION CALIBRATION */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Saturation Calibration
        </h3>

        <label
          htmlFor="dilute-saturation"
          className="mb-2 block text-sm text-gray-300"
        >
          Desired Saturation
        </label>

        <input
          id="dilute-saturation"
          type="number"
          min={0}
          max={maxDilution}
          value={effectiveSaturation}
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

      {/* ================================================== */}
      {/* DILUTION STATISTICS */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Dilution Statistics
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Damage Type</span>

            <span className="font-semibold text-cyan-400">KINETIC</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Range</span>

            <span className="font-semibold text-cyan-400">RADIAL</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Saturation</span>

            <span className="font-semibold text-cyan-400">
              {effectiveSaturation}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Mastery Rate</span>

            <span className="font-semibold text-cyan-400">{rate}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Range Multiplier</span>

            <span className="font-semibold text-cyan-400">
              ×{rangeMultiplier}
            </span>
          </div>

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-200">TTT Cost</span>

            <span className="font-semibold text-cyan-400">{ttt} TTT</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* RANGE */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Range
        </h3>

        <div className="space-y-3">
          {rangeOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-gray-700 bg-gray-900 px-4 py-3 transition hover:border-orange-500"
            >
              <div>
                <p className="font-medium text-gray-100">{option.label}</p>

                <p className="text-sm text-gray-400">{option.description}</p>
              </div>

              <input
                type="radio"
                name="dilute-range"
                value={option.value}
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
