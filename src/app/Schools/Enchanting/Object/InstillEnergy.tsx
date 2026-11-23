import { useEffect, useState } from "react";
import { BoltIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": false,
  "Spell Reflex": false,
  "Double Cast": false,
  "Double Pulse": false,
  "Soul Cast": true,
  "Full Cast": true,
  "Counter Spell": false,
  "Spell Surge": true,
  "Junction Cast": false,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": false,
  "Auto Cast": false,
  "Rivet Cast": false,
  "Spell Recovery": true,
  "Aura Surge": false,
};

// ==================================================
// Mastery Data
// ==================================================

const masteryRates: Record<MasteryType, number> = {
  NOVICE: 5,
  INTERMEDIATE: 3,
  MASTERED: 2,
};

// ==================================================
// Constants
// ==================================================

const MAX_TTT = 50;
const SOUL_CAST_COST = 50;

// ==================================================
// Component
// ==================================================

const InstillEnergy = ({
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

  const [baseValue, setBaseValue] = useState(0);

  const [spellRecovery, setSpellRecovery] = useState(false);
  const [spellSurge, setSpellSurge] = useState(false);
  const [soulCast, setSoulCast] = useState(false);
  const [fullCast, setFullCast] = useState(false);

  const [existingEnchantments, setExistingEnchantments] = useState(0);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const rate = masteryRates[mastery] ?? 0;

  // ==================================================
  // Energy Calculations
  // ==================================================

  const investedTTT = Math.min(Math.max(0, baseValue), MAX_TTT);

  const energy = investedTTT * rate;

  const finalTTT = investedTTT;

  // ==================================================
  // Spell Surge Calculations
  // ==================================================

  const surgeEligible = spellSurge && existingEnchantments >= 2;

  const aoeIncrease = surgeEligible ? 1 : 0;

  // Soul Cast consumes Soul independently of the TTT investment.
  const soulCost = soulCast ? SOUL_CAST_COST : 0;

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalTTT, updateSpell]);

  // ==================================================
  // Reset When Inactive
  // ==================================================

  useEffect(() => {
    if (!active) {
      setBaseValue(0);
      setSpellRecovery(false);
      setSpellSurge(false);
      setSoulCast(false);
      setFullCast(false);
      setExistingEnchantments(0);
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const changeTTT = (value: number) => {
    setBaseValue(Math.min(MAX_TTT, Math.max(0, Math.trunc(value || 0))));
  };

  const changeExistingEnchantments = (value: number) => {
    setExistingEnchantments(Math.max(0, Math.trunc(value || 0)));
  };

  const techniqueButtonClass = (enabled: boolean) =>
    `rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
      enabled
        ? "bg-purple-600 text-white"
        : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
    }`;

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <BoltIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Instill Energy</h1>
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
            {/* Spell Recovery */}

            <button
              type="button"
              onClick={() => setSpellRecovery((previous) => !previous)}
              aria-pressed={spellRecovery}
              className={techniqueButtonClass(spellRecovery)}
            >
              Spell Recovery
            </button>

            {/* Spell Surge */}

            <button
              type="button"
              onClick={() => setSpellSurge((previous) => !previous)}
              aria-pressed={spellSurge}
              className={techniqueButtonClass(spellSurge)}
            >
              Spell Surge
            </button>

            {/* Soul Cast */}

            <button
              type="button"
              onClick={() => setSoulCast((previous) => !previous)}
              aria-pressed={soulCast}
              className={techniqueButtonClass(soulCast)}
            >
              Soul Cast
            </button>
            {/* Full Cast */}

            <button
              type="button"
              onClick={() => setFullCast((previous) => !previous)}
              aria-pressed={fullCast}
              className={techniqueButtonClass(fullCast)}
            >
              Full Cast
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Descriptions */}
        {/* ================================================== */}

        {(spellRecovery || spellSurge || soulCast || fullCast) && (
          <div className="mb-5 space-y-3">
            {/* Spell Recovery */}

            {spellRecovery && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Recovery:</strong>{" "}
                  Automatically reapplies the Instill Energy enchantment when
                  the target enters the caster's vicinity.
                </p>
              </div>
            )}

            {/* Soul Cast */}

            {soulCast && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Soul Cast:</strong> At the
                  cost of <strong className="text-purple-300">50 Soul</strong>,
                  a temporary consciousness of the caster can be left inside the
                  target.
                </p>
              </div>
            )}

            {/* Spell Surge */}

            {spellSurge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Surge:</strong>{" "}
                  Increases the enchantment's AOE level by one when the initial
                  recipient already has{" "}
                  <strong className="text-purple-300">
                    two or more active enchantments
                  </strong>{" "}
                  from the caster. Reapply the same enchantment using a Main
                  Action, or automatically through{" "}
                  <strong className="text-purple-300">Spell Recovery</strong>.
                </p>
              </div>
            )}

            {/* Full Cast */}

            {fullCast && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Full Cast:</strong>{" "}
                  <strong className="text-purple-300">Once per turn</strong>,
                  targets receive an additional{" "}
                  <strong className="text-purple-300">DEFENSIVE ACTION</strong>{" "}
                  when an enchantment is{" "}
                  <strong className="text-purple-300">first</strong> cast on
                  them. Using this additional action{" "}
                  <strong className="text-red-400">REMOVES</strong> the
                  enchantment.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Conversion Rate */}

          <div className="flex justify-between gap-3">
            <span>Energy per TTT</span>

            <span className="font-semibold text-cyan-400">{rate}</span>
          </div>

          {/* TTT Investment */}

          <div className="flex justify-between gap-3">
            <span>TTT Investment</span>

            <span className="font-semibold text-cyan-400">{investedTTT}</span>
          </div>

          {/* Maximum TTT */}

          <div className="flex justify-between gap-3">
            <span>Maximum TTT</span>

            <span className="font-semibold text-cyan-400">{MAX_TTT}</span>
          </div>

          {/* Spell Recovery */}

          {spellRecovery && (
            <div className="flex justify-between gap-3">
              <span>Automatic Reapplication</span>

              <span className="font-semibold text-purple-400">ENABLED</span>
            </div>
          )}

          {/* Spell Surge */}

          {spellSurge && (
            <>
              <div className="flex justify-between gap-3">
                <span>Existing Enchantments</span>

                <span className="font-semibold text-cyan-400">
                  {existingEnchantments}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>AOE Level Increase</span>

                <span
                  className={`font-semibold ${
                    surgeEligible ? "text-purple-400" : "text-gray-500"
                  }`}
                >
                  +{aoeIncrease}
                </span>
              </div>
            </>
          )}

          {/* Soul Cast */}

          {soulCast && (
            <>
              <div className="flex justify-between gap-3">
                <span>Soul Cast</span>
                <span className="font-semibold text-purple-400">ENABLED</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Soul Cost</span>
                <span className="font-semibold text-purple-400">
                  {soulCost}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Temporary Consciousness</span>
                <span className="font-semibold text-purple-400">CASTER</span>
              </div>
            </>
          )}

          {/* ================================================== */}
          {/* Full Cast Statistics */}
          {/* ================================================== */}

          {fullCast && (
            <>
              <div className="flex justify-between gap-3">
                <span>Additional Defensive Action</span>

                <span className="font-semibold text-purple-400">
                  +1 (FIRST CAST)
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Frequency</span>

                <span className="font-semibold text-cyan-400">
                  ONCE PER TURN
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>After Using Action</span>

                <span className="font-semibold text-red-400">
                  ENCHANTMENT REMOVED
                </span>
              </div>
            </>
          )}

          {/* Energy Transferred */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">
              Energy Transferred
            </span>

            <span className="text-lg font-bold text-orange-400">{energy}</span>
          </div>

          {/* Final TTT */}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-gray-100">Final TTT</span>

            <span className="text-lg font-bold text-orange-400">
              {finalTTT}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Soul Cast Configuration */}
      {/* ================================================== */}

      {soulCast && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Soul Cast Configuration
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-gray-300">
            At the cost of 50 Soul, a temporary consciousness of the caster can
            be left inside the target.
          </p>
          <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
            <div className="flex justify-between gap-3">
              <span>Soul Cost</span>
              <span className="font-semibold text-purple-400">{soulCost}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Consciousness</span>
              <span className="font-semibold text-cyan-400">TEMPORARY</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Origin</span>
              <span className="font-semibold text-cyan-400">CASTER</span>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* Energy Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Energy Configuration
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-gray-400">
          Transfers or extracts energy from an object. The amount of energy
          transferred per TTT depends on the caster's mastery.
        </p>

        {/* TTT Input */}

        <label className="block">
          <span className="mb-2 block font-semibold text-gray-300">
            TTT Investment
          </span>

          <input
            type="number"
            min={0}
            max={MAX_TTT}
            step={1}
            value={investedTTT}
            onChange={(e) => changeTTT(Number(e.target.value))}
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />
        </label>

        {/* Energy Summary */}

        <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between text-gray-300">
            <span>Energy per TTT</span>

            <span className="font-semibold text-cyan-400">{rate}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Invested TTT</span>

            <span className="font-semibold text-cyan-400">{investedTTT}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3 text-gray-300">
            <span className="font-semibold text-gray-100">
              Energy Transferred
            </span>

            <span className="text-lg font-bold text-orange-400">{energy}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Full Cast Configuration */}
      {/* ================================================== */}

      {fullCast && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Full Cast Configuration
          </h3>

          <p className="mb-4 text-sm leading-relaxed text-gray-300">
            Once per turn, targets receive an additional Defensive Action when
            an enchantment is first cast on them. Using this additional action
            removes the enchantment.
          </p>

          <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
            <div className="flex justify-between gap-3">
              <span>Additional Defensive Actions</span>

              <span className="font-semibold text-purple-400">+1</span>
            </div>

            <div className="flex justify-between gap-3">
              <span>Activation</span>

              <span className="font-semibold text-cyan-400">FIRST CAST</span>
            </div>

            <div className="flex justify-between gap-3">
              <span>Frequency</span>

              <span className="font-semibold text-cyan-400">ONCE PER TURN</span>
            </div>

            <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
              <span>After Using Action</span>

              <span className="font-semibold text-red-400">
                ENCHANTMENT REMOVED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* Spell Surge Configuration */}
      {/* ================================================== */}

      {spellSurge && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Spell Surge Configuration
          </h3>

          {/* Existing Enchantments */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Existing Enchantments from Caster
            </span>

            <input
              type="number"
              min={0}
              step={1}
              value={existingEnchantments}
              onChange={(e) =>
                changeExistingEnchantments(Number(e.target.value))
              }
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />
          </label>

          {/* Surge Eligibility */}

          <div
            className={`mt-4 rounded-lg border p-4 ${
              surgeEligible
                ? "border-purple-600 bg-purple-950/30"
                : "border-gray-700 bg-gray-900"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-gray-300">
                Spell Surge Eligibility
              </span>

              <span
                className={`font-semibold ${
                  surgeEligible ? "text-purple-400" : "text-gray-500"
                }`}
              >
                {surgeEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-400">
              {surgeEligible
                ? "The target qualifies for a +1 AOE level increase when Instill Energy is reapplied."
                : "The target requires at least two existing enchantments from the caster."}
            </p>
          </div>

          {/* Reapplication Method */}

          <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <h4 className="mb-2 font-semibold text-gray-300">
              Reapplication Method
            </h4>

            <p className="text-sm leading-relaxed text-gray-400">
              {spellRecovery
                ? "Instill Energy can be reapplied automatically when the target enters the caster's vicinity, or manually using a Main Action."
                : "Reapply Instill Energy using a Main Action. Enable Spell Recovery to allow automatic reapplication when the target enters the caster's vicinity."}
            </p>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* Spell Description */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Description
        </h3>

        <p className="text-sm leading-relaxed text-gray-300">
          Transfers or extracts energy from an object. Energy transfer rate
          scales with Mastery.
        </p>
      </div>
    </>
  );
};

export default InstillEnergy;
