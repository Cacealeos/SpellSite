import { useEffect, useState } from "react";
import { BoltIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type UnleashPotentialProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

// ==================================================
// Mastery Multipliers
// ==================================================

const masteryMultipliers: Record<MasteryType, number> = {
  NOVICE: 1.75,
  INTERMEDIATE: 1.5,
  MASTERED: 1.25,
};

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": false,
  "Spell Reflex": false,
  "Double Cast": false,
  "Double Pulse": false,
  "Carry Spell": false,
  "Spell Shift": false,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": false,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": false,
  "Auto Cast": false,
  "Rivet Cast": false,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Component
// ==================================================

export default function UnleashPotential({
  ParentMastery,
  active,
  updateSpell,
}: UnleashPotentialProps) {
  // ==================================================
  // State
  // ==================================================

  const [base, setBase] = useState(0);

  // ==================================================
  // Mastery Calculations
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const multiplier = masteryMultipliers[mastery] ?? 0;

  // ==================================================
  // Cost Calculations
  // ==================================================

  const finalCost = base * multiplier;

  const additionalCost = finalCost - base;

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
    updateSpell("ttt", 0);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // Reset When Inactive
  // ==================================================

  useEffect(() => {
    if (!active) {
      setBase(0);
    }
  }, [active]);

  // ==================================================
  // Input Handler
  // ==================================================

  const handleBaseChange = (value: string) => {
    const parsed = Number(value);

    setBase(Number.isFinite(parsed) ? Math.max(0, Math.trunc(parsed)) : 0);
  };

  // ==================================================
  // Render
  // ==================================================

  if (!active) return null;

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <BoltIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Unleash Potential</h1>
      </div>

      {/* ================================================== */}
      {/* Spell Techniques Table */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* Spell Properties */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-3 text-lg font-semibold text-orange-400">
          Spell Properties
        </h3>

        <div className="space-y-3 text-gray-300">
          {/* Target */}

          <div className="flex justify-between gap-3">
            <span>Target</span>

            <span className="font-semibold text-cyan-400">Recipient Spell</span>
          </div>

          {/* Mastery */}

          <div className="flex justify-between gap-3">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          {/* Base Cost */}

          <div className="flex justify-between gap-3">
            <span>Recipient Spell Base Cost</span>

            <span className="font-semibold text-cyan-400">{base}</span>
          </div>

          {/* Multiplier */}

          <div className="flex justify-between gap-3">
            <span>Mastery Multiplier</span>

            <span className="font-semibold text-cyan-400">×{multiplier}</span>
          </div>

          {/* TTT */}

          <div className="flex justify-between gap-3">
            <span>TTT</span>

            <span className="font-semibold text-cyan-400">0</span>
          </div>

          {/* Final Cost */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Recipient Spell Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Recipient Spell Configuration
        </h3>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <label
            htmlFor="unleash-potential-base-cost"
            className="mb-2 block font-semibold text-gray-200"
          >
            Base Spell Cost
          </label>

          <p className="mb-4 text-sm text-gray-400">
            Enter the base Manna cost of the recipient spell.
          </p>

          <input
            id="unleash-potential-base-cost"
            type="number"
            min={0}
            step={1}
            value={base}
            onChange={(e) => handleBaseChange(e.target.value)}
            className="w-32 rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-center text-lg text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* Mastery Penalty */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Mastery Penalty
        </h3>

        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-gray-300">
            Unleash Potential increases the recipient spell&apos;s base cost
            according to the caster&apos;s Mastery.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                ["NOVICE", 1.75],
                ["INTERMEDIATE", 1.5],
                ["MASTERED", 1.25],
              ] as const
            ).map(([level, value]) => (
              <div
                key={level}
                className={`rounded-lg border p-4 text-center ${
                  mastery === level
                    ? "border-cyan-500 bg-cyan-950/30"
                    : "border-gray-700 bg-gray-900"
                }`}
              >
                <p className="mb-2 text-xs font-semibold text-gray-400">
                  {level}
                </p>

                <p
                  className={`text-xl font-bold ${
                    mastery === level ? "text-cyan-400" : "text-gray-300"
                  }`}
                >
                  ×{value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Cost Breakdown */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Cost Breakdown
        </h3>

        <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          {/* Base Cost */}

          <div className="flex justify-between gap-3 text-gray-300">
            <span>Base Spell Cost</span>

            <span className="font-semibold text-cyan-400">{base}</span>
          </div>

          {/* Multiplier */}

          <div className="flex justify-between gap-3 text-gray-300">
            <span>Mastery Multiplier</span>

            <span className="font-semibold text-cyan-400">×{multiplier}</span>
          </div>

          {/* Additional Cost */}

          <div className="flex justify-between gap-3 text-gray-300">
            <span>Additional Cost</span>

            <span className="font-semibold text-cyan-400">
              +{additionalCost}
            </span>
          </div>

          {/* Final Cost */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3 text-gray-300">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>

          {/* Formula */}

          <p className="border-t border-gray-700 pt-3 text-center text-xs text-gray-400">
            {base} × {multiplier} = {finalCost}
          </p>
        </div>
      </div>

      {/* ================================================== */}
      {/* Data Flags */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Data Flags
        </h3>

        <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
          <div className="flex justify-between gap-3">
            <span>Effect Target</span>

            <span className="font-semibold text-cyan-400">RECIPIENT SPELL</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>TTT</span>

            <span className="font-semibold text-cyan-400">0</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Spell Description */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Description
        </h3>

        <div className="space-y-3 text-sm leading-relaxed text-gray-300">
          <p>Unleash Potential modifies the Manna cost of a recipient spell.</p>

          <p>
            The recipient spell&apos;s base cost is multiplied by a value
            determined by the caster&apos;s Mastery.
          </p>

          <p>
            Novice casters use a ×1.75 multiplier, Intermediate casters use
            ×1.5, and Mastered casters use ×1.25.
          </p>
        </div>
      </div>
    </>
  );
}
