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
  "Spell Reflex": true,
  "Double Cast": true,
  "Double Pulse": false,
  "Carry Spell": true,
  "Spell Shift": true,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
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

export default function RegenLF({
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
  const [spellReflex, setSpellReflex] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Derived Values
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const { rate } = masteryData[mastery];

  const effectiveRate = hyperSpell ? rate * 1.3 : rate;
  const baseCost = Math.ceil(lifeForce * effectiveRate);
  const cost = hyperSpell ? Math.ceil(baseCost * 0.25) : baseCost;

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
        <div className="mb-3 flex items-center justify-between border-b border-gray-700 pb-2">
          <h3 className="text-lg font-semibold text-orange-400">
            Regeneration Statistics
          </h3>

          <div className="flex gap-2">
            {/* Spell Reflex */}
            <button
              type="button"
              onClick={() => setSpellReflex((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                spellReflex
                  ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-cyan-500 hover:text-cyan-300"
              }`}
            >
              Spell Reflex
            </button>

            {/* Hyper Spell */}
            <button
              type="button"
              onClick={() => setHyperSpell((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                hyperSpell
                  ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-500 hover:text-purple-300"
              }`}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Life-Force Regeneration</span>
            <span className="font-semibold text-cyan-400">+{lifeForce}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Regeneration Rate</span>
            <span className="font-semibold text-cyan-400">
              {rate} Cost / Life-Force
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Cost</span>
            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>
        </div>

        {/* Spell Reflex Effect */}
        {spellReflex && (
          <p className="mt-4 border-t border-gray-700 pt-3 text-sm text-cyan-300">
            Allows use of Restoration Spells with durations to be used WITHOUT a
            main action.
          </p>
        )}

        {/* Hyper Spell Effect */}
        {hyperSpell && (
          <p className="mt-3 text-sm text-purple-300">
            Reduces Cost by 75% and increases Regeneration Rate by 30%.
          </p>
        )}
      </div>

      {/* ================================================== */}
      {/* Life-Force Regeneration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Life-Force Regeneration
        </h3>

        <input
          type="number"
          min="0"
          step="1"
          value={lifeForce}
          onChange={(e) => setLifeForce(Number(e.target.value) || 0)}
          className="mt-2 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-cyan-400 outline-none focus:border-orange-500"
        />

        <p className="mt-2 text-sm text-gray-400">Regain LF or temporary LF.</p>

        <p className="mt-1 text-sm text-gray-400">Lasts 4, 3*, 2** turns.</p>
      </div>
    </>
  );
}
