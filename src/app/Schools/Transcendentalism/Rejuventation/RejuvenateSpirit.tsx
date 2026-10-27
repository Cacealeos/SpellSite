import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type RejuvenateSpiritProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

// ==================================================
// Mastery Rates
// ==================================================

const masteryRates: Record<MasteryType, number> = {
  NOVICE: 6,
  INTERMEDIATE: 4,
  MASTERED: 2,
};

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": false,
  "Spell Reflex": false,
  "Double Cast": false,
  "Double Pulse": false,
  "Carry Spell": false,
  "Spell Shift": false,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": false,
  "Spell Charge": true,
  "Focus Spell": false,
  "Hyper Spell": false,
  "Auto Cast": true,
  "Rivet Cast": false,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Helpers
// ==================================================

const normalizeInteger = (value: number) =>
  Math.max(0, Math.trunc(Number.isFinite(value) ? value : 0));

// ==================================================
// Component
// ==================================================

export default function RejuvenateSpirit({
  ParentMastery,
  active,
  updateSpell,
}: RejuvenateSpiritProps) {
  // ==================================================
  // State
  // ==================================================

  const [spirit, setSpirit] = useState(0);

  const [autoCast, setAutoCast] = useState(false);

  const [spellCharge, setSpellCharge] = useState(false);

  const [chargeTurns, setChargeTurns] = useState(0);

  // ==================================================
  // Mastery Calculations
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const rate = masteryRates[mastery] ?? 0;

  // ==================================================
  // Cost Calculations
  // ==================================================

  const finalCost = spirit * rate;

  // ==================================================
  // Spell Charge Calculations
  // ==================================================

  const effectiveChargeTurns = spellCharge ? chargeTurns : 0;

  const aoe =
    effectiveChargeTurns >= 3
      ? "Moderate"
      : effectiveChargeTurns >= 1
        ? "Small"
        : "None";

  // ==================================================
  // Spell Effects
  // ==================================================

  const castingAction = autoCast ? "Actionless" : "Normal Casting";

  const finalTTT = effectiveChargeTurns;

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalCost, finalTTT, updateSpell]);

  // ==================================================
  // Reset When Inactive
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSpirit(0);
      setAutoCast(false);
      setSpellCharge(false);
      setChargeTurns(0);
    }
  }, [active]);

  // ==================================================
  // Technique Button Styling
  // ==================================================

  const techniqueButtonClass = (enabled: boolean) =>
    `rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
      enabled
        ? "border-purple-400 bg-purple-700 text-white shadow-md shadow-purple-900/30"
        : "border-gray-600 bg-gray-900 text-gray-300 hover:border-purple-500 hover:text-purple-300"
    }`;

  // ==================================================
  // Render
  // ==================================================

  if (!active) return null;

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <SparklesIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Rejuvenate Spirit</h1>
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
        {/* Header and Technique Buttons */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-pressed={autoCast}
              onClick={() => setAutoCast((prev) => !prev)}
              className={techniqueButtonClass(autoCast)}
            >
              Auto Cast
            </button>

            <button
              type="button"
              aria-pressed={spellCharge}
              onClick={() => setSpellCharge((prev) => !prev)}
              className={techniqueButtonClass(spellCharge)}
            >
              Spell Charge
            </button>
          </div>
        </div>

        {/* Technique Descriptions */}

        {autoCast && (
          <div className="mb-4 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <span className="font-semibold">Auto Cast:</span> Rejuvenate Spirit
            becomes actionless.
          </div>
        )}

        {spellCharge && (
          <div className="mb-4 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <span className="font-semibold">Spell Charge:</span> Charging for 1
            turn grants Small AOE. Charging for 3 or more turns grants Moderate
            AOE.
          </div>
        )}

        {/* Properties */}

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between gap-3">
            <span>Restored Spirit</span>

            <span className="font-semibold text-cyan-400">{spirit}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Manna per Spirit</span>

            <span className="font-semibold text-cyan-400">{rate}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Casting Action</span>

            <span className="font-semibold text-cyan-400">{castingAction}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>AOE</span>

            <span className="font-semibold text-cyan-400">{aoe}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>TTT</span>

            <span className="font-semibold text-cyan-400">{finalTTT}</span>
          </div>

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Total Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Spirit Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spirit Configuration
        </h3>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <label
            htmlFor="rejuvenate-spirit-amount"
            className="mb-2 block font-semibold text-gray-200"
          >
            Restore Spirit
          </label>

          <p className="mb-4 text-sm text-gray-400">
            Enter the amount of Spirit to restore. Each point costs {rate} Manna
            at {mastery} Mastery.
          </p>

          <input
            id="rejuvenate-spirit-amount"
            type="number"
            min={0}
            step={1}
            value={spirit}
            onChange={(e) =>
              setSpirit(normalizeInteger(Number(e.target.value)))
            }
            className="w-32 rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-center text-lg text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* Spell Charge Configuration */}
      {/* ================================================== */}

      {spellCharge && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Spell Charge Configuration
          </h3>

          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
            <label
              htmlFor="rejuvenate-spirit-charge"
              className="mb-2 block font-semibold text-gray-200"
            >
              Charge Turns
            </label>

            <p className="mb-4 text-sm text-gray-400">
              Select the number of turns spent charging the spell.
            </p>

            <input
              id="rejuvenate-spirit-charge"
              type="number"
              min={0}
              step={1}
              value={chargeTurns}
              onChange={(e) =>
                setChargeTurns(normalizeInteger(Number(e.target.value)))
              }
              className="w-32 rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-center text-lg text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
            />

            {/* AOE Summary */}

            <div className="mt-4 space-y-3 border-t border-gray-700 pt-4">
              <div className="flex justify-between gap-3 text-gray-300">
                <span>Charge Duration</span>

                <span className="font-semibold text-cyan-400">
                  {chargeTurns} Turns
                </span>
              </div>

              <div className="flex justify-between gap-3 text-gray-300">
                <span>Resulting AOE</span>

                <span className="font-semibold text-cyan-400">{aoe}</span>
              </div>
            </div>
          </div>

          {/* AOE Thresholds */}

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { turns: "0 Turns", area: "None" },
              { turns: "1–2 Turns", area: "Small" },
              { turns: "3+ Turns", area: "Moderate" },
            ].map((option) => {
              const selected = aoe === option.area;

              return (
                <div
                  key={option.area}
                  className={`rounded-lg border p-4 text-center ${
                    selected
                      ? "border-cyan-500 bg-cyan-950/30"
                      : "border-gray-700 bg-gray-900"
                  }`}
                >
                  <p className="mb-2 text-xs font-semibold text-gray-400">
                    {option.turns}
                  </p>

                  <p
                    className={`text-lg font-bold ${
                      selected ? "text-cyan-400" : "text-gray-300"
                    }`}
                  >
                    {option.area}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* Mastery Rates */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Mastery Rates
        </h3>

        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["NOVICE", 6],
              ["INTERMEDIATE", 4],
              ["MASTERED", 2],
            ] as const
          ).map(([level, value]) => (
            <div
              key={level}
              className={`rounded-lg border p-4 text-center ${
                mastery === level
                  ? "border-cyan-500 bg-cyan-950/30"
                  : "border-gray-700 bg-gray-900"
              }`}
            >
              <p className="mb-2 text-xs font-semibold text-gray-400">
                {level}
              </p>

              <p
                className={`text-xl font-bold ${
                  mastery === level ? "text-cyan-400" : "text-gray-300"
                }`}
              >
                {value}
              </p>

              <p className="mt-1 text-xs text-gray-400">Manna / Spirit</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* Cost Breakdown */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Cost Breakdown
        </h3>

        <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between gap-3 text-gray-300">
            <span>Restored Spirit</span>

            <span className="font-semibold text-cyan-400">{spirit}</span>
          </div>

          <div className="flex justify-between gap-3 text-gray-300">
            <span>Cost per Spirit</span>

            <span className="font-semibold text-cyan-400">{rate}</span>
          </div>

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3 text-gray-300">
            <span className="font-semibold text-gray-100">Total Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>

          <p className="border-t border-gray-700 pt-3 text-center text-xs text-gray-400">
            {spirit} × {rate} = {finalCost}
          </p>
        </div>
      </div>

      {/* ================================================== */}
      {/* Data Flags */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Data Flags
        </h3>

        <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
          <div className="flex justify-between gap-3">
            <span>Effect Type</span>

            <span className="font-semibold text-cyan-400">SPIRIT</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>AOE</span>

            <span className="font-semibold text-cyan-400">
              {aoe.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span>TTT</span>

            <span className="font-semibold text-cyan-400">{finalTTT}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Spell Description */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Description
        </h3>

        <div className="space-y-3 text-sm leading-relaxed text-gray-300">
          <p>
            Rejuvenate Spirit restores Spirit. The Manna cost depends on the
            amount restored and the caster&apos;s Mastery.
          </p>

          <p>
            Auto Cast allows the spell to be cast without requiring an action.
          </p>

          <p>
            Spell Charge grants Small AOE after 1 turn of charging and Moderate
            AOE after 3 or more turns.
          </p>
        </div>
      </div>
    </>
  );
}
