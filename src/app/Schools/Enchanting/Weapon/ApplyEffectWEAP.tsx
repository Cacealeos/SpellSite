import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import Select from "@/app/Select";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";
import { appliedWeapons } from "./ApplyEffect";

// ==================================================
// Types
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": true,
  "Double Cast": true,
  "Double Pulse": true,
  "Carry Spell": true,
  "Spell Shift": true,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": false,
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

const masteryRates: Record<
  MasteryType,
  {
    cost: number;
    ttt: number;
  }
> = {
  NOVICE: {
    cost: 0.7,
    ttt: 0.3,
  },
  INTERMEDIATE: {
    cost: 0.5,
    ttt: 0.2,
  },
  MASTERED: {
    cost: 0.3,
    ttt: 0.1,
  },
};

// ==================================================
// Constants
// ==================================================

const MAX_BASE_COST = 300;

// ==================================================
// Component
// ==================================================

const ApplyEffectW = ({
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

  const [selectedWeapon, setSelectedWeapon] = useState(0);
  const [baseCost, setBaseCost] = useState(0);

  const [spellReflex, setSpellReflex] = useState(false);
  const [autoCast, setAutoCast] = useState(false);
  const [counterSpell, setCounterSpell] = useState(false);
  const [spellRecovery, setSpellRecovery] = useState(false);
  const [spellSurge, setSpellSurge] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);

  const [existingEnchantments, setExistingEnchantments] = useState(0);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const rates = masteryRates[mastery];

  // ==================================================
  // Applied Weapon
  // ==================================================

  const selectedEffect = appliedWeapons[selectedWeapon] ?? appliedWeapons[0];

  // ==================================================
  // Cost & TTT Calculations
  // ==================================================

  const cost = Math.ceil(baseCost * rates.cost);

  const ttt = Math.ceil(baseCost * rates.ttt);

  // ==================================================
  // Action Calculations
  // ==================================================

  const defensiveActionAvailable = counterSpell || spellReflex || autoCast;

  const defensiveActionCost = autoCast
    ? 0
    : defensiveActionAvailable
      ? 1
      : null;

  const defensiveUsesPerTurn = spellReflex
    ? 2
    : defensiveActionAvailable
      ? 1
      : 0;

  // ==================================================
  // AOE Calculations
  // ==================================================

  const surgeEligible = spellSurge && existingEnchantments >= 2;

  const hyperAOEIncrease = hyperSpell ? 1 : 0;

  const surgeAOEIncrease = surgeEligible ? 1 : 0;

  const totalAOEIncrease = hyperAOEIncrease + surgeAOEIncrease;

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? cost : 0);
    updateSpell("ttt", active ? ttt : 0);
  }, [active, cost, ttt, updateSpell]);

  // ==================================================
  // Reset
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedWeapon(0);
      setBaseCost(0);

      setSpellReflex(false);
      setAutoCast(false);
      setCounterSpell(false);
      setSpellRecovery(false);
      setSpellSurge(false);
      setHyperSpell(false);

      setExistingEnchantments(0);
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const changeBaseCost = (value: number) => {
    setBaseCost(Math.min(MAX_BASE_COST, Math.max(0, Math.trunc(value || 0))));
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
        <SparklesIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Apply Effect</h1>
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
            {/* Spell Reflex */}

            <button
              type="button"
              onClick={() => setSpellReflex((prev) => !prev)}
              aria-pressed={spellReflex}
              className={techniqueButtonClass(spellReflex)}
            >
              Spell Reflex
            </button>

            {/* Auto Cast */}

            <button
              type="button"
              onClick={() => setAutoCast((prev) => !prev)}
              aria-pressed={autoCast}
              className={techniqueButtonClass(autoCast)}
            >
              Auto Cast
            </button>

            {/* Counter Spell */}

            <button
              type="button"
              onClick={() => setCounterSpell((prev) => !prev)}
              aria-pressed={counterSpell}
              className={techniqueButtonClass(counterSpell)}
            >
              Counter Spell
            </button>

            {/* Spell Recovery */}

            <button
              type="button"
              onClick={() => setSpellRecovery((prev) => !prev)}
              aria-pressed={spellRecovery}
              className={techniqueButtonClass(spellRecovery)}
            >
              Spell Recovery
            </button>

            {/* Spell Surge */}

            <button
              type="button"
              onClick={() => setSpellSurge((prev) => !prev)}
              aria-pressed={spellSurge}
              className={techniqueButtonClass(spellSurge)}
            >
              Spell Surge
            </button>

            {/* Hyper Spell */}

            <button
              type="button"
              onClick={() => setHyperSpell((prev) => !prev)}
              aria-pressed={hyperSpell}
              className={techniqueButtonClass(hyperSpell)}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Descriptions */}
        {/* ================================================== */}

        {(spellReflex ||
          autoCast ||
          counterSpell ||
          spellRecovery ||
          spellSurge ||
          hyperSpell) && (
          <div className="mb-5 space-y-3">
            {/* Spell Reflex */}

            {spellReflex && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Reflex:</strong>{" "}
                  Apply Effects may be used{" "}
                  <strong className="text-purple-300">
                    twice in the same turn
                  </strong>{" "}
                  as a Defensive Action.
                </p>
              </div>
            )}

            {/* Auto Cast */}

            {autoCast && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Auto Cast:</strong> Apply
                  Effects do not cost a{" "}
                  <strong className="text-purple-300">Defensive Action</strong>.
                </p>
              </div>
            )}

            {/* Counter Spell */}

            {counterSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Counter Spell:</strong>{" "}
                  Apply Effect may be cast as a{" "}
                  <strong className="text-purple-300">Defensive Action</strong>.
                </p>
              </div>
            )}

            {/* Spell Recovery */}

            {spellRecovery && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Recovery:</strong>{" "}
                  Automatically reapplies the enchantment when the target enters
                  the caster's vicinity.
                </p>
              </div>
            )}

            {/* Spell Surge */}

            {spellSurge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Surge:</strong>{" "}
                  Increases the target enchantment's AOE level when the initial
                  recipient already has{" "}
                  <strong className="text-purple-300">
                    two or more active enchantments
                  </strong>{" "}
                  from the caster. Reapply the same enchantment using a Main
                  Action, or automatically through Spell Recovery.
                </p>
              </div>
            )}

            {/* Hyper Spell */}

            {hyperSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Hyper Spell:</strong>{" "}
                  Increases the AOE level of Apply Effects.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between gap-3">
            <span>Mastery</span>
            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Applied Weapon Effect</span>
            <span className="text-right font-semibold text-cyan-400">
              {selectedEffect?.label ?? "None"}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Base Applied Spell Cost</span>
            <span className="font-semibold text-cyan-400">{baseCost}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Mana Cost Multiplier</span>
            <span className="font-semibold text-cyan-400">
              {Math.round(rates.cost * 100)}%
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span>TTT Multiplier</span>
            <span className="font-semibold text-cyan-400">
              {Math.round(rates.ttt * 100)}%
            </span>
          </div>

          {(counterSpell || spellReflex || autoCast) && (
            <>
              <div className="flex justify-between gap-3">
                <span>Defensive Casting</span>
                <span className="font-semibold text-purple-400">AVAILABLE</span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Defensive Action Cost</span>
                <span className="font-semibold text-purple-400">
                  {defensiveActionCost}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Defensive Uses per Turn</span>
                <span className="font-semibold text-purple-400">
                  {defensiveUsesPerTurn}
                </span>
              </div>
            </>
          )}

          {spellRecovery && (
            <div className="flex justify-between gap-3">
              <span>Automatic Reapplication</span>
              <span className="font-semibold text-purple-400">ENABLED</span>
            </div>
          )}

          {spellSurge && (
            <div className="flex justify-between gap-3">
              <span>Existing Enchantments</span>
              <span className="font-semibold text-cyan-400">
                {existingEnchantments}
              </span>
            </div>
          )}

          {(hyperSpell || spellSurge) && (
            <>
              <div className="flex justify-between gap-3">
                <span>Hyper Spell AOE Increase</span>
                <span className="font-semibold text-purple-400">
                  +{hyperAOEIncrease}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Spell Surge AOE Increase</span>
                <span className="font-semibold text-purple-400">
                  +{surgeAOEIncrease}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Total AOE Level Increase</span>
                <span className="font-semibold text-purple-400">
                  +{totalAOEIncrease}
                </span>
              </div>
            </>
          )}

          {/* Final Mana Cost */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Mana Cost</span>
            <span className="text-lg font-bold text-orange-400">{cost}</span>
          </div>

          {/* Final TTT */}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-gray-100">Final TTT</span>
            <span className="text-lg font-bold text-orange-400">{ttt}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Applied Weapon Selection */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Applied Weapon Effect
        </h3>

        <Select
          title="Applied Weapons"
          choices={appliedWeapons.map((weapon) => weapon.label)}
          changeChoice={(choice: string) => {
            const index = appliedWeapons.findIndex(
              (weapon) => weapon.label === choice,
            );

            if (index >= 0) {
              setSelectedWeapon(index);
            }
          }}
        />

        {selectedEffect && (
          <div className="mt-5 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <h4 className="mb-3 text-lg font-semibold text-cyan-400 underline underline-offset-4">
              {selectedEffect.label}
            </h4>

            <div className="space-y-2">
              {selectedEffect.info.map((line, index) => (
                <p
                  key={index}
                  className="text-sm leading-relaxed text-gray-400"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* Applied Spell Cost Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Applied Spell Cost Configuration
        </h3>

        <label className="block">
          <span className="mb-2 block font-semibold text-gray-300">
            Base Cost of Applied Spell
          </span>

          <input
            type="number"
            min={0}
            max={MAX_BASE_COST}
            step={1}
            value={baseCost}
            onChange={(e) => changeBaseCost(Number(e.target.value))}
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <p className="mt-3 text-sm leading-relaxed text-gray-400">
          Mana Cost:{" "}
          <span className="font-semibold text-cyan-400">70% / 50% / 30%</span>{" "}
          based on mastery.
        </p>

        <p className="mt-1 text-sm leading-relaxed text-gray-400">
          TTT:{" "}
          <span className="font-semibold text-cyan-400">30% / 20% / 10%</span>{" "}
          based on mastery.
        </p>

        <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between text-gray-300">
            <span>Base Spell Cost</span>
            <span className="font-semibold text-cyan-400">{baseCost}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Calculated Mana Cost</span>
            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Calculated TTT</span>
            <span className="font-semibold text-cyan-400">{ttt}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Defensive Casting Configuration */}
      {/* ================================================== */}

      {(spellReflex || autoCast || counterSpell) && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Defensive Casting Configuration
          </h3>

          <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="flex justify-between gap-3 text-gray-300">
              <span>Counter Spell</span>
              <span className="font-semibold text-purple-400">
                {counterSpell ? "ENABLED" : "DISABLED"}
              </span>
            </div>

            <div className="flex justify-between gap-3 text-gray-300">
              <span>Spell Reflex</span>
              <span className="font-semibold text-purple-400">
                {spellReflex ? "ENABLED" : "DISABLED"}
              </span>
            </div>

            <div className="flex justify-between gap-3 text-gray-300">
              <span>Auto Cast</span>
              <span className="font-semibold text-purple-400">
                {autoCast ? "ENABLED" : "DISABLED"}
              </span>
            </div>

            <div className="flex justify-between gap-3 border-t border-gray-700 pt-3 text-gray-300">
              <span>Defensive Action Cost</span>
              <span className="font-semibold text-cyan-400">
                {defensiveActionCost ?? "N/A"}
              </span>
            </div>

            <div className="flex justify-between gap-3 text-gray-300">
              <span>Uses per Turn</span>
              <span className="font-semibold text-cyan-400">
                {defensiveUsesPerTurn}
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            Auto Cast removes the Defensive Action cost. Spell Reflex allows two
            uses in the same turn. Counter Spell permits casting as a Defensive
            Action.
          </p>
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
                ? "The target qualifies for an AOE level increase when the same enchantment is reapplied."
                : "The target must already have at least two active enchantments from the caster."}
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <h4 className="mb-2 font-semibold text-gray-300">
              Reapplication Method
            </h4>

            <p className="text-sm leading-relaxed text-gray-400">
              {spellRecovery
                ? "Reapply the enchantment using a Main Action, or automatically when the target enters the caster's vicinity through Spell Recovery."
                : "Reapply the enchantment using a Main Action. Enable Spell Recovery for automatic reapplication."}
            </p>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* AOE Configuration */}
      {/* ================================================== */}

      {(hyperSpell || spellSurge) && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            AOE Configuration
          </h3>

          <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="flex justify-between text-gray-300">
              <span>Hyper Spell Increase</span>
              <span className="font-semibold text-cyan-400">
                +{hyperAOEIncrease}
              </span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>Spell Surge Increase</span>
              <span className="font-semibold text-cyan-400">
                +{surgeAOEIncrease}
              </span>
            </div>

            <div className="flex justify-between border-t border-gray-700 pt-3 text-gray-300">
              <span className="font-semibold text-gray-100">
                Total AOE Increase
              </span>
              <span className="text-lg font-bold text-orange-400">
                +{totalAOEIncrease}
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            AOE increases are displayed as level adjustments to the applied
            effect.
          </p>
        </div>
      )}

      {/* ================================================== */}
      {/* Spell Description */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Description
        </h3>

        <div className="space-y-3 text-sm leading-relaxed text-gray-300">
          <p>
            Applies a selected spell effect to a weapon. The Mana cost and TTT
            requirement are calculated as percentages of the applied spell's
            base cost.
          </p>

          <p>Novice: 70% Mana Cost and 30% TTT.</p>

          <p>Intermediate: 50% Mana Cost and 20% TTT.</p>

          <p>Mastered: 30% Mana Cost and 10% TTT.</p>
        </div>
      </div>
    </>
  );
};

export default ApplyEffectW;
