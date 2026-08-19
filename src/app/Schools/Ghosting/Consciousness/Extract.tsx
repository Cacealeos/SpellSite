import React, { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

const ExtractFabricate = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ==================================================
  // Constants
  // ==================================================

  const MIN_COST = 150;
  const MAX_COST = 1000;

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
  // Handlers
  // ==================================================

  const changeCost = (value: number) => {
    const newCost = Math.min(MAX_COST, Math.max(MIN_COST, value));

    setCost(newCost);
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <>
      {/* ==================================================
          Spell Title
          ================================================== */}

      <h2 className="mb-6 text-center text-3xl font-bold text-cyan-400">
        Extract & Fabricate
      </h2>

      {/* ==================================================
          Spell Properties
          ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Properties
        </h3>

        <div className="space-y-2 text-gray-300">
          <p>OPTIONAL COST INPUT</p>
          <p>Cost Range: 150 - 1000</p>
        </div>
      </div>

      {/* ==================================================
          Optional Cost
          ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Optional Cost
        </h3>

        <label>
          <span className="text-gray-300">Additional Mana Cost</span>

          <span className="ml-2 text-sm text-gray-500">
            Optional — defaults to {MIN_COST}
          </span>

          <input
            type="number"
            min={MIN_COST}
            max={MAX_COST}
            value={cost}
            onChange={(e) => changeCost(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
          />
        </label>
      </div>
    </>
  );
};

export default ExtractFabricate;
