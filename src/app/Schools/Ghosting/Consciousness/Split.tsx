import { useEffect, useState } from "react";
import { Square3Stack3DIcon } from "@heroicons/react/24/solid";

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

const MIN_INTELLIGENCE = 1;
const MAX_INTELLIGENCE = 10;

// ==================================================
// Component
// ==================================================

const Split = ({
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

  const [intelligence, setIntelligence] = useState(0);

  // ==================================================
  // Derived Values
  // ==================================================

  const maxSplit = Math.floor(intelligence / 3) + 1;

  const splitMeter = Math.min(100, (maxSplit / 4) * 100);

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    if (!active) {
      setCost(MIN_COST);
      setIntelligence(0);
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
  // Intelligence Change Handler
  // ==================================================

  const changeIntelligence = (value: number) => {
    const newIntelligence = Math.max(
      MIN_INTELLIGENCE,
      Math.min(MAX_INTELLIGENCE, Math.trunc(value || MIN_INTELLIGENCE)),
    );

    setIntelligence(newIntelligence);
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
        <Square3Stack3DIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Split</h1>
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
          {/* Intelligence */}

          <div className="flex justify-between">
            <span>Intelligence</span>

            <span className="font-semibold text-cyan-400">{intelligence}</span>
          </div>

          {/* Maximum Splits */}

          <div className="flex justify-between">
            <span>Maximum Splits</span>

            <span className="font-semibold text-cyan-400">{maxSplit}</span>
          </div>

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
      {/* Spell Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Configuration
        </h3>

        <div className="space-y-5">
          {/* ================================================== */}
          {/* Intelligence */}
          {/* ================================================== */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Intelligence
              <span className="ml-2 text-sm font-normal text-gray-500">
                (1–10)
              </span>
            </span>

            <input
              type="number"
              min={MIN_INTELLIGENCE}
              max={MAX_INTELLIGENCE}
              step={1}
              value={intelligence}
              onChange={(e) => changeIntelligence(Number(e.target.value))}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />
          </label>

          {/* ================================================== */}
          {/* Maximum Split Meter */}
          {/* ================================================== */}

          <div>
            <div className="mb-2 flex justify-between">
              <span className="font-semibold text-gray-300">
                Maximum Splits
              </span>

              <span className="font-semibold text-cyan-400">{maxSplit}</span>
            </div>

            <div
              className="h-3 w-full overflow-hidden rounded-full bg-gray-900"
              role="progressbar"
              aria-label="Maximum splits"
              aria-valuenow={maxSplit}
              aria-valuemin={1}
              aria-valuemax={4}
            >
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-300"
                style={{
                  width: `${splitMeter}%`,
                }}
              />
            </div>

            <p className="mt-2 text-sm italic text-gray-400">
              Gain one additional split for every 3 Intelligence points.
            </p>
          </div>

          {/* ================================================== */}
          {/* Cost Adjustment */}
          {/* ================================================== */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Cost
              <span className="ml-2 text-sm font-normal text-gray-500">
                (Optional — minimum {MIN_COST})
              </span>
            </span>

            <input
              type="number"
              min={MIN_COST}
              max={MAX_COST}
              step={1}
              value={cost}
              onChange={(e) => changeCost(Number(e.target.value))}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />
          </label>
        </div>
      </div>
    </>
  );
};

export default Split;
