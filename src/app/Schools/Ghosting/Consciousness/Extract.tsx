import { useEffect, useState } from "react";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";

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
  // State
  // ==================================================

  const [cost, setCost] = useState(MIN_COST);

  const [counterSpell, setCounterSpell] = useState(false);

  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    if (!active) {
      setCost(MIN_COST);
      setCounterSpell(false);
      setHyperSpell(false);
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  // ==================================================
  // Handlers
  // ==================================================

  const changeCost = (value: number) => {
    const newCost = Math.min(
      MAX_COST,
      Math.max(MIN_COST, Math.trunc(value || MIN_COST)),
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
        <DocumentDuplicateIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Extract &amp; Fabricate
        </h1>
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
        {/* Header & Technique Buttons */}
        {/* ================================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCounterSpell(!counterSpell)}
              aria-pressed={counterSpell}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                counterSpell
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Counter Spell
            </button>

            <button
              type="button"
              onClick={() => setHyperSpell(!hyperSpell)}
              aria-pressed={hyperSpell}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                hyperSpell
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Captions */}
        {/* ================================================== */}

        {(counterSpell || hyperSpell) && (
          <div className="mb-5 space-y-3">
            {counterSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Counter Spell:</strong>{" "}
                  Grants an{" "}
                  <strong className="text-purple-300">
                    extra roll upon failure
                  </strong>{" "}
                  when using Transmogrify on a target, and allows Mutate
                  Consciousness to be used as a{" "}
                  <strong className="text-purple-300">DEFENSIVE</strong>{" "}
                  measure.
                </p>
              </div>
            )}

            {hyperSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Hyper Spell:</strong>{" "}
                  Allows the caster to inject a copy of their own monitoring
                  consciousness within the target.{" "}
                  <strong className="text-red-400">
                    Highly susceptible to Disruption.
                  </strong>
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Minimum Cost</span>
            <span className="font-semibold text-cyan-400">{MIN_COST}</span>
          </div>

          <div className="flex justify-between">
            <span>Maximum Cost</span>
            <span className="font-semibold text-cyan-400">{MAX_COST}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>
            <span className="text-lg font-bold text-orange-400">{cost}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Optional Cost */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Optional Cost
        </h3>

        <label className="block">
          <span className="text-gray-300">Additional Mana Cost</span>

          <span className="ml-2 text-sm text-gray-500">
            Optional — defaults to {MIN_COST}
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
      </div>
    </>
  );
};

export default ExtractFabricate;
