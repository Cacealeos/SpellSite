import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Static Data
// ==================================================

const masteryData = {
  NOVICE: {
    costPerLimb: 15,
  },
  INTERMEDIATE: {
    costPerLimb: 10,
  },
  MASTERED: {
    costPerLimb: 5,
  },
};

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": false,
  "Carry Spell": true,
  "Spell Shift": true,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": false,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Component
// ==================================================

export default function ReConstitute({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) {
  // ==================================================
  // State
  // ==================================================

  const [limbs, setLimbs] = useState(1);

  // ==================================================
  // Derived Values
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const { costPerLimb } = masteryData[mastery];

  const cost = limbs * costPerLimb;

  // ==================================================
  // Spell Updates
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  if (!active) return null;

  return (
    <>
      {/* ================================================== */}
      {/* Spell Techniques */}
      {/* ================================================== */}

      <SpellTechniquesTable techniques={Techniques} />

      {/* ================================================== */}
      {/* Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Re-Constitution Statistics
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Limbs Reconstructed</span>
            <span className="font-semibold text-cyan-400">{limbs}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Cost per Limb</span>
            <span className="font-semibold text-cyan-400">{costPerLimb}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Cost</span>
            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Limb Selection */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Limb Reconstruction
        </h3>

        <input
          type="number"
          min="1"
          max="5"
          step="1"
          value={limbs}
          onChange={(e) =>
            setLimbs(Math.min(5, Math.max(1, Number(e.target.value) || 1)))
          }
          className="mt-2 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-cyan-400 outline-none focus:border-orange-500"
        />

        <p className="mt-2 text-sm text-gray-400">
          Select the number of missing limbs to reconstruct.
        </p>

        <p className="mt-1 text-sm text-gray-400">Maximum of 5 limbs.</p>
      </div>
    </>
  );
}
