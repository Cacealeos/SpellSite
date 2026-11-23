import { useEffect, useState } from "react";
import { ShieldExclamationIcon } from "@heroicons/react/24/solid";

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

type TechniqueType =
  | "Spell Charge"
  | "Spell Recovery"
  | "Spell Surge"
  | "Full Cast"
  | "Aura Surge";

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
  NOVICE: 2,
  INTERMEDIATE: 3,
  MASTERED: 4,
};

// ==================================================
// Constants
// ==================================================

const MAX_DISRUPTION = 50;
const CHARGE_MULTIPLIER = 0.3;
const AURA_SURGE_SCALING = 0.3;

// ==================================================
// Component
// ==================================================

const Disruption = ({
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
  const [fullCast, setFullCast] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);

  const [chargeTurns, setChargeTurns] = useState(0);
  const [doubleCast, setDoubleCast] = useState(false);
  const [existingEnchantments, setExistingEnchantments] = useState(0);

  const [catalyst, setCatalyst] = useState<CatalystType>("MENTAL");

  const [damageType, setDamageType] = useState<DamageType>("PRESSURE");

  const [weaponDamage, setWeaponDamage] = useState(0);
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
  // Disruption Calculations
  // ==================================================

  const disruptionPerTTT = rate * strengthMultiplier;

  const maxInvestment =
    disruptionPerTTT > 0 ? Math.ceil(MAX_DISRUPTION / disruptionPerTTT) : 0;

  const investedTTT = Math.min(baseValue, maxInvestment);

  const baseDisruption = investedTTT * rate;

  const disruption = Math.min(
    baseDisruption * strengthMultiplier,
    MAX_DISRUPTION,
  );

  const finalTTT = Math.ceil(investedTTT * strengthMultiplier);

  // ==================================================
  // Spell Surge Calculations
  // ==================================================

  const surgeEligible = spellSurge && existingEnchantments >= 2;

  const aoeIncrease = surgeEligible ? 1 : 0;

  // ==================================================
  // Aura Surge Calculations
  // ==================================================

  const auraEligible =
    active && auraSurge && catalystDamageTypes[catalyst].includes(damageType);

  const auraMultiplier = auraEligible ? 1 + AURA_SURGE_SCALING : 1;

  const weaponBonus = weaponDamage * (auraMultiplier - 1);

  const unleashBonus = unleashDamage * (auraMultiplier - 1);

  const finalWeaponDamage = weaponDamage * auraMultiplier;

  const finalUnleashDamage = unleashDamage * auraMultiplier;

  const displayDamage = (value: number) => Number(value.toFixed(2));

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
      setFullCast(false);
      setAuraSurge(false);

      setChargeTurns(0);
      setDoubleCast(false);
      setExistingEnchantments(0);

      setCatalyst("MENTAL");
      setDamageType("PRESSURE");
      setWeaponDamage(0);
      setUnleashDamage(0);
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

  const changeDamage = (value: number, setter: (value: number) => void) => {
    setter(Number.isFinite(value) ? Math.max(0, value) : 0);
  };

  // ==================================================
  // Technique Helpers
  // ==================================================

  const techniqueStates: Record<TechniqueType, boolean> = {
    "Spell Charge": spellCharge,
    "Spell Recovery": spellRecovery,
    "Spell Surge": spellSurge,
    "Full Cast": fullCast,
    "Aura Surge": auraSurge,
  };

  const toggleTechnique = (technique: TechniqueType) => {
    switch (technique) {
      case "Spell Charge":
        toggleSpellCharge();
        break;
      case "Spell Recovery":
        setSpellRecovery((previous) => !previous);
        break;
      case "Spell Surge":
        setSpellSurge((previous) => !previous);
        break;
      case "Full Cast":
        setFullCast((previous) => !previous);
        break;
      case "Aura Surge":
        setAuraSurge((previous) => !previous);
        break;
    }
  };

  const TechniqueButton = ({ technique }: { technique: TechniqueType }) => {
    const enabled = techniqueStates[technique];

    return (
      <button
        type="button"
        onClick={() => toggleTechnique(technique)}
        aria-pressed={enabled}
        className={`shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
          enabled
            ? "bg-purple-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
        }`}
      >
        {technique}
      </button>
    );
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
        <ShieldExclamationIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Disruption</h1>
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
        {/* Header & Technique Buttons */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <div className="flex flex-wrap gap-1.5">
            <TechniqueButton technique="Spell Charge" />
            <TechniqueButton technique="Spell Recovery" />
            <TechniqueButton technique="Spell Surge" />
            <TechniqueButton technique="Full Cast" />
            <TechniqueButton technique="Aura Surge" />
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
            {spellCharge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Charge:</strong>{" "}
                  Increases Disruption strength by 30% per complete turn of
                  charging. TTT also increases by 30% per turn. Other spells
                  cannot be cast while charging unless Double Cast is used.
                </p>
              </div>
            )}

            {spellRecovery && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Recovery:</strong>{" "}
                  Automatically reapplies the Disruption enchantment when the
                  target enters the caster's vicinity.
                </p>
              </div>
            )}

            {spellSurge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Surge:</strong>{" "}
                  Increases AOE by one level when the target has at least two
                  active enchantments from the caster. Reapplication uses a Main
                  Action or occurs automatically through Spell Recovery.
                </p>
              </div>
            )}

            {fullCast && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Full Cast:</strong> Once
                  per turn, targets receive an additional{" "}
                  <strong className="text-purple-300">INTERACT ACTION</strong>{" "}
                  when a weapon enchantment is first cast on them. Using this
                  action <strong className="text-red-400">REMOVES</strong> the
                  enchantment.
                </p>
              </div>
            )}

            {auraSurge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Aura Surge:</strong> While
                  the weapon enchantment is active, adds{" "}
                  <strong className="text-purple-300">
                    +30% positive scaling
                  </strong>{" "}
                  to weapon and UNLEASH damage when channeling a matching
                  catalyst.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Mastery</span>
            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          <div className="flex justify-between">
            <span>Base Disruption per TTT</span>
            <span className="font-semibold text-cyan-400">{rate}</span>
          </div>

          <div className="flex justify-between">
            <span>Maximum Disruption</span>
            <span className="font-semibold text-cyan-400">
              {MAX_DISRUPTION}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Base TTT Investment</span>
            <span className="font-semibold text-cyan-400">{investedTTT}</span>
          </div>

          {/* Spell Charge */}

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
                <span className="font-semibold text-purple-400">
                  +{aoeIncrease}
                </span>
              </div>
            </>
          )}

          {/* Full Cast */}

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

          {/* Aura Surge */}

          {auraSurge && (
            <>
              <div className="flex justify-between">
                <span>Catalyst</span>
                <span className="font-semibold text-cyan-400">{catalyst}</span>
              </div>

              <div className="flex justify-between">
                <span>Damage Type</span>
                <span className="font-semibold text-cyan-400">
                  {damageType}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Aura Surge Scaling</span>
                <span
                  className={`font-semibold ${
                    auraEligible ? "text-purple-400" : "text-gray-500"
                  }`}
                >
                  {auraEligible ? "+30% ACTIVE" : "INACTIVE / NO MATCH"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Weapon Damage Bonus</span>
                <span className="font-semibold text-purple-400">
                  +{displayDamage(weaponBonus)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>UNLEASH Damage Bonus</span>
                <span className="font-semibold text-purple-400">
                  +{displayDamage(unleashBonus)}
                </span>
              </div>
            </>
          )}

          {/* Final Disruption */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">
              Disruption Bonus
            </span>
            <span className="text-lg font-bold text-orange-400">
              {Number(disruption.toFixed(2))}
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
      {/* Disruption Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Disruption Configuration
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-gray-400">
          Each point of TTT grants{" "}
          <span className="font-semibold text-cyan-400">{rate}</span> temporary
          Disruption before Spell Charge modifiers. Maximum Disruption is{" "}
          <span className="font-semibold text-cyan-400">{MAX_DISRUPTION}</span>.
        </p>

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

        <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between text-gray-300">
            <span>Base Disruption</span>
            <span className="font-semibold text-cyan-400">
              {baseDisruption}
            </span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Final Disruption</span>
            <span className="font-semibold text-cyan-400">
              {Number(disruption.toFixed(2))}
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
                Allows other spells to be cast while charging Disruption.
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
            weapon enchantment is first cast on them. Using that additional
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
            damage of the corresponding type while this enchantment is active.
          </p>

          {/* Catalyst & Damage Selection */}

          <div className="grid gap-4 sm:grid-cols-2">
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

            {/* Weapon Damage */}

            <label className="block text-gray-300">
              <span className="mb-2 block font-semibold">
                Base Weapon Damage
              </span>

              <input
                type="number"
                min={0}
                step="any"
                value={weaponDamage}
                onChange={(e) =>
                  changeDamage(Number(e.target.value), setWeaponDamage)
                }
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
              />
            </label>

            {/* UNLEASH Damage */}

            <label className="block text-gray-300">
              <span className="mb-2 block font-semibold">
                Base UNLEASH Damage
              </span>

              <input
                type="number"
                min={0}
                step="any"
                value={unleashDamage}
                onChange={(e) =>
                  changeDamage(Number(e.target.value), setUnleashDamage)
                }
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
              <span>Final Weapon Damage</span>

              <span className="font-semibold text-cyan-400">
                {displayDamage(finalWeaponDamage)}
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
                ? "The target qualifies for a +1 AOE level increase when Disruption is reapplied."
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
                ? "Disruption can be reapplied automatically when the target enters the caster's vicinity, or manually using a Main Action."
                : "Reapply Disruption using a Main Action. Enable Spell Recovery to allow automatic reapplication when the target enters the caster's vicinity."}
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
          Converts Manna into temporary Disruption at the current mastery rate.
          Maximum Disruption is 50.
        </p>
      </div>
    </>
  );
};

export default Disruption;
