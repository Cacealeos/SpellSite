import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Static Data
// ==================================================

const masteryData = {
  NOVICE: {
    rate: 8,
  },
  INTERMEDIATE: {
    rate: 4,
  },
  MASTERED: {
    rate: 2,
  },
};

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Carry Spell": true,
  "Spell Shift": true,
  "Counter Spell": true,
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

export default function DisruptionRec({
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

  const [disruption, setDisruption] = useState(0);

  const [counterSpell, setCounterSpell] = useState(false);
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
  // The mastery rate remains the base Manna / Disruption ratio.
  const recoveryMultiplier = hyperSpell ? 1.3 : 1;

  // Base cost is determined by the amount of Disruption being recovered.
  const baseCost = disruption * rate;

  // Hyper Spell improves the recovery efficiency by 30%.
  const cost = Math.ceil(baseCost / recoveryMultiplier);

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
      {/* Recovery Statistics */}
      {/* ================================================== */}

      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4 shadow-md">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-gray-300">
            Recovery Statistics
          </h2>

          <div className="flex gap-2">
            {/* Counter Spell */}
            <button
              type="button"
              onClick={() => setCounterSpell((prev) => !prev)}
              className={`rounded-md border px-3 py-1 text-xs font-medium transition ${
                counterSpell
                  ? "border-red-400 bg-red-500/10 text-red-300 shadow-[0_0_12px_rgba(248,113,113,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-red-400"
              }`}
            >
              Counter Spell
            </button>

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

        {/* Spell Toggle Descriptions */}
        <div className="mt-3 space-y-1 text-xs text-gray-400">
          {counterSpell && (
            <p>
              Allows for the interruption of the Sealing process as a{" "}
              <span className="font-semibold text-red-300">
                DEFENSIVE ACTION
              </span>
              .
            </p>
          )}

          {hyperSpell && (
            <p>
              Reduces Cost by{" "}
              <span className="font-semibold text-purple-300">75%</span> and
              increases Recovery Rate by{" "}
              <span className="font-semibold text-purple-300">30%</span>.
            </p>
          )}
        </div>

        {/* Derived Statistics */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-center">
            <div className="text-xs text-gray-400">Recovery Rate</div>
            <div className="mt-1 text-lg font-semibold text-gray-100">
              {rate} Manna / Disruption
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-center">
            <div className="text-xs text-gray-400">Disruption Recovered</div>
            <div className="mt-1 text-lg font-semibold text-gray-100">
              {disruption}
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-center">
            <div className="text-xs text-gray-400">Cost</div>
            <div className="mt-1 text-lg font-semibold text-gray-100">
              {cost}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* Disruption Recovery */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Disruption Recovery
        </h3>

        <label className="block text-sm font-medium text-gray-300">
          Amount Recovered
        </label>

        <input
          type="number"
          min="0"
          step="1"
          value={disruption}
          onChange={(e) => setDisruption(Number(e.target.value) || 0)}
          className="mt-2 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-cyan-400 outline-none focus:border-orange-500"
        />

        <p className="mt-2 text-sm text-gray-400">
          Info: Removes disruption build up. Inefficiently.
        </p>
      </div>
    </>
  );
}
