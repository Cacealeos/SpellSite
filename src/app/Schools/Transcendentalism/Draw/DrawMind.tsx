import { useEffect, useState } from "react";
import { CpuChipIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type DrawMindProps = {
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
    description: "60 / 40 / 20",
  },
  {
    value: "MAJOR",
    label: "Major",
    description: "120 / 100 / 80",
  },
  {
    value: "EXTREME",
    label: "Extreme",
    description: "180 / 160 / 140",
  },
];

// ==================================================
// Potency Costs
// ==================================================

const potencyCosts: Record<string, Record<MasteryType, number>> = {
  MINOR: {
    NOVICE: 60,
    INTERMEDIATE: 40,
    MASTERED: 20,
  },
  MAJOR: {
    NOVICE: 120,
    INTERMEDIATE: 100,
    MASTERED: 80,
  },
  EXTREME: {
    NOVICE: 180,
    INTERMEDIATE: 160,
    MASTERED: 140,
  },
  CATACLYSMIC: {
    NOVICE: 0,
    INTERMEDIATE: 0,
    MASTERED: 0,
  },
};

// ==================================================
// Spell-craft Lore Thresholds
// ==================================================

const loreThresholds: Record<string, number> = {
  MINOR: 1,
  MAJOR: 2,
  EXTREME: 3,
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

export default function DrawMind({
  ParentMastery,
  active,
  updateSpell,
}: DrawMindProps) {
  // ==================================================
  // State
  // ==================================================

  const [potency, setPotency] = useState<string>("MINOR");

  // ==================================================
  // Mastery Calculations
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  // ==================================================
  // Cost Calculations
  // ==================================================

  const finalCost = potencyCosts[potency]?.[mastery] ?? 0;

  // ==================================================
  // Lore Calculations
  // ==================================================

  const requiredLore = loreThresholds[potency] ?? 0;

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
    }
  }, [active]);

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
        <CpuChipIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Draw Mind</h1>
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
          {/* Potency */}

          <div className="flex justify-between gap-3">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">{potency}</span>
          </div>

          {/* Lore Requirement */}

          <div className="flex justify-between gap-3">
            <span>Required Spell-craft Lore</span>

            <span className="font-semibold text-cyan-400">{requiredLore}</span>
          </div>

          {/* Mastery */}

          <div className="flex justify-between gap-3">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          {/* Total Cost */}

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

        {/* Lore Reference */}

        <div className="mt-5 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <h4 className="mb-3 font-semibold text-gray-200">
            Spell-craft Lore Threshold
          </h4>

          <div className="space-y-2 text-sm">
            {potencyOptions.map((option) => {
              const lore = loreThresholds[option.value];

              const selected = potency === option.value;

              return (
                <div
                  key={option.value}
                  className={`flex justify-between rounded-md px-3 py-2 ${
                    selected ? "bg-gray-800 text-cyan-400" : "text-gray-400"
                  }`}
                >
                  <span>{option.label}</span>

                  <span className="font-semibold">Lore {lore}</span>
                </div>
              );
            })}
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
            Draw Mind uses the caster&apos;s Mastery and selected Potency to
            determine its casting cost.
          </p>

          <p>The required Spell-craft Lore threshold increases with Potency.</p>

          <p>
            Minor requires Lore 1, Major requires Lore 2, and Extreme requires
            Lore 3.
          </p>
        </div>
      </div>
    </>
  );
}
