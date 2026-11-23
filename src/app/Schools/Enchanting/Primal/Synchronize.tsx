"use client";

import { useEffect, useState } from "react";
import { BoltIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// TYPES
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type CatalystType = "MENTAL ENERGY" | "BODY ENERGY" | "MEMORY" | "SPIRIT";

// ==================================================
// SPELL TECHNIQUES
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": false,
  "Soul Cast": false,
  "Full Cast": false,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": false,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": true,
  "Aura Surge": true,
};

// ==================================================
// TTT DATA
// ==================================================

const masteryTTT: Record<MasteryType, number> = {
  NOVICE: 8,
  INTERMEDIATE: 4,
  MASTERED: 2,
};

// ==================================================
// STAT DATA
// ==================================================

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
// CONSTANTS
// ==================================================

const BASE_AOE = "SMALL";

// ==================================================
// COMPONENT
// ==================================================

const Synchronize = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ==================================================
  // STATE
  // ==================================================

  const [auraSurge, setAuraSurge] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);
  const [spellRecovery, setSpellRecovery] = useState(false);

  const [catalyst, setCatalyst] = useState<CatalystType>("MENTAL ENERGY");

  // ==================================================
  // MASTERY
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  // ==================================================
  // TTT CALCULATIONS
  // ==================================================

  const finalTTT = masteryTTT[mastery];

  // ==================================================
  // AOE CALCULATIONS
  // ==================================================

  const hyperAOEIncrease = hyperSpell ? 1 : 0;

  // ==================================================
  // AURA SURGE CALCULATIONS
  // ==================================================

  const auraSurgeEffect = auraSurge ? auraSurgeEffects[catalyst] : null;

  // ==================================================
  // PARENT SPELL UPDATE
  // ==================================================

  useEffect(() => {
    updateSpell("cost", 0);
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalTTT, updateSpell]);

  // ==================================================
  // RESET
  // ==================================================

  useEffect(() => {
    if (!active) {
      setAuraSurge(false);
      setHyperSpell(false);
      setSpellRecovery(false);
      setCatalyst("MENTAL ENERGY");
    }
  }, [active]);

  // ==================================================
  // HANDLERS
  // ==================================================

  const techniqueButtonClass = (enabled: boolean) =>
    `rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
      enabled
        ? "bg-purple-600 text-white"
        : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
    }`;

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* SPELL TITLE */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <BoltIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Synchronize</h1>
      </div>

      {/* ================================================== */}
      {/* SPELL TECHNIQUES TABLE */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* SPELL PROPERTIES */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        {/* ================================================== */}
        {/* HEADER & TECHNIQUE BUTTONS */}
        {/* ================================================== */}

        <div className="mb-4 flex items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="shrink-0 text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <div className="flex flex-wrap justify-end gap-1">
            <button
              type="button"
              onClick={() => setAuraSurge((prev) => !prev)}
              aria-pressed={auraSurge}
              className={techniqueButtonClass(auraSurge)}
            >
              Aura Surge
            </button>

            <button
              type="button"
              onClick={() => setHyperSpell((prev) => !prev)}
              aria-pressed={hyperSpell}
              className={techniqueButtonClass(hyperSpell)}
            >
              Hyper Spell
            </button>

            <button
              type="button"
              onClick={() => setSpellRecovery((prev) => !prev)}
              aria-pressed={spellRecovery}
              className={techniqueButtonClass(spellRecovery)}
            >
              Spell Recovery
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* TECHNIQUE DESCRIPTIONS */}
        {/* ================================================== */}

        {(auraSurge || hyperSpell || spellRecovery) && (
          <div className="mb-5 space-y-3">
            {auraSurge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Aura Surge:</strong> While
                  channeling a catalyst, allies within the AOE of Gate, Flash,
                  and Synchronize receive the corresponding catalyst effect.
                </p>
              </div>
            )}

            {hyperSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Hyper Spell:</strong>{" "}
                  Increases the AOE level of all AOE effects for Primal Spells.
                </p>
              </div>
            )}

            {spellRecovery && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Recovery:</strong>{" "}
                  Allows automatic reapplying of the enchantment when target(s)
                  come into vicinity of the caster on the following turn.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* SPELL STATISTICS */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between gap-3">
            <span>Area of Effect</span>

            <span className="font-semibold text-cyan-400">{BASE_AOE}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Hyper Spell AOE Increase</span>

            <span className="font-semibold text-purple-400">
              +{hyperAOEIncrease}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Stacking</span>

            <span className="font-semibold text-orange-400">
              Does Not Stack
            </span>
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
      {/* SPELL DESCRIPTION */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Description
        </h3>

        <div className="space-y-3 text-sm leading-relaxed text-gray-300">
          <p>
            Synchronize connects the caster to another ally within Small AOE
            using a Manna-based aura.
          </p>

          <p>
            Whenever the connected ally&apos;s aura has more Power, End, Speed,
            or Flight than the caster, increase the caster&apos;s chosen stat by
            1 while within Small AOE of that connected target.
          </p>

          <p>Synchronize does not stack with additional instances of itself.</p>

          <p>The caster must not be suppressed.</p>
        </div>
      </div>
    </>
  );
};

export default Synchronize;
