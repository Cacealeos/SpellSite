import { useEffect, useState } from "react";
import { CubeTransparentIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import Select from "@/app/Select";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type DominateDashProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type DominateType = "Structure" | "Entity";

// ==================================================
// Domination Types
// ==================================================

const types: DominateType[] = ["Structure", "Entity"];

// ==================================================
// Mastery Rates
// ==================================================

const bonusSacrificeRates: Record<MasteryType, number> = {
  NOVICE: 10,
  INTERMEDIATE: 5,
  MASTERED: 3,
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

const BASE_DASH_SACRIFICE = 20;
const MAX_SORCERY_BONUS = 4;
const TARGET_BONUS_PER_ATTEMPT = 2;

// ==================================================
// Helpers
// ==================================================

const normalizeInteger = (value: number) =>
  Math.max(0, Math.trunc(Number.isFinite(value) ? value : 0));

// ==================================================
// Component
// ==================================================

export default function DominateDash({
  ParentMastery,
  active,
  updateSpell,
}: DominateDashProps) {
  // ==================================================
  // State
  // ==================================================

  const [type, setType] = useState<DominateType>("Structure");

  const [additionalBonus, setAdditionalBonus] = useState(0);

  const [dashAttempts, setDashAttempts] = useState(1);

  // ==================================================
  // Mastery Calculations
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const bonusSacrificeRate = bonusSacrificeRates[mastery];

  // ==================================================
  // PPP Sacrifice Calculations
  // ==================================================

  const additionalSacrificePercentage = additionalBonus * bonusSacrificeRate;

  const totalSacrificePercentage =
    BASE_DASH_SACRIFICE + additionalSacrificePercentage;

  // ==================================================
  // Sorcery Calculations
  // ==================================================

  const targetSorceryBonus = dashAttempts * TARGET_BONUS_PER_ATTEMPT;

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", 0);
    updateSpell("ttt", 0);
  }, [active, updateSpell]);

  // ==================================================
  // Reset When Inactive
  // ==================================================

  useEffect(() => {
    if (!active) {
      setType("Structure");
      setAdditionalBonus(0);
      setDashAttempts(1);
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
        <CubeTransparentIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Dominate Dash</h1>
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
          {/* Domination Type */}

          <div className="flex justify-between gap-3">
            <span>Domination Type</span>

            <span className="font-semibold text-cyan-400">{type}</span>
          </div>

          {/* Base Sacrifice */}

          <div className="flex justify-between gap-3">
            <span>Base Dash Sacrifice</span>

            <span className="font-semibold text-cyan-400">
              {BASE_DASH_SACRIFICE}%
            </span>
          </div>

          {/* Additional Sorcery Bonus */}

          <div className="flex justify-between gap-3">
            <span>Additional Sorcery Bonus</span>

            <span className="font-semibold text-cyan-400">
              +{additionalBonus}
            </span>
          </div>

          {/* Additional Sacrifice */}

          <div className="flex justify-between gap-3">
            <span>Additional PPP Sacrifice</span>

            <span className="font-semibold text-cyan-400">
              {additionalSacrificePercentage}%
            </span>
          </div>

          {/* Dash Attempts */}

          <div className="flex justify-between gap-3">
            <span>Dash Attempts</span>

            <span className="font-semibold text-cyan-400">{dashAttempts}</span>
          </div>

          {/* Target Sorcery Bonus */}

          <div className="flex justify-between gap-3">
            <span>Target Sorcery Bonus Against Caster</span>

            <span className="font-semibold text-purple-400">
              +{targetSorceryBonus}
            </span>
          </div>

          {/* Total Sacrifice */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">
              Total PPP Sacrifice
            </span>

            <span className="text-lg font-bold text-orange-400">
              {totalSacrificePercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Sorcery Bonus Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Sorcery Bonus Configuration
        </h3>

        {/* Additional Sorcery Bonus */}

        <label className="block">
          <span className="mb-2 block font-semibold text-gray-300">
            Additional Sorcery Bonus
          </span>

          <input
            type="number"
            min={0}
            max={MAX_SORCERY_BONUS}
            step={1}
            value={additionalBonus}
            onChange={(e) =>
              setAdditionalBonus(
                Math.min(
                  MAX_SORCERY_BONUS,
                  normalizeInteger(Number(e.target.value)),
                ),
              )
            }
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <p className="mt-2 text-sm text-gray-500">
          Each +1 Sorcery bonus sacrifices {bonusSacrificeRate}% of accrued PPP.
          Maximum bonus: +{MAX_SORCERY_BONUS}.
        </p>

        {/* Bonus Summary */}

        <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between text-gray-300">
            <span>Sacrifice per +1</span>

            <span className="font-semibold text-cyan-400">
              {bonusSacrificeRate}%
            </span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Selected Bonus</span>

            <span className="font-semibold text-cyan-400">
              +{additionalBonus}
            </span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Additional Sacrifice</span>

            <span className="font-semibold text-cyan-400">
              {additionalSacrificePercentage}%
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3 text-gray-300">
            <span className="font-semibold text-gray-100">
              Total PPP Sacrifice
            </span>

            <span className="text-lg font-bold text-orange-400">
              {totalSacrificePercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Dash Attempts */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Dash Attempts
        </h3>

        {/* Dash Attempts Input */}

        <label className="block">
          <span className="mb-2 block font-semibold text-gray-300">
            Dash Attempts This Battle
          </span>

          <input
            type="number"
            min={0}
            step={1}
            value={dashAttempts}
            onChange={(e) =>
              setDashAttempts(normalizeInteger(Number(e.target.value)))
            }
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <p className="mt-2 text-sm text-gray-500">
          Each Dash attempt grants the target +2 to Sorcery rolls against the
          caster for the remainder of the battle.
        </p>

        {/* Target Bonus Summary */}

        <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between gap-3 text-gray-300">
            <span>Target Sorcery Bonus Against Caster</span>

            <span className="text-lg font-bold text-orange-400">
              +{targetSorceryBonus}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Domination Type */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Domination Type
        </h3>

        <Select choices={types} changeChoice={setType} title={type} />

        <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between gap-3 text-gray-300">
            <span>Selected Type</span>

            <span className="font-semibold text-cyan-400">{type}</span>
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
            Dominate Dash allows the caster to attempt temporary domination with
            an additional Sorcery roll at the cost of accrued PPP.
          </p>

          <p>Each Dash sacrifices 20% of accrued PPP.</p>

          <p>
            The target receives a cumulative +2 bonus to Sorcery rolls against
            the caster for the remainder of the battle for each Dash attempt
            made.
          </p>

          <p>
            The caster may gain an additional +1 to their Sorcery roll against
            the target by sacrificing additional PPP. Each +1 costs 10% for
            Novice, 5% for Intermediate, or 3% for Mastered casters, up to a
            maximum bonus of +4.
          </p>
        </div>
      </div>
    </>
  );
}
