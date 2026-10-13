import { useEffect, useState } from "react";
import { FireIcon } from "@heroicons/react/24/solid";

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
// Mastery Data
// ==================================================

const masteryStats = {
  NOVICE: {
    cost: 100,
    ttt: 16,
  },
  INTERMEDIATE: {
    cost: 70,
    ttt: 12,
  },
  MASTERED: {
    cost: 40,
    ttt: 8,
  },
};

// ==================================================
// Size Data
// ==================================================

const sizeOptions = [
  {
    label: "Tiny",
    multiplier: 0.5,
  },
  {
    label: "Sizeable",
    multiplier: 1,
  },
  {
    label: "Enormous",
    multiplier: 2,
  },
  {
    label: "Gargantuan",
    multiplier: 4,
  },
];

// ==================================================
// Spell Surge Constants
// ==================================================

const SURGE_REDUCTION = 0.15;
const MAX_SURGE_REDUCTION = 0.75;
const MAX_SUCCESSIVE_CASTS = 5;

// ==================================================
// Component
// ==================================================

const ImbueEnthalpy = ({
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

  const [size, setSize] = useState(1);

  const [desc, setDesc] = useState("");

  const [counterSpell, setCounterSpell] = useState(false);

  const [spellSurge, setSpellSurge] = useState(false);

  const [successiveCasts, setSuccessiveCasts] = useState(0);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const currentStats = masteryStats[mastery];

  // ==================================================
  // Derived Values
  // ==================================================

  const baseCost = currentStats.cost;

  const totalTTT = currentStats.ttt * size;

  // Spell Surge reduces mana cost by 15% per
  // successive cast, capped at 75%.
  const surgeReduction = spellSurge
    ? Math.min(successiveCasts * SURGE_REDUCTION, MAX_SURGE_REDUCTION)
    : 0;

  const surgePercentage = Math.round(surgeReduction * 100);

  const finalCost = Math.ceil(baseCost * (1 - surgeReduction));

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
    updateSpell("ttt", active ? totalTTT : 0);
  }, [active, finalCost, totalTTT, updateSpell]);

  // ==================================================
  // Reset
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSize(1);
      setDesc("");
      setCounterSpell(false);
      setSpellSurge(false);
      setSuccessiveCasts(0);
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const toggleSpellSurge = () => {
    setSpellSurge((previous) => !previous);
    setSuccessiveCasts(0);
  };

  const changeSuccessiveCasts = (value: number) => {
    setSuccessiveCasts(
      Math.max(0, Math.min(MAX_SUCCESSIVE_CASTS, Math.trunc(value || 0))),
    );
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
        <FireIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Imbue Enthalpy</h1>
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
            {/* Counter Spell */}

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

            {/* Spell Surge */}

            <button
              type="button"
              onClick={toggleSpellSurge}
              aria-pressed={spellSurge}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                spellSurge
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Spell Surge
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Captions */}
        {/* ================================================== */}

        {(counterSpell || spellSurge) && (
          <div className="mb-5 space-y-3">
            {/* Counter Spell Caption */}

            {counterSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Counter Spell:</strong>{" "}
                  Allows Transmogrification to be used as a{" "}
                  <strong className="text-purple-300">DEFENSIVE</strong>{" "}
                  measure.
                </p>
              </div>
            )}

            {/* Spell Surge Caption */}

            {spellSurge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Surge:</strong>{" "}
                  Incrementally reduces mana cost by{" "}
                  <strong className="text-purple-300">15%</strong> for each
                  successive spell cast, up to a maximum reduction of{" "}
                  <strong className="text-purple-300">75%</strong>.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Range */}

          <div className="flex justify-between">
            <span>Range</span>

            <span className="font-semibold text-cyan-400">MISSILE</span>
          </div>

          {/* Size */}

          <div className="flex justify-between">
            <span>Size</span>

            <span className="font-semibold text-cyan-400">×{size}</span>
          </div>

          {/* Base Cost */}

          <div className="flex justify-between">
            <span>Base Cost</span>

            <span className="font-semibold text-cyan-400">{baseCost}</span>
          </div>

          {/* Spell Surge Reduction */}

          {spellSurge && (
            <>
              <div className="flex justify-between">
                <span>Successive Casts</span>

                <span className="font-semibold text-cyan-400">
                  {successiveCasts}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Mana Reduction</span>

                <span className="font-semibold text-purple-400">
                  -{surgePercentage}%
                </span>
              </div>
            </>
          )}

          {/* Total TTT */}

          <div className="flex justify-between">
            <span>Total TTT</span>

            <span className="font-semibold text-cyan-400">{totalTTT}</span>
          </div>

          {/* Final Cost */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Size Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Size
        </h3>

        <p className="mb-4 text-sm text-gray-400">
          Base TTT:{" "}
          <span className="font-semibold text-cyan-400">
            {currentStats.ttt}
          </span>{" "}
          (Novice 16 / Intermediate 12 / Mastered 8). Size multiplies TTT.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {sizeOptions.map((option) => {
            const selected = size === option.multiplier;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => setSize(option.multiplier)}
                aria-pressed={selected}
                className={`rounded-lg border p-3 text-left transition-all ${
                  selected
                    ? "border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                    : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{option.label}</span>

                  <span className="text-sm">×{option.multiplier}</span>
                </div>

                <p className="mt-1 text-sm opacity-80">
                  {currentStats.ttt * option.multiplier} TTT
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================== */}
      {/* Spell Surge Configuration */}
      {/* ================================================== */}

      {spellSurge && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Spell Surge Configuration
          </h3>

          {/* Successive Casts */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Successive Casts
              <span className="ml-2 text-sm font-normal text-gray-500">
                (0–5)
              </span>
            </span>

            <input
              type="number"
              min={0}
              max={MAX_SUCCESSIVE_CASTS}
              step={1}
              value={successiveCasts}
              onChange={(e) => changeSuccessiveCasts(Number(e.target.value))}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />
          </label>

          {/* Reduction Meter */}

          <div className="mt-5">
            <div className="mb-2 flex justify-between">
              <span className="font-semibold text-gray-300">
                Mana Cost Reduction
              </span>

              <span className="font-semibold text-purple-400">
                {surgePercentage}%
              </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-900">
              <div
                className="h-full rounded-full bg-purple-500 transition-all duration-300"
                style={{
                  width: `${(surgeReduction / MAX_SURGE_REDUCTION) * 100}%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm italic text-gray-400">
              Each successive cast reduces the original mana cost by another
              15%. The reduction is capped at 75%.
            </p>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* Description */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Description
        </h3>

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Optional description..."
          rows={3}
          className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
        />
      </div>
    </>
  );
};

export default ImbueEnthalpy;
