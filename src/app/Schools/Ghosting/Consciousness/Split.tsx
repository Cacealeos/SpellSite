import React, { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

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

  const [cost, setCost] = useState(150);
  const [intelligence, setIntelligence] = useState(0);

  // ==================================================
  // Derived Values
  // ==================================================

  const maxSplit = Math.floor(intelligence / 3) + 1;

  const splitMeter = (maxSplit / 4) * 100;

  // ==================================================
  // Reset
  // ==================================================

  useEffect(() => {
    if (!active) {
      setCost(150);
      setIntelligence(0);
      updateSpell("cost", 0);
    }
  }, [active, updateSpell]);

  // ==================================================
  // Cost Change Handler
  // ==================================================

  const changeCost = (value: number) => {
    const newCost = Math.max(150, Math.min(1000, value));

    setCost(newCost);
    updateSpell("cost", newCost);
  };

  // ==================================================
  // Intelligence Change Handler
  // ==================================================

  const changeIntelligence = (value: number) => {
    setIntelligence(Math.max(0, value));
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <>
      <h2 className="mb-6 text-center text-3xl font-bold text-cyan-400">
        Split
      </h2>

      {/* ==================================================
          Spell Properties & Final Statistics
          ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Properties
        </h3>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Intelligence</span>

            <span className="font-semibold text-cyan-400">{intelligence}</span>
          </div>

          <div className="flex justify-between">
            <span>Maximum Splits</span>

            <span className="font-semibold text-cyan-400">{maxSplit}</span>
          </div>

          <div className="flex justify-between">
            <span>Cost</span>

            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>
        </div>
      </div>

      {/* ==================================================
          Spell Configuration
          ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Configuration
        </h3>

        <div className="grid gap-4">
          <label>
            <span className="text-gray-300">
              Intelligence
              <span className="ml-2 text-gray-500">(1–10)</span>
            </span>

            <input
              type="number"
              min={1}
              max={10}
              step={1}
              value={intelligence}
              onChange={(e) =>
                changeIntelligence(
                  Math.min(10, Math.max(1, Number(e.target.value) || 1)),
                )
              }
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>

          {/* Maximum Split Meter */}

          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-gray-300">Maximum Splits</span>

              <span className="font-semibold text-cyan-400">{maxSplit}</span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-900">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{
                  width: `${splitMeter}%`,
                }}
              />
            </div>
          </div>

          {/* Cost */}

          <label>
            <span className="text-gray-300">
              Cost
              <span className="ml-2 text-gray-500">
                (Optional — minimum 150)
              </span>
            </span>

            <input
              type="number"
              min={150}
              max={1000}
              step={1}
              value={cost}
              onChange={(e) => changeCost(Number(e.target.value) || 150)}
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>
        </div>
      </div>
    </>
  );
};

export default Split;
