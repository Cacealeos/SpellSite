import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Static Data
// ==================================================

const masteryData = {
  NOVICE: { rate: 3 },
  INTERMEDIATE: { rate: 5 },
  MASTERED: { rate: 10 },
};

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Carry Spell": true,
  "Spell Shift": true,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Component
// ==================================================

export default function PainHealing({
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

  const [mannaCost, setMannaCost] = useState(0);
  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Derived Values
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const { rate } = masteryData[mastery];

  // Hyper Spell increases the recovery rate by 30%.
  const recoveryMultiplier = hyperSpell ? 1.3 : 1;

  // Base pain recovery is determined by the Manna invested.
  const baseRecovery = Math.floor(mannaCost * rate);

  // Hyper Spell increases recovery efficiency by 30%.
  const painTolerance = Math.floor(baseRecovery * recoveryMultiplier);

  // Hyper Spell reduces the Manna cost by 75%.
  const effectiveMannaCost = hyperSpell
    ? Math.ceil(mannaCost * 0.25)
    : mannaCost;

  // ==================================================
  // Spell Updates
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", effectiveMannaCost);
  }, [active, effectiveMannaCost, updateSpell]);

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
      {/* Pain Recovery Statistics */}
      {/* ================================================== */}

      <section className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-orange-400">
            Pain Recovery Statistics
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
              {rate} Tolerance / Manna
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-center">
            <div className="text-xs text-gray-400">
              Pain Tolerance Recovered
            </div>

            <div className="mt-1 text-lg font-semibold text-cyan-400">
              +{painTolerance}
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-center">
            <div className="text-xs text-gray-400">Manna Cost</div>

            <div className="mt-1 text-lg font-semibold text-cyan-400">
              {effectiveMannaCost}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* Manna Investment */}
      {/* ================================================== */}

      <section className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Manna Investment
        </h3>

        <label className="block text-sm font-medium text-gray-300">Manna</label>

        <input
          type="number"
          min="0"
          step="1"
          value={mannaCost}
          onChange={(e) => setMannaCost(Number(e.target.value) || 0)}
          className="mt-2 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-cyan-400 outline-none focus:border-orange-500"
        />

        <p className="mt-2 text-sm text-gray-400">Alleviates building pain.</p>
      </section>
    </>
  );
}
