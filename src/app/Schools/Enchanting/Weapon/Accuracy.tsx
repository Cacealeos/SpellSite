import { useEffect, useState } from "react";
import { CursorArrowRaysIcon } from "@heroicons/react/24/solid";

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
  "Spell Recovery": true,
  "Father Spell": false,
};

// ==================================================
// Mastery Data
// ==================================================

const masteryRates: Record<MasteryType, number> = {
  NOVICE: 10,
  INTERMEDIATE: 15,
  MASTERED: 20,
};

// ==================================================
// Constants
// ==================================================

const MAX_ACCURACY = 200;
const CHARGE_MULTIPLIER = 0.3;

// ==================================================
// Component
// ==================================================

const Accuracy = ({
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

  const [spellCharge, setSpellCharge] = useState(false);
  const [spellRecovery, setSpellRecovery] = useState(false);
  const [spellSurge, setSpellSurge] = useState(false);

  const [chargeTurns, setChargeTurns] = useState(0);
  const [doubleCast, setDoubleCast] = useState(false);
  const [existingEnchantments, setExistingEnchantments] = useState(0);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const rate = masteryRates[mastery] ?? 0;

  // ==================================================
  // Spell Charge Calculations
  // ==================================================

  const chargeBonus = spellCharge ? chargeTurns * CHARGE_MULTIPLIER : 0;

  const chargePercentage = Math.round(chargeBonus * 100);

  const strengthMultiplier = 1 + chargeBonus;

  // ==================================================
  // Accuracy Calculations
  // ==================================================

  const accuracyPerTTT = rate * strengthMultiplier;

  // Maximum investment needed to reach the
  // 200 Accuracy cap.
  const maxInvestment =
    accuracyPerTTT > 0 ? Math.ceil(MAX_ACCURACY / accuracyPerTTT) : 0;

  const investedTTT = Math.min(baseValue, maxInvestment);

  const baseAccuracy = investedTTT * rate;

  const accuracy = Math.min(baseAccuracy * strengthMultiplier, MAX_ACCURACY);

  // Spell Charge increases TTT by 30% per
  // complete charging turn.
  const finalTTT = Math.ceil(investedTTT * strengthMultiplier);

  // ==================================================
  // Spell Surge Calculations
  // ==================================================

  const surgeEligible = spellSurge && existingEnchantments >= 2;

  const aoeIncrease = surgeEligible ? 1 : 0;

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalTTT, updateSpell]);

  // ==================================================
  // Reset
  // ==================================================

  useEffect(() => {
    if (!active) {
      setBaseValue(0);

      setSpellCharge(false);
      setSpellRecovery(false);
      setSpellSurge(false);

      setChargeTurns(0);
      setDoubleCast(false);
      setExistingEnchantments(0);
    }
  }, [active]);

  // ==================================================
  // Clamp Investment
  // ==================================================

  useEffect(() => {
    if (baseValue > maxInvestment) {
      setBaseValue(maxInvestment);
    }
  }, [baseValue, maxInvestment]);

  // ==================================================
  // Handlers
  // ==================================================

  const changeTTT = (value: number) => {
    const normalized = Math.max(0, Math.trunc(value || 0));

    setBaseValue(Math.min(normalized, maxInvestment));
  };

  const toggleSpellCharge = () => {
    if (spellCharge) {
      setSpellCharge(false);
      setChargeTurns(0);
      setDoubleCast(false);
    } else {
      setSpellCharge(true);
    }
  };

  const changeChargeTurns = (value: number) => {
    setChargeTurns(Math.max(0, Math.trunc(value || 0)));
  };

  const changeExistingEnchantments = (value: number) => {
    setExistingEnchantments(Math.max(0, Math.trunc(value || 0)));
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
        <CursorArrowRaysIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Accuracy</h1>
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
            {/* Spell Charge */}

            <button
              type="button"
              onClick={toggleSpellCharge}
              aria-pressed={spellCharge}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                spellCharge
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Spell Charge
            </button>

            {/* Spell Recovery */}

            <button
              type="button"
              onClick={() => setSpellRecovery((previous) => !previous)}
              aria-pressed={spellRecovery}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                spellRecovery
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Spell Recovery
            </button>

            {/* Spell Surge */}

            <button
              type="button"
              onClick={() => setSpellSurge((previous) => !previous)}
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
        {/* Technique Descriptions */}
        {/* ================================================== */}

        {(spellCharge || spellRecovery || spellSurge) && (
          <div className="mb-5 space-y-3">
            {/* Spell Charge */}

            {spellCharge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Charge:</strong>{" "}
                  Increases Accuracy strength by{" "}
                  <strong className="text-purple-300">
                    30% per complete turn
                  </strong>{" "}
                  of additional charging. TTT cost also increases by 30% per
                  charge. Other spells cannot be cast while charging unless{" "}
                  <strong className="text-purple-300">Double Cast</strong> is
                  used.
                </p>
              </div>
            )}

            {/* Spell Recovery */}

            {spellRecovery && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Recovery:</strong>{" "}
                  Automatically reapplies the Accuracy enchantment when the
                  target enters the caster's vicinity.
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
                  from the caster. Reapply using a Main Action or automatically
                  through{" "}
                  <strong className="text-purple-300">Spell Recovery</strong>.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Mastery */}

          <div className="flex justify-between">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          {/* Conversion Rate */}

          <div className="flex justify-between">
            <span>Base Accuracy per TTT</span>

            <span className="font-semibold text-cyan-400">{rate}</span>
          </div>

          {/* Maximum Accuracy */}

          <div className="flex justify-between">
            <span>Maximum Accuracy</span>

            <span className="font-semibold text-cyan-400">{MAX_ACCURACY}</span>
          </div>

          {/* Base Investment */}

          <div className="flex justify-between">
            <span>Base TTT Investment</span>

            <span className="font-semibold text-cyan-400">{investedTTT}</span>
          </div>

          {/* Charge Statistics */}

          {spellCharge && (
            <>
              <div className="flex justify-between">
                <span>Charge Turns</span>

                <span className="font-semibold text-cyan-400">
                  {chargeTurns}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Charge Increase</span>

                <span className="font-semibold text-purple-400">
                  +{chargePercentage}%
                </span>
              </div>

              <div className="flex justify-between">
                <span>Strength Multiplier</span>

                <span className="font-semibold text-purple-400">
                  {Number(strengthMultiplier.toFixed(2))}×
                </span>
              </div>
            </>
          )}

          {/* Spell Recovery */}

          {spellRecovery && (
            <div className="flex justify-between">
              <span>Automatic Reapplication</span>

              <span className="font-semibold text-purple-400">ENABLED</span>
            </div>
          )}

          {/* Spell Surge */}

          {spellSurge && (
            <>
              <div className="flex justify-between">
                <span>Existing Enchantments</span>

                <span className="font-semibold text-cyan-400">
                  {existingEnchantments}
                </span>
              </div>

              <div className="flex justify-between">
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

          {/* Final Accuracy */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Accuracy Bonus</span>

            <span className="text-lg font-bold text-orange-400">
              {Number(accuracy.toFixed(2))}
            </span>
          </div>

          {/* Final TTT */}

          <div className="flex justify-between">
            <span className="font-semibold text-gray-100">Final TTT</span>

            <span className="text-lg font-bold text-orange-400">
              {finalTTT}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Accuracy Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Accuracy Configuration
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-gray-400">
          Each point of TTT grants{" "}
          <span className="font-semibold text-cyan-400">{rate}</span> temporary
          Accuracy before Spell Charge modifiers. The maximum bonus is{" "}
          <span className="font-semibold text-cyan-400">{MAX_ACCURACY}</span>.
        </p>

        {/* TTT Input */}

        <label className="block">
          <span className="mb-2 block font-semibold text-gray-300">
            Base TTT Investment
          </span>

          <input
            type="number"
            min={0}
            max={maxInvestment}
            step={1}
            value={investedTTT}
            onChange={(e) => changeTTT(Number(e.target.value))}
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />
        </label>

        {/* Investment Summary */}

        <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between text-gray-300">
            <span>Base Accuracy</span>

            <span className="font-semibold text-cyan-400">{baseAccuracy}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Final Accuracy</span>

            <span className="font-semibold text-cyan-400">
              {Number(accuracy.toFixed(2))}
            </span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Maximum Investment</span>

            <span className="font-semibold text-cyan-400">{maxInvestment}</span>
          </div>
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

          {/* Charge Turns */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Complete Turns of Charge
            </span>

            <input
              type="number"
              min={0}
              step={1}
              value={chargeTurns}
              onChange={(e) => changeChargeTurns(Number(e.target.value))}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />
          </label>

          {/* Double Cast */}

          <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-900 p-3">
            <div>
              <span className="block font-semibold text-gray-300">
                Double Cast
              </span>

              <p className="mt-1 text-sm text-gray-500">
                Allows other spells to be cast while charging Accuracy.
              </p>
            </div>

            <input
              type="checkbox"
              checked={doubleCast}
              onChange={(e) => setDoubleCast(e.target.checked)}
              className="h-4 w-4 accent-purple-500"
            />
          </label>

          {/* Charge Summary */}

          <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="flex justify-between text-gray-300">
              <span>Strength Increase</span>

              <span className="font-semibold text-purple-400">
                +{chargePercentage}%
              </span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>TTT Increase</span>

              <span className="font-semibold text-purple-400">
                +{chargePercentage}%
              </span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>Final TTT</span>

              <span className="font-semibold text-cyan-400">{finalTTT}</span>
            </div>
          </div>

          {/* Casting Restriction */}

          {!doubleCast && chargeTurns > 0 && (
            <p className="mt-4 rounded-lg border border-amber-800 bg-amber-950/30 p-3 text-sm text-amber-300">
              Other spells cannot be cast while charging unless Double Cast is
              used.
            </p>
          )}
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
                ? "The target qualifies for a +1 AOE level increase when Accuracy is reapplied."
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
                ? "Accuracy can be reapplied automatically when the target enters the caster's vicinity, or manually using a Main Action."
                : "Reapply Accuracy using a Main Action. Enable Spell Recovery to allow automatic reapplication when the target enters the caster's vicinity."}
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
          Converts Manna into temporary Accuracy at the current mastery rate.
          Maximum Accuracy is 200.
        </p>
      </div>
    </>
  );
};

export default Accuracy;
