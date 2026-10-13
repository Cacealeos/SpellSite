import { useEffect, useState } from "react";
import { CubeTransparentIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Carry Spell": true,
  "Spell Shift": true,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": true,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Base Spell Statistics
// ==================================================

const baseStats = {
  base: 260,
  power: 8,
  aoe: 2,
  charge: 8,
  cost: 350,
  costModifier: 80,
  damage: 25,
};

const AOE = ["SMALL", "MODERATE", "LARGE", "MASSIVE"];

const MAX_INCREMENT = 3;

// ==================================================
// Component
// ==================================================

const AugmentDimensional = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ==================================================
  // State
  // ==================================================

  const [increments, setIncrements] = useState(0);

  // ==================================================
  // Increment Calculations
  // ==================================================

  const currentStats = {
    base: baseStats.base + baseStats.damage * increments,

    power: baseStats.power + (increments > 0 ? 1 : 0),

    aoe:
      increments > 1
        ? Math.min(baseStats.aoe + 1, AOE.length - 1)
        : baseStats.aoe,

    charge: baseStats.charge + (increments > 1 ? 1 : 0),

    damage: baseStats.damage,

    cost: baseStats.cost + baseStats.costModifier * increments,
  };

  // ==================================================
  // Spell Cost
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", currentStats.cost);
  }, [active, currentStats.cost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <CubeTransparentIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Augment Dimensional
        </h1>
      </div>

      {/* ================================================== */}
      {/* Spell Techniques Table */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* Augmentation */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Augmentation
        </h3>

        <div className="space-y-4">
          <label>
            <span className="text-gray-300">Increments</span>

            <input
              type="number"
              min={0}
              max={MAX_INCREMENT}
              step={1}
              value={increments}
              onChange={(e) =>
                setIncrements(
                  Math.min(
                    MAX_INCREMENT,
                    Math.max(0, Math.trunc(Number(e.target.value) || 0)),
                  ),
                )
              }
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>

          <div className="space-y-2 text-gray-300">
            <div className="flex justify-between">
              <span>Base Damage</span>

              <span className="font-semibold text-cyan-400">
                {baseStats.base}
                {increments > 0 && ` → ${currentStats.base}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Power</span>

              <span className="font-semibold text-cyan-400">
                {baseStats.power}
                {increments > 0 && ` → ${currentStats.power}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Area of Effect</span>

              <span className="font-semibold text-cyan-400">
                {AOE[baseStats.aoe]}
                {increments > 1 && ` → ${AOE[currentStats.aoe]}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Charge Time</span>

              <span className="font-semibold text-cyan-400">
                {baseStats.charge}
                {increments > 1 && ` → ${currentStats.charge}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Damage Modifier</span>

              <span className="font-semibold text-cyan-400">
                +{baseStats.damage} per increment
              </span>
            </div>

            <div className="flex justify-between">
              <span>Cost</span>

              <span className="font-semibold text-cyan-400">
                {baseStats.cost}
                {increments > 0 && ` → ${currentStats.cost}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Final Spell Properties */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h3>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Base</span>

            <span className="font-semibold text-cyan-400">
              {currentStats.base}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Power</span>

            <span className="font-semibold text-cyan-400">
              {currentStats.power}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Area of Effect</span>

            <span className="font-semibold text-cyan-400">
              {AOE[currentStats.aoe]}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Charge Time</span>

            <span className="font-semibold text-cyan-400">
              {currentStats.charge}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Damage</span>

            <span className="font-semibold text-cyan-400">
              +{currentStats.damage * increments}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Damage Type</span>

            <span className="font-semibold text-cyan-400">Dimensional</span>
          </div>

          <div className="flex justify-between">
            <span>Range</span>

            <span className="font-semibold text-cyan-400">Radial</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Final Cost</span>

            <span className="font-semibold text-cyan-400">
              {currentStats.cost}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AugmentDimensional;
