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
  NOVICE: { rate: 3 },
  INTERMEDIATE: { rate: 5 },
  MASTERED: { rate: 10 },
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
  // STATE
  // ==================================================

  const [mannaCost, setMannaCost] = useState(0);

  const [hyperSpell, setHyperSpell] = useState(false);
  const [fullCast, setFullCast] = useState(false);

  // ==================================================
  // DERIVED VALUES
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const { rate } = masteryData[mastery];

  // Hyper Spell increases the recovery rate by 30%.
  const recoveryMultiplier = hyperSpell ? 1.3 : 1;

  // Base pain recovery is determined by Manna invested.
  const baseRecovery = Math.floor(mannaCost * rate);

  // Hyper Spell increases recovery efficiency by 30%.
  const painTolerance = Math.floor(baseRecovery * recoveryMultiplier);

  // Hyper Spell reduces Manna cost by 75%.
  const effectiveMannaCost = hyperSpell
    ? Math.ceil(mannaCost * 0.25)
    : mannaCost;

  // ==================================================
  // SPELL UPDATES
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", effectiveMannaCost);
  }, [active, effectiveMannaCost, updateSpell]);

  // ==================================================
  // RESET
  // ==================================================

  useEffect(() => {
    if (!active) {
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
      {/* PAIN RECOVERY STATISTICS */}
      {/* ================================================== */}

      <section className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        {/* ================================================== */}
        {/* HEADER & TECHNIQUE BUTTONS */}
        {/* ================================================== */}

        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-orange-400">
            Pain Recovery Statistics
          </h3>

          <div className="flex flex-wrap justify-end gap-2">
            {/* ================================================== */}
            {/* HYPER SPELL */}
            {/* ================================================== */}

            <button
              type="button"
              onClick={() => setHyperSpell((prev) => !prev)}
              aria-pressed={hyperSpell}
              className={`rounded-md border px-3 py-1 text-xs font-medium transition ${
                hyperSpell
                  ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-400"
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
              className={`rounded-md border px-3 py-1 text-xs font-medium transition ${
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

        {(hyperSpell || fullCast) && (
          <div className="mt-4 space-y-3">
            {hyperSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-300">Hyper Spell:</strong>{" "}
                  Reduces Cost by{" "}
                  <span className="font-semibold text-purple-300">75%</span> and
                  increases Recovery Rate by{" "}
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
        {/* DERIVED STATISTICS */}
        {/* ================================================== */}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
      {/* MANNA INVESTMENT */}
      {/* ================================================== */}

      <section className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Manna Investment
        </h3>

        <label
          htmlFor="pain-healing-manna"
          className="block text-sm font-medium text-gray-300"
        >
          Manna
        </label>

        <input
          id="pain-healing-manna"
          type="number"
          min="0"
          step="1"
          value={mannaCost}
          onChange={(e) =>
            setMannaCost(Math.max(0, Number(e.target.value) || 0))
          }
          className="mt-2 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-cyan-400 outline-none focus:border-orange-500"
        />

        <p className="mt-2 text-sm text-gray-400">Alleviates building pain.</p>
      </section>
    </>
  );
}
