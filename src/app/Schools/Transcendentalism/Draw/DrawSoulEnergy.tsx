import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type DrawSoulProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

// ==================================================
// Potency Options
// ==================================================

const potencyOptions = [
  {
    value: "MINOR",
    label: "Minor",
    description: "100",
  },
  {
    value: "MAJOR",
    label: "Major",
    description: "200",
  },
  {
    value: "EXTREME",
    label: "Extreme",
    description: "300",
  },
];

// ==================================================
// Potency Costs
// ==================================================

const potencyCosts: Record<string, number> = {
  MINOR: 100,
  MAJOR: 200,
  EXTREME: 300,
  CATACLYSMIC: 0,
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
// Constants
// ==================================================

const BASE_TTT = 35;

// ==================================================
// Component
// ==================================================

export default function DrawSoul({ active, updateSpell }: DrawSoulProps) {
  // ==================================================
  // State
  // ==================================================

  const [potency, setPotency] = useState<string>("MINOR");

  const [hyperSpell, setHyperSpell] = useState(false);

  const [counterSpell, setCounterSpell] = useState(false);

  // ==================================================
  // Cost Calculations
  // ==================================================

  const finalCost = potencyCosts[potency] ?? 0;

  const finalTTT = BASE_TTT;

  // ==================================================
  // Spell Effects
  // ==================================================

  const affectedStats = hyperSpell ? 2 : 1;

  const castingAction = counterSpell ? "Defensive Measure" : "Normal Casting";

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalCost, finalTTT, updateSpell]);

  // ==================================================
  // Reset When Inactive
  // ==================================================

  useEffect(() => {
    if (!active) {
      setPotency("MINOR");
      setHyperSpell(false);
      setCounterSpell(false);
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

        <h1 className="text-2xl font-bold text-cyan-400">Draw Soul</h1>
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
              aria-pressed={hyperSpell}
              onClick={() => setHyperSpell((prev) => !prev)}
              className={techniqueButtonClass(hyperSpell)}
            >
              Hyper Spell
            </button>

            <button
              type="button"
              aria-pressed={counterSpell}
              onClick={() => setCounterSpell((prev) => !prev)}
              className={techniqueButtonClass(counterSpell)}
            >
              Counter Spell
            </button>
          </div>
        </div>

        {/* Technique Descriptions */}

        {hyperSpell && (
          <div className="mb-4 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <span className="font-semibold">Hyper Spell:</span> Draw Soul can
            affect two stats at the same time.
          </div>
        )}

        {counterSpell && (
          <div className="mb-4 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <span className="font-semibold">Counter Spell:</span> Draw Soul can
            be used as a Defensive Measure.
          </div>
        )}

        {/* Properties */}

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between gap-3">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">{potency}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Affected Stats</span>

            <span className="font-semibold text-cyan-400">{affectedStats}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Casting Action</span>

            <span className="font-semibold text-cyan-400">{castingAction}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>TTT</span>

            <span className="font-semibold text-cyan-400">{finalTTT}</span>
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
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">{potency}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Base TTT</span>

            <span className="font-semibold text-cyan-400">{BASE_TTT}</span>
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
      {/* Data Flags */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Data Flags
        </h3>

        <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
          <div className="flex justify-between gap-3">
            <span>Effect Type</span>

            <span className="font-semibold text-cyan-400">SOUL</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>TTT</span>

            <span className="font-semibold text-cyan-400">{finalTTT}</span>
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
            Draw Soul is configured using the selected Potency, with a fixed TTT
            of 35.
          </p>

          <p>
            Hyper Spell allows Draw Soul to affect two stats simultaneously.
          </p>

          <p>
            Counter Spell allows Draw Soul to be used as a Defensive Measure.
          </p>
        </div>
      </div>
    </>
  );
}
