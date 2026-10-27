import { useEffect, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import { Potency } from "@/app/models/Potency";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type DrawLifeDeathProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type PotencyType = ReturnType<Potency["getType"]>;

// ==================================================
// Potency Options
// ==================================================

const potencyOptions = [
  {
    value: "MINOR",
    label: "Minor",
    description: "25 / 20 / 15",
  },
  {
    value: "MAJOR",
    label: "Major",
    description: "55 / 45 / 35",
  },
  {
    value: "EXTREME",
    label: "Extreme",
    description: "120 / 100 / 80",
  },
];

// ==================================================
// Potency Costs
// ==================================================

const potencyCosts: Record<PotencyType, Record<MasteryType, number>> = {
  MINOR: {
    NOVICE: 25,
    INTERMEDIATE: 20,
    MASTERED: 15,
  },
  MAJOR: {
    NOVICE: 55,
    INTERMEDIATE: 45,
    MASTERED: 35,
  },
  EXTREME: {
    NOVICE: 120,
    INTERMEDIATE: 100,
    MASTERED: 80,
  },
  CATACLYSMIC: {
    NOVICE: 0,
    INTERMEDIATE: 0,
    MASTERED: 0,
  },
};

// ==================================================
// Damage Ranges
// ==================================================

const damageRanges: Record<PotencyType, string> = {
  MINOR: "10 – 35",
  MAJOR: "40 – 90",
  EXTREME: "100 – 220",
  CATACLYSMIC: "—",
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
// Constants
// ==================================================

const NECRO_FORCE_MULTIPLIER = 2;

// ==================================================
// Component
// ==================================================

export default function DrawLifeDeath({
  ParentMastery,
  active,
  updateSpell,
}: DrawLifeDeathProps) {
  // ==================================================
  // State
  // ==================================================

  const [potency, setPotency] = useState<string>("MINOR");

  const [targetNecroForce, setTargetNecroForce] = useState(false);

  // ==================================================
  // Mastery Calculations
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  // ==================================================
  // Cost Calculations
  // ==================================================

  const baseCost = potencyCosts[potency]?.[mastery] ?? 0;

  const finalCost = targetNecroForce
    ? baseCost * NECRO_FORCE_MULTIPLIER
    : baseCost;

  const damageRange = damageRanges[potency] ?? "—";

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
      setTargetNecroForce(false);
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
        <HeartIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Draw Life Death</h1>
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

          {/* Damage */}

          <div className="flex justify-between gap-3">
            <span>Damage Range</span>

            <span className="font-semibold text-cyan-400">{damageRange}</span>
          </div>

          {/* Target */}

          <div className="flex justify-between gap-3">
            <span>Target</span>

            <span className="font-semibold text-cyan-400">
              {targetNecroForce ? "Necro-Force" : "Normal"}
            </span>
          </div>

          {/* Cost Multiplier */}

          <div className="flex justify-between gap-3">
            <span>Cost Multiplier</span>

            <span className="font-semibold text-cyan-400">
              ×{targetNecroForce ? NECRO_FORCE_MULTIPLIER : 1}
            </span>
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
      </div>

      {/* ================================================== */}
      {/* Damage */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Damage
        </h3>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <p className="text-sm text-gray-400">
            Damage is randomly determined within the selected Potency range.
          </p>

          <p className="mt-3 text-2xl font-bold text-cyan-400">{damageRange}</p>
        </div>
      </div>

      {/* ================================================== */}
      {/* Targeting */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Targeting
        </h3>

        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-700 bg-gray-900 p-4 transition-colors hover:border-gray-500">
          <div>
            <p className="font-semibold text-gray-200">Necro-Force</p>

            <p className="mt-1 text-sm text-gray-400">
              Targets Necro-Force and doubles the spell's cost.
            </p>
          </div>

          <input
            type="checkbox"
            checked={targetNecroForce}
            onChange={(e) => setTargetNecroForce(e.target.checked)}
            className="h-5 w-5 shrink-0 accent-orange-500"
          />
        </label>
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
            <span>Base Cost</span>

            <span className="font-semibold text-cyan-400">{baseCost}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Necro-Force Multiplier</span>

            <span className="font-semibold text-cyan-400">
              ×{targetNecroForce ? NECRO_FORCE_MULTIPLIER : 1}
            </span>
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
            <span>Damage Type</span>

            <span className="font-semibold text-cyan-400">NECRO</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Range</span>

            <span className="font-semibold text-cyan-400">DIRECT</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>AOE</span>

            <span className="font-semibold text-cyan-400">None</span>
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
            Draw Life Death deals randomly determined Necro damage based on the
            selected Potency.
          </p>

          <p>
            Minor Potency deals 10–35 damage, Major Potency deals 40–90 damage,
            and Extreme Potency deals 100–220 damage.
          </p>

          <p>
            The caster may target Necro-Force instead of the normal target.
            Doing so doubles the spell's cost.
          </p>

          <p>The spell has Direct range and no area of effect.</p>
        </div>
      </div>
    </>
  );
}
