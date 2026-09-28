import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Static Data
// ==================================================

const masteryData = {
  NOVICE: {
    rate: 5,
  },
  INTERMEDIATE: {
    rate: 3,
  },
  MASTERED: {
    rate: 1,
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
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Component
// ==================================================

export default function MannaHealing({
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

  const [lifeForce, setLifeForce] = useState(0);
  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Derived Values
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const { rate } = masteryData[mastery];

  // Hyper Spell increases the healing/recovery rate by 30%.
  const recoveryMultiplier = hyperSpell ? 1.3 : 1;

  // Base manna cost is determined by the Life-Force being restored.
  const baseCost = lifeForce * rate;

  // Hyper Spell increases recovery efficiency by 30%.
  const recoveryCost = baseCost / recoveryMultiplier;

  // Hyper Spell reduces the resulting cost by 75%.
  const mannaCost = hyperSpell ? Math.ceil(recoveryCost * 0.25) : recoveryCost;

  const healing = lifeForce;

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", mannaCost);
  }, [active, mannaCost, updateSpell]);

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
      {/* Healing Statistics */}
      {/* ================================================== */}

      <section className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-orange-400">
            Healing Statistics
          </h3>

          <div className="flex gap-2">
            {/* Hyper Spell */}
            <button
              type="button"
              onClick={() => setHyperSpell((prev) => !prev)}
              className={`rounded-md border px-3 py-1 text-xs font-medium transition ${
                hyperSpell
                  ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-400"
              }`}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Effects */}
        {/* ================================================== */}

        <div className="mt-3 space-y-1 text-xs text-gray-400">
          {hyperSpell && (
            <p>
              Reduces Cost by{" "}
              <span className="font-semibold text-purple-300">75%</span> and
              increases Recovery Rate by{" "}
              <span className="font-semibold text-purple-300">30%</span>.
            </p>
          )}
        </div>

        {/* ================================================== */}
        {/* Derived Statistics */}
        {/* ================================================== */}

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-center">
            <div className="text-xs text-gray-400">Recovery Rate</div>
            <div className="mt-1 text-lg font-semibold text-gray-100">
              {rate} Manna / Life-Force
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-center">
            <div className="text-xs text-gray-400">Life-Force Restored</div>
            <div className="mt-1 text-lg font-semibold text-cyan-400">
              +{healing}
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-center">
            <div className="text-xs text-gray-400">Manna Cost</div>
            <div className="mt-1 text-lg font-semibold text-cyan-400">
              {mannaCost}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* Life Force Investment */}
      {/* ================================================== */}

      <section className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Life Force Recovery
        </h3>

        <input
          type="number"
          min="0"
          step="1"
          value={lifeForce}
          onChange={(e) => setLifeForce(Number(e.target.value) || 0)}
          className="mt-2 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-cyan-400 outline-none focus:border-orange-500"
        />

        <p className="mt-2 text-sm text-gray-400">
          Restore Life-Force at the cost of manna.
        </p>
      </section>
    </>
  );
}
