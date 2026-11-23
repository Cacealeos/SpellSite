import { useEffect, useState } from "react";
import { BoltIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type CatalystType = "MENTAL" | "BODY" | "SPIRIT" | "MEMORY" | "NECRO";

type DamageType =
  | "PRESSURE"
  | "VORPAL"
  | "EXPLOSIVE"
  | "THERMAL"
  | "KINETIC"
  | "CONCUSSIVE"
  | "GRAVITY";

// ==================================================
// Aura Surge Catalyst Data
// ==================================================

const catalystDamageTypes: Record<CatalystType, DamageType[]> = {
  MENTAL: ["PRESSURE", "VORPAL"],
  BODY: ["EXPLOSIVE", "THERMAL"],
  SPIRIT: ["KINETIC", "CONCUSSIVE"],
  MEMORY: ["KINETIC", "GRAVITY"],
  NECRO: ["KINETIC", "PRESSURE"],
};

const catalysts = Object.keys(catalystDamageTypes) as CatalystType[];

const damageTypes: DamageType[] = [
  "PRESSURE",
  "VORPAL",
  "EXPLOSIVE",
  "THERMAL",
  "KINETIC",
  "CONCUSSIVE",
  "GRAVITY",
];

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Soul Cast": true,
  "Full Cast": true,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": true,
  "Rivet Cast": true,
  "Spell Recovery": true,
  "Aura Surge": true,
};

// ==================================================
// Mastery Data
// ==================================================

const masteryRates: Record<MasteryType, number> = {
  NOVICE: 3,
  INTERMEDIATE: 2,
  MASTERED: 1,
};

// ==================================================
// Constants
// ==================================================

const CHARGE_MULTIPLIER = 0.3;
const AURA_SURGE_SCALING = 0.3;

// ==================================================
// Component
// ==================================================

const WeaponDamage = ({
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

  const [baseDamage, setBaseDamage] = useState(0);
  const [enchantmentDamage, setEnchantmentDamage] = useState(0);

  const [spellCharge, setSpellCharge] = useState(false);
  const [spellRecovery, setSpellRecovery] = useState(false);
  const [spellSurge, setSpellSurge] = useState(false);
  const [fullCast, setFullCast] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);

  const [chargeTurns, setChargeTurns] = useState(0);
  const [doubleCast, setDoubleCast] = useState(false);

  const [existingEnchantments, setExistingEnchantments] = useState(0);

  const [catalyst, setCatalyst] = useState<CatalystType>("MENTAL");

  const [damageType, setDamageType] = useState<DamageType>("PRESSURE");

  const [unleashDamage, setUnleashDamage] = useState(0);

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
  // Damage Calculations
  // ==================================================

  // Base weapon damage is optional.
  // If provided, the enchantment cannot cause
  // total weapon damage to exceed BASE × 2.

  const maxEnchantmentDamage = baseDamage > 0 ? baseDamage : Infinity;

  // Investment is limited by the final
  // charged enchantment damage.

  const maxInvestment = Number.isFinite(maxEnchantmentDamage)
    ? Math.ceil(maxEnchantmentDamage / strengthMultiplier)
    : Infinity;

  const investedDamage = Math.min(enchantmentDamage, maxInvestment);

  const baseEnchantmentDamage = investedDamage;

  const finalEnchantmentDamage = Math.min(
    baseEnchantmentDamage * strengthMultiplier,
    maxEnchantmentDamage,
  );

  const totalWeaponDamage =
    baseDamage > 0 ? baseDamage + finalEnchantmentDamage : null;

  // ==================================================
  // TTT Calculations
  // ==================================================

  const baseTTT = investedDamage * rate;

  const finalTTT = Math.ceil(baseTTT * strengthMultiplier);

  // ==================================================
  // Spell Surge Calculations
  // ==================================================

  const surgeEligible = active && spellSurge && existingEnchantments >= 2;

  const aoeIncrease = surgeEligible ? 1 : 0;

  // ==================================================
  // Aura Surge Calculations
  // ==================================================

  const auraEligible =
    active && auraSurge && catalystDamageTypes[catalyst].includes(damageType);

  const auraMultiplier = auraEligible ? 1 + AURA_SURGE_SCALING : 1;

  // Aura Surge scales weapon damage and UNLEASH damage.
  // The existing enchantment damage and BASE × 2 cap
  // remain unchanged.

  const auraWeaponBase = totalWeaponDamage ?? finalEnchantmentDamage;

  const weaponBonus = auraWeaponBase * (auraMultiplier - 1);

  const unleashBonus = unleashDamage * (auraMultiplier - 1);

  const finalAuraWeaponDamage = auraWeaponBase * auraMultiplier;

  const finalUnleashDamage = unleashDamage * auraMultiplier;

  const displayDamage = (value: number) => Number(value.toFixed(2));

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", 0);
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalTTT, updateSpell]);

  // ==================================================
  // Reset
  // ==================================================

  useEffect(() => {
    if (!active) {
      setBaseDamage(0);
      setEnchantmentDamage(0);

      setSpellCharge(false);
      setSpellRecovery(false);
      setSpellSurge(false);
      setFullCast(false);
      setAuraSurge(false);

      setChargeTurns(0);
      setDoubleCast(false);
      setExistingEnchantments(0);

      setCatalyst("MENTAL");
      setDamageType("PRESSURE");
      setUnleashDamage(0);
    }
  }, [active]);

  // ==================================================
  // Clamp Damage Investment
  // ==================================================

  useEffect(() => {
    if (enchantmentDamage > maxInvestment) {
      setEnchantmentDamage(maxInvestment);
    }
  }, [enchantmentDamage, maxInvestment]);

  // ==================================================
  // Handlers
  // ==================================================

  const changeBaseDamage = (value: number) => {
    setBaseDamage(Math.max(0, Math.trunc(value || 0)));
  };

  const changeEnchantmentDamage = (value: number) => {
    const normalized = Math.max(0, Math.trunc(value || 0));

    setEnchantmentDamage(Math.min(normalized, maxInvestment));
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

  const changeUnleashDamage = (value: number) => {
    setUnleashDamage(Number.isFinite(value) ? Math.max(0, value) : 0);
  };

  // ==================================================
  // Technique Button Styling
  // ==================================================

  const techniqueButtonClass = (selected: boolean) =>
    `shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
      selected
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

        <h1 className="text-2xl font-bold text-cyan-400">Weapon Damage</h1>
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

          <div className="flex flex-wrap gap-1.5">
            {/* Spell Charge */}

            <button
              type="button"
              onClick={toggleSpellCharge}
              aria-pressed={spellCharge}
              className={techniqueButtonClass(spellCharge)}
            >
              Spell Charge
            </button>

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

            {/* Full Cast */}

            <button
              type="button"
              onClick={() => setFullCast((previous) => !previous)}
              aria-pressed={fullCast}
              className={techniqueButtonClass(fullCast)}
            >
              Full Cast
            </button>

            {/* Aura Surge */}

            <button
              type="button"
              onClick={() => setAuraSurge((previous) => !previous)}
              aria-pressed={auraSurge}
              className={techniqueButtonClass(auraSurge)}
            >
              Aura Surge
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Descriptions */}
        {/* ================================================== */}

        {(spellCharge ||
          spellRecovery ||
          spellSurge ||
          fullCast ||
          auraSurge) && (
          <div className="mb-5 space-y-3">
            {/* Spell Charge */}

            {spellCharge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Charge:</strong>{" "}
                  Increases enchantment damage by{" "}
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
                  Automatically reapplies the Weapon Damage enchantment when the
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

            {/* Full Cast */}

            {fullCast && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Full Cast:</strong> Once
                  per turn, targets receive an additional{" "}
                  <strong className="text-purple-300">INTERACT ACTION</strong>{" "}
                  when a weapon enchantment is first cast on them. Using this
                  additional action{" "}
                  <strong className="text-red-400">REMOVES</strong> the
                  enchantment.
                </p>
              </div>
            )}

            {/* Aura Surge */}

            {auraSurge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Aura Surge:</strong> While
                  the weapon enchantment is active, adds{" "}
                  <strong className="text-purple-300">
                    +30% positive scaling
                  </strong>{" "}
                  to weapon and UNLEASH damage when channeling a matching
                  catalyst and dealing its corresponding damage type.
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
            <span>TTT per Damage</span>

            <span className="font-semibold text-cyan-400">{rate}</span>
          </div>

          {/* Base Weapon Damage */}

          <div className="flex justify-between">
            <span>Base Weapon Damage</span>

            <span className="font-semibold text-cyan-400">
              {baseDamage > 0 ? baseDamage : "Not Set"}
            </span>
          </div>

          {/* Base Enchantment Damage */}

          <div className="flex justify-between">
            <span>Base Enchantment Damage</span>

            <span className="font-semibold text-cyan-400">
              {investedDamage}
            </span>
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

          {/* Full Cast Statistics */}

          {fullCast && (
            <>
              <div className="flex justify-between gap-3">
                <span>Additional Interact Action</span>

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

          {/* Aura Surge Statistics */}

          {auraSurge && (
            <>
              <div className="flex justify-between gap-3">
                <span>Catalyst</span>

                <span className="font-semibold text-cyan-400">{catalyst}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Damage Type</span>

                <span className="font-semibold text-cyan-400">
                  {damageType}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Aura Surge Scaling</span>

                <span
                  className={`font-semibold ${
                    auraEligible ? "text-purple-400" : "text-gray-500"
                  }`}
                >
                  {auraEligible ? "+30% ACTIVE" : "INACTIVE / NO MATCH"}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Weapon Damage Bonus</span>

                <span className="font-semibold text-purple-400">
                  +{displayDamage(weaponBonus)}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>UNLEASH Damage Bonus</span>

                <span className="font-semibold text-purple-400">
                  +{displayDamage(unleashBonus)}
                </span>
              </div>
            </>
          )}

          {/* Final Enchantment Damage */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">
              Enchantment Damage
            </span>

            <span className="text-lg font-bold text-orange-400">
              {displayDamage(finalEnchantmentDamage)}
            </span>
          </div>

          {/* Total Weapon Damage */}

          {totalWeaponDamage !== null && (
            <div className="flex justify-between">
              <span className="font-semibold text-gray-100">
                Total Weapon Damage
              </span>

              <span className="text-lg font-bold text-orange-400">
                {displayDamage(totalWeaponDamage)}
              </span>
            </div>
          )}

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
      {/* Weapon Damage Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Weapon Damage Configuration
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-gray-400">
          Converts TTT into additional weapon damage at the current mastery
          rate. The enchantment's final damage cannot exceed the base damage of
          the weapon when a base value is provided.
        </p>

        {/* Enchantment Damage */}

        <label className="block">
          <span className="mb-2 block font-semibold text-gray-300">
            Enchantment Damage Investment
          </span>

          <input
            type="number"
            min={0}
            max={Number.isFinite(maxInvestment) ? maxInvestment : undefined}
            step={1}
            value={investedDamage}
            onChange={(e) => changeEnchantmentDamage(Number(e.target.value))}
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />
        </label>

        {/* Investment Summary */}

        <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between text-gray-300">
            <span>Base Enchantment Damage</span>

            <span className="font-semibold text-cyan-400">
              {baseEnchantmentDamage}
            </span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Final Enchantment Damage</span>

            <span className="font-semibold text-cyan-400">
              {displayDamage(finalEnchantmentDamage)}
            </span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Base TTT</span>

            <span className="font-semibold text-cyan-400">{baseTTT}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Final TTT</span>

            <span className="font-semibold text-cyan-400">{finalTTT}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Base Weapon Damage Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Base Weapon Damage Configuration
        </h3>

        {/* Base Damage Input */}

        <label className="block">
          <span className="mb-2 block font-semibold text-gray-300">
            Base Weapon Damage (Optional)
          </span>

          <input
            type="number"
            min={0}
            step={1}
            value={baseDamage}
            onChange={(e) => changeBaseDamage(Number(e.target.value))}
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />
        </label>

        {/* Weapon Damage Summary */}

        {baseDamage > 0 && (
          <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="flex justify-between text-gray-300">
              <span>Base Weapon Damage</span>

              <span className="font-semibold text-cyan-400">{baseDamage}</span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>Maximum Total Damage</span>

              <span className="font-semibold text-cyan-400">
                {baseDamage * 2}
              </span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>Current Total Damage</span>

              <span className="font-semibold text-cyan-400">
                {displayDamage(totalWeaponDamage ?? 0)}
              </span>
            </div>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-400">
          Maximum damage cannot exceed{" "}
          <span className="font-semibold text-cyan-400">BASE × 2</span> of the
          melee weapon.
        </p>
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
                Allows other spells to be cast while charging Weapon Damage.
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
      {/* Full Cast Configuration */}
      {/* ================================================== */}

      {fullCast && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Full Cast Configuration
          </h3>

          <p className="mb-4 text-sm leading-relaxed text-gray-300">
            Once per turn, targets receive an additional Interact Action when a
            weapon enchantment is first cast on them. Using the additional
            action removes the enchantment.
          </p>

          <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
            <div className="flex justify-between gap-3">
              <span>Additional Interact Actions</span>

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
      {/* Aura Surge Configuration */}
      {/* ================================================== */}

      {auraSurge && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Aura Surge Configuration
          </h3>

          <p className="mb-4 text-sm leading-relaxed text-gray-300">
            Channel a catalyst to add 30% positive scaling to weapon and UNLEASH
            damage of the corresponding type while the weapon enchantment is
            active.
          </p>

          {/* Catalyst & Damage Selection */}

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Catalyst */}

            <label className="block text-gray-300">
              <span className="mb-2 block font-semibold">Catalyst</span>

              <select
                value={catalyst}
                onChange={(e) => setCatalyst(e.target.value as CatalystType)}
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
              >
                {catalysts.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            {/* Damage Type */}

            <label className="block text-gray-300">
              <span className="mb-2 block font-semibold">Damage Type</span>

              <select
                value={damageType}
                onChange={(e) => setDamageType(e.target.value as DamageType)}
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
              >
                {damageTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            {/* UNLEASH Damage */}

            <label className="block text-gray-300 sm:col-span-2">
              <span className="mb-2 block font-semibold">
                Base UNLEASH Damage
              </span>

              <input
                type="number"
                min={0}
                step="any"
                value={unleashDamage}
                onChange={(e) => changeUnleashDamage(Number(e.target.value))}
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
              />
            </label>
          </div>

          {/* Aura Surge Summary */}

          <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
            <p className="text-sm text-gray-400">
              Matching damage types: {catalystDamageTypes[catalyst].join(", ")}
            </p>

            <div className="flex justify-between gap-3">
              <span>Scaling Status</span>

              <span
                className={`font-semibold ${
                  auraEligible ? "text-purple-400" : "text-gray-500"
                }`}
              >
                {auraEligible ? "+30% ACTIVE" : "INACTIVE / NO MATCH"}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>Weapon Damage Before Aura</span>

              <span className="font-semibold text-cyan-400">
                {displayDamage(auraWeaponBase)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>Weapon Damage Bonus</span>

              <span className="font-semibold text-purple-400">
                +{displayDamage(weaponBonus)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>Final Weapon Damage</span>

              <span className="font-semibold text-cyan-400">
                {displayDamage(finalAuraWeaponDamage)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>UNLEASH Damage Bonus</span>

              <span className="font-semibold text-purple-400">
                +{displayDamage(unleashBonus)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>Final UNLEASH Damage</span>

              <span className="font-semibold text-cyan-400">
                {displayDamage(finalUnleashDamage)}
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
                ? "The target qualifies for a +1 AOE level increase when Weapon Damage is reapplied."
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
                ? "Weapon Damage can be reapplied automatically when the target enters the caster's vicinity, or manually using a Main Action."
                : "Reapply Weapon Damage using a Main Action. Enable Spell Recovery to allow automatic reapplication when the target enters the caster's vicinity."}
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

        <div className="space-y-3 text-sm leading-relaxed text-gray-300">
          <p>
            Converts Manna into additional melee weapon damage at the current
            mastery rate.
          </p>

          <p>TTT: 3 / 2 / 1 per damage based on mastery.</p>

          <p>
            Maximum damage cannot exceed{" "}
            <span className="font-semibold text-cyan-400">BASE × 2</span> of the
            melee weapon.
          </p>
        </div>
      </div>
    </>
  );
};

export default WeaponDamage;
