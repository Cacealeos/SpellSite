"use client";

import { useEffect, useState } from "react";
import { CubeTransparentIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": false,
  "Soul Cast": true,
  "Full Cast ": true,
  "Counter Spell": true,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": false,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Aura Surge": false,
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
// Component
// ==================================================

const ImbueIntangibility = ({
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

  const [fullCast, setFullCast] = useState(false);

  const [counterSpell, setCounterSpell] = useState(false);

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

  const finalCost = baseCost;

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
      setFullCast(false);
      setCounterSpell(false);
    }
  }, [active]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <CubeTransparentIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Imbue Intangibility
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
            {/* Full Cast */}
            <button
              type="button"
              onClick={() => setFullCast((previous) => !previous)}
              aria-pressed={fullCast}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                fullCast
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white"
              }`}
            >
              Full Cast
            </button>

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
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Captions */}
        {/* ================================================== */}

        {(fullCast || counterSpell) && (
          <div className="mb-5 space-y-3">
            {/* Full Cast Caption */}
            {fullCast && (
              <div className="rounded-lg border border-indigo-700 bg-indigo-950/30 p-4 text-sm text-indigo-200">
                <h4 className="mb-3 font-semibold text-indigo-300">
                  Full Cast
                </h4>
                <p>
                  Grants targets an additional <strong>INTERACT ACTION</strong>{" "}
                  or <strong>DEFENSIVE ACTION</strong>.
                </p>
                <div className="mt-4 space-y-3 rounded-md border border-indigo-800 bg-gray-900 p-4">
                  <div className="flex justify-between gap-4">
                    <span>Additional Actions</span>
                    <span className="font-bold text-indigo-300">+1</span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-indigo-800 pt-3">
                    <div className="rounded-md border border-indigo-800 p-3 text-center font-semibold">
                      INTERACT ACTION
                    </div>
                    <span className="text-xs font-bold text-gray-500">OR</span>
                    <div className="rounded-md border border-indigo-800 p-3 text-center font-semibold">
                      DEFENSIVE ACTION
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs italic">
                  The action type is determined during casting.
                </p>
              </div>
            )}

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

          {/* Full Cast Properties */}
          {fullCast && (
            <>
              <div className="flex justify-between gap-4">
                <span>Additional Target Actions</span>
                <span className="font-semibold text-indigo-400">+1</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Available Action Types</span>
                <span className="text-right font-semibold text-indigo-400">
                  INTERACT / DEFENSIVE
                </span>
              </div>
            </>
          )}

          {counterSpell && (
            <div className="flex justify-between gap-4">
              <span>Additional Casting Action</span>
              <span className="font-semibold text-purple-400">DEFENSIVE</span>
            </div>
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
              {finalCost} Manna
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

export default ImbueIntangibility;
