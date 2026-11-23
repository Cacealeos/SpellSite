"use client";

import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// TYPES
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

// ==================================================
// STATIC DATA
// ==================================================

const masteryData: Record<MasteryType, { rate: number }> = {
  NOVICE: {
    rate: 2,
  },
  INTERMEDIATE: {
    rate: 1.5,
  },
  MASTERED: {
    rate: 0.5,
  },
};

// ==================================================
// SPELL TECHNIQUES
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": false,
  "Soul Cast": false,
  "Full Cast": true,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Aura Surge": false,
};

// ==================================================
// COMPONENT
// ==================================================

export default function FortifyPT({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) {
  // ==================================================
  // STATE
  // ==================================================

  const [painTolerance, setPainTolerance] = useState(0);

  const [spellReflex, setSpellReflex] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);
  const [fullCast, setFullCast] = useState(false);

  // ==================================================
  // DERIVED VALUES
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const { rate } = masteryData[mastery];

  const effectiveRate = hyperSpell ? rate * 1.3 : rate;

  const baseCost = Math.ceil(painTolerance / effectiveRate);

  const cost = hyperSpell ? Math.ceil(baseCost * 0.25) : baseCost;

  // ==================================================
  // SPELL UPDATES
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  // ==================================================
  // RESET
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSpellReflex(false);
      setHyperSpell(false);
      setFullCast(false);
    }
  }, [active]);

  // ==================================================
  // RENDER
  // ==================================================

  if (!active) return null;

  return (
    <>
      {/* ================================================== */}
      {/* SPELL TECHNIQUES */}
      {/* ================================================== */}

      <SpellTechniquesTable techniques={Techniques} />

      {/* ================================================== */}
      {/* FORTIFICATION STATISTICS */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        {/* ================================================== */}
        {/* HEADER & TECHNIQUE BUTTONS */}
        {/* ================================================== */}

        <div className="mb-3 flex items-center justify-between gap-3 border-b border-gray-700 pb-2">
          <h3 className="text-lg font-semibold text-orange-400">
            Fortification Statistics
          </h3>

          <div className="flex flex-wrap justify-end gap-2">
            {/* ================================================== */}
            {/* SPELL REFLEX */}
            {/* ================================================== */}

            <button
              type="button"
              onClick={() => setSpellReflex((prev) => !prev)}
              aria-pressed={spellReflex}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                spellReflex
                  ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-cyan-500 hover:text-cyan-300"
              }`}
            >
              Spell Reflex
            </button>

            {/* ================================================== */}
            {/* HYPER SPELL */}
            {/* ================================================== */}

            <button
              type="button"
              onClick={() => setHyperSpell((prev) => !prev)}
              aria-pressed={hyperSpell}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                hyperSpell
                  ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-500 hover:text-purple-300"
              }`}
            >
              Hyper Spell
            </button>

            {/* ================================================== */}
            {/* FULL CAST */}
            {/* ================================================== */}

            <button
              type="button"
              onClick={() => setFullCast((prev) => !prev)}
              aria-pressed={fullCast}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                fullCast
                  ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-400"
              }`}
            >
              Full Cast
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* TECHNIQUE DESCRIPTIONS */}
        {/* ================================================== */}

        {(spellReflex || hyperSpell || fullCast) && (
          <div className="mb-4 space-y-3">
            {spellReflex && (
              <div className="rounded-lg border border-cyan-800 bg-cyan-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-cyan-300">Spell Reflex:</strong>{" "}
                  Allows use of Restoration Spells with durations without a main
                  action.
                </p>
              </div>
            )}

            {hyperSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-300">Hyper Spell:</strong>{" "}
                  Reduces Cost by{" "}
                  <span className="font-semibold text-purple-300">75%</span> and
                  increases Fortification Rate by{" "}
                  <span className="font-semibold text-purple-300">30%</span>.
                </p>
              </div>
            )}

            {fullCast && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-300">Full Cast:</strong> Once
                  per turn, a recipient of two or more Restoration spells is
                  granted one additional{" "}
                  <span className="font-semibold text-cyan-400">
                    INTERACT ACTION
                  </span>{" "}
                  or{" "}
                  <span className="font-semibold text-cyan-400">
                    DEFENSIVE ACTION
                  </span>
                  .
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* FORTIFICATION STATISTICS */}
        {/* ================================================== */}

        <div className="space-y-3">
          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Pain Tolerance</span>

            <span className="font-semibold text-cyan-400">
              +{painTolerance}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Fortification Rate</span>

            <span className="font-semibold text-cyan-400">
              {rate} Tolerance / Cost
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Cost</span>

            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* PAIN TOLERANCE INVESTMENT */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Pain Tolerance Investment
        </h3>

        <input
          type="number"
          min="0"
          step="1"
          value={painTolerance}
          onChange={(e) =>
            setPainTolerance(Math.max(0, Number(e.target.value) || 0))
          }
          className="mt-2 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-cyan-400 outline-none focus:border-orange-500"
        />

        <p className="mt-2 text-sm text-gray-400">
          Give bonus temporary pain tolerance, up to 100% extra of current
          maximum.
        </p>
      </div>
    </>
  );
}
