import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

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
// Constants
// ==================================================

const MIN_COST = 150;
const MAX_COST = 1000;

// ==================================================
// Component
// ==================================================

const Reconstitute = ({
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

  const [cost, setCost] = useState(MIN_COST);

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    if (!active) {
      setCost(MIN_COST);
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  // ==================================================
  // Cost Change Handler
  // ==================================================

  const changeCost = (value: number) => {
    const newCost = Math.max(
      MIN_COST,
      Math.min(MAX_COST, Math.trunc(value || MIN_COST)),
    );

    setCost(newCost);
  };

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <ArrowPathIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Reconstitute</h1>
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
        {/* ================================================== */}
        {/* Header */}
        {/* ================================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>
        </div>

        {/* ================================================== */}
        {/* Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Minimum Cost */}

          <div className="flex justify-between">
            <span>Minimum Cost</span>

            <span className="font-semibold text-cyan-400">{MIN_COST}</span>
          </div>

          {/* Maximum Cost */}

          <div className="flex justify-between">
            <span>Maximum Cost</span>

            <span className="font-semibold text-cyan-400">{MAX_COST}</span>
          </div>

          {/* Final Cost */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">{cost}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Cost Adjustment */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Cost Adjustment
        </h3>

        <label className="block">
          <span className="text-gray-300">Cost</span>

          <span className="ml-2 text-sm text-gray-500">
            Optional — minimum {MIN_COST}
          </span>

          <input
            type="number"
            min={MIN_COST}
            max={MAX_COST}
            step={1}
            value={cost}
            onChange={(e) => changeCost(Number(e.target.value))}
            className="mt-2 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <p className="mt-3 text-sm italic text-gray-400">
          Adjust the mana cost between {MIN_COST} and {MAX_COST}. The default
          cost is {MIN_COST}.
        </p>
      </div>
    </>
  );
};

export default Reconstitute;
