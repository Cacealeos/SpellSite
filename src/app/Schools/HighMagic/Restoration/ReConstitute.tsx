"use client";

import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// TYPES
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type CatalystType = "MENTAL ENERGY" | "BODY ENERGY" | "MEMORY" | "SPIRIT";

// ==================================================
// STATIC DATA
// ==================================================

const masteryData: Record<MasteryType, { costPerLimb: number }> = {
  NOVICE: { costPerLimb: 15 },
  INTERMEDIATE: { costPerLimb: 10 },
  MASTERED: { costPerLimb: 5 },
};

// ==================================================
// SPELL TECHNIQUES
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Soul Cast": false,
  "Full Cast": true,
  "Counter Spell": true,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Aura Surge": true,
};

// ==================================================
// AURA SURGE DATA
// ==================================================

const auraSurgeEffects: Record<CatalystType, string> = {
  "MENTAL ENERGY": "Phase Step and Phase Jump cost no Defensive Actions.",
  "BODY ENERGY": "Reflect and Absorb cost no Defensive Actions.",
  MEMORY: "Cover and Defend cost no Defensive Actions.",
  SPIRIT: "+1 to non-curse RES saves.",
};

const catalystOptions: CatalystType[] = [
  "MENTAL ENERGY",
  "BODY ENERGY",
  "MEMORY",
  "SPIRIT",
];

// ==================================================
// COMPONENT
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
  // STATE
  // ==================================================

  const [limbs, setLimbs] = useState(1);

  const [fullCast, setFullCast] = useState(false);
  const [counterSpell, setCounterSpell] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);

  const [catalyst, setCatalyst] = useState<CatalystType>("MENTAL ENERGY");

  // ==================================================
  // DERIVED VALUES
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const { costPerLimb } = masteryData[mastery];

  const cost = limbs * costPerLimb;

  const auraSurgeEffect = auraSurge ? auraSurgeEffects[catalyst] : null;

  // ==================================================
  // SPELL UPDATES
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? cost : 0);
  }, [active, cost, updateSpell]);

  // ==================================================
  // RESET
  // ==================================================

  useEffect(() => {
    if (!active) {
      setFullCast(false);
      setCounterSpell(false);
      setHyperSpell(false);
      setAuraSurge(false);
      setCatalyst("MENTAL ENERGY");
    }
  }, [active]);

  // ==================================================
  // TECHNIQUE BUTTON STYLES
  // ==================================================

  const purpleButtonClass = (enabled: boolean) =>
    `rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
      enabled
        ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
        : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-400 hover:text-purple-300"
    }`;

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
      {/* RE-CONSTITUTION STATISTICS */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        {/* HEADER & TECHNIQUE BUTTONS */}

        <div className="mb-4 flex items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Re-Constitution Statistics
          </h3>

          <div className="flex flex-wrap justify-end gap-2">
            {/* FULL CAST */}

            <button
              type="button"
              onClick={() => setFullCast((prev) => !prev)}
              aria-pressed={fullCast}
              className={purpleButtonClass(fullCast)}
            >
              Full Cast
            </button>

            {/* COUNTER SPELL */}

            <button
              type="button"
              onClick={() => setCounterSpell((prev) => !prev)}
              aria-pressed={counterSpell}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                counterSpell
                  ? "border-red-400 bg-red-500/10 text-red-300 shadow-[0_0_12px_rgba(248,113,113,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-red-400 hover:text-red-300"
              }`}
            >
              Counter Spell
            </button>

            {/* HYPER SPELL */}

            <button
              type="button"
              onClick={() => setHyperSpell((prev) => !prev)}
              aria-pressed={hyperSpell}
              className={purpleButtonClass(hyperSpell)}
            >
              Hyper Spell
            </button>

            {/* AURA SURGE */}

            <button
              type="button"
              onClick={() => setAuraSurge((prev) => !prev)}
              aria-pressed={auraSurge}
              className={purpleButtonClass(auraSurge)}
            >
              Aura Surge
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* TECHNIQUE DESCRIPTIONS */}
        {/* ================================================== */}

        {(fullCast || counterSpell || hyperSpell || auraSurge) && (
          <div className="mb-5 space-y-3">
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

            {counterSpell && (
              <div className="rounded-lg border border-red-800 bg-red-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-red-300">Counter Spell:</strong>{" "}
                  Allows for the interruption of the Sealing process as a{" "}
                  <span className="font-semibold text-red-300">
                    DEFENSIVE ACTION
                  </span>
                  .
                </p>
              </div>
            )}

            {hyperSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-300">Hyper Spell:</strong>{" "}
                  Reduces Cost by 75% and increases Recovery Rate by 30%.
                </p>
              </div>
            )}

            {auraSurge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-300">Aura Surge:</strong> While
                  channeling a catalyst, allies within the AOE of Gate, Flash,
                  and Synchronize receive the corresponding catalyst effect.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* STATISTICS */}
        {/* ================================================== */}

        <div className="space-y-3">
          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Limbs Reconstructed</span>

            <span className="font-semibold text-cyan-400">{limbs}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Cost per Limb</span>

            <span className="font-semibold text-cyan-400">{costPerLimb}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Cost</span>

            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* AURA SURGE CONFIGURATION */}
      {/* ================================================== */}

      {auraSurge && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Aura Surge Configuration
          </h3>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-300">
              Channeled Catalyst
            </span>

            <select
              value={catalyst}
              onChange={(e) => setCatalyst(e.target.value as CatalystType)}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            >
              {catalystOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4 rounded-lg border border-purple-800 bg-purple-950/30 p-4">
            <p className="mb-2 text-sm font-semibold text-purple-400">
              Active Catalyst Effect
            </p>

            <p className="text-sm leading-relaxed text-gray-300">
              {auraSurgeEffect}
            </p>
          </div>

          <div className="mt-4 space-y-3 text-sm text-gray-300">
            {catalystOptions.map((option) => (
              <div
                key={option}
                className={`rounded-lg border p-3 ${
                  catalyst === option
                    ? "border-purple-600 bg-gray-900"
                    : "border-gray-700 bg-gray-900/50"
                }`}
              >
                <p className="font-semibold text-cyan-400">{option}</p>

                <p className="mt-1 text-gray-400">{auraSurgeEffects[option]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* LIMB RECONSTRUCTION */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Limb Reconstruction
        </h3>

        <label
          htmlFor="reconstitute-limbs"
          className="block text-sm font-medium text-gray-300"
        >
          Number of Limbs
        </label>

        <input
          id="reconstitute-limbs"
          type="number"
          min="1"
          max="5"
          step="1"
          value={limbs}
          onChange={(e) =>
            setLimbs(
              Math.min(5, Math.max(1, Math.floor(Number(e.target.value) || 1))),
            )
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
