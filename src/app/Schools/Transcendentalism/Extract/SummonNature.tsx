import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type SummonNatureProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

// ==================================================
// Potency Options
// ==================================================

const potencyOptions = [
  {
    value: "MINOR",
    label: "Minor",
    description: "25 / 15 / 10",
  },
  {
    value: "MAJOR",
    label: "Major",
    description: "75 / 60 / 45",
  },
  {
    value: "EXTREME",
    label: "Extreme",
    description: "225 / 180 / 135",
  },
];

// ==================================================
// Potency Costs
// ==================================================

const potencyCosts: Record<string, Record<MasteryType, number>> = {
  MINOR: {
    NOVICE: 25,
    INTERMEDIATE: 15,
    MASTERED: 10,
  },
  MAJOR: {
    NOVICE: 75,
    INTERMEDIATE: 60,
    MASTERED: 45,
  },
  EXTREME: {
    NOVICE: 225,
    INTERMEDIATE: 180,
    MASTERED: 135,
  },
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
  "Counter Spell": true,
  "Spell Surge": false,
  "Junction Cast": false,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": false,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Component
// ==================================================

export default function SummonNature({
  ParentMastery,
  active,
  updateSpell,
}: SummonNatureProps) {
  // ==================================================
  // State
  // ==================================================

  const [potency, setPotency] = useState<string>("MINOR");

  const [counterSpell, setCounterSpell] = useState(false);

  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Mastery Calculations
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  // ==================================================
  // Cost Calculations
  // ==================================================

  const finalCost = potencyCosts[potency]?.[mastery] ?? 0;

  // ==================================================
  // Spell Effects
  // ==================================================

  const castingAction = counterSpell ? "Defensive Measure" : "Normal Casting";

  const influenceLevel = hyperSpell
    ? "Higher-Level Influence Unlocked"
    : "Standard Influence";

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
      setPotency("MINOR");
      setCounterSpell(false);
      setHyperSpell(false);
    }
  }, [active]);

  // ==================================================
  // Technique Button Styling
  // ==================================================

  const techniqueButtonClass = (enabled: boolean) =>
    `rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
      enabled
        ? "border-purple-400 bg-purple-700 text-white shadow-md shadow-purple-900/30"
        : "border-gray-600 bg-gray-900 text-gray-300 hover:border-purple-500 hover:text-purple-300"
    }`;

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
        <SparklesIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Summon Nature</h1>
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
        {/* Header and Technique Buttons */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-pressed={counterSpell}
              onClick={() => setCounterSpell((prev) => !prev)}
              className={techniqueButtonClass(counterSpell)}
            >
              Counter Spell
            </button>

            <button
              type="button"
              aria-pressed={hyperSpell}
              onClick={() => setHyperSpell((prev) => !prev)}
              className={techniqueButtonClass(hyperSpell)}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        {/* Technique Descriptions */}

        {counterSpell && (
          <div className="mb-4 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <span className="font-semibold">Counter Spell:</span> Summon Nature
            can be used as a Defensive Measure.
          </div>
        )}

        {hyperSpell && (
          <div className="mb-4 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <span className="font-semibold">Hyper Spell:</span> Unlocks
            higher-level influence.
          </div>
        )}

        {/* Properties */}

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between gap-3">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">{potency}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Casting Action</span>

            <span className="font-semibold text-cyan-400">{castingAction}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Influence</span>

            <span className="font-semibold text-cyan-400">
              {influenceLevel}
            </span>
          </div>

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Total Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Potency Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Potency Configuration
        </h3>

        <PotencySelector
          options={potencyOptions}
          selectedPotency={potency}
          setSelectedPotency={setPotency}
        />
      </div>

      {/* ================================================== */}
      {/* Cost Breakdown */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Cost Breakdown
        </h3>

        <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between text-gray-300">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">{potency}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3 text-gray-300">
            <span className="font-semibold text-gray-100">Total Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
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
          <p>
            Summon Nature uses the caster&apos;s Mastery and selected Potency to
            determine its casting cost.
          </p>

          <p>
            Counter Spell allows Summon Nature to be used as a Defensive
            Measure.
          </p>

          <p>Hyper Spell unlocks higher-level influence.</p>
        </div>
      </div>
    </>
  );
}
