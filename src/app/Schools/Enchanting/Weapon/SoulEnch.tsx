import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

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
const AURA_SURGE_SCALING = 0.3;

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
  "Spell Charge": false,
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

const masteryTTT: Record<MasteryType, number> = {
  NOVICE: 20,
  INTERMEDIATE: 15,
  MASTERED: 10,
};

// ==================================================
// Component
// ==================================================

const SoulEnch = ({
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

  const [enabled, setEnabled] = useState(false);

  const [spellRecovery, setSpellRecovery] = useState(false);

  const [spellSurge, setSpellSurge] = useState(false);
  const [fullCast, setFullCast] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);
  const [catalyst, setCatalyst] = useState<CatalystType>("MENTAL");
  const [damageType, setDamageType] = useState<DamageType>("PRESSURE");
  const [weaponDamage, setWeaponDamage] = useState(0);
  const [unleashDamage, setUnleashDamage] = useState(0);

  const [existingEnchantments, setExistingEnchantments] = useState(0);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const baseTTT = masteryTTT[mastery] ?? 0;

  // ==================================================
  // Derived Values
  // ==================================================

  const finalTTT = enabled ? baseTTT : 0;

  const surgeEligible = enabled && spellSurge && existingEnchantments >= 2;

  const aoeIncrease = surgeEligible ? 1 : 0;

  // ==================================================
  // Aura Surge Calculations
  // ==================================================

  const auraEligible =
    active &&
    enabled &&
    auraSurge &&
    catalystDamageTypes[catalyst].includes(damageType);
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
    updateSpell("cost", 0);

    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalTTT, updateSpell]);

  // ==================================================
  // Reset
  // ==================================================

  useEffect(() => {
    if (!active) {
      setEnabled(false);
      setSpellRecovery(false);
      setSpellSurge(false);
      setFullCast(false);
      setAuraSurge(false);
      setCatalyst("MENTAL");
      setDamageType("PRESSURE");
      setWeaponDamage(0);
      setUnleashDamage(0);
      setExistingEnchantments(0);
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const toggleSpellRecovery = () => {
    setSpellRecovery((previous) => !previous);
  };

  const toggleSpellSurge = () => {
    setSpellSurge((previous) => !previous);
  };

  const changeExistingEnchantments = (value: number) => {
    setExistingEnchantments(Math.max(0, Math.trunc(value || 0)));
  };

  const changeDamage = (value: number, setter: (value: number) => void) =>
    setter(Number.isFinite(value) ? Math.max(0, value) : 0);

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
        <SparklesIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Soul Enchant</h1>
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
              onClick={toggleSpellRecovery}
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
              onClick={toggleSpellSurge}
              aria-pressed={spellSurge}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                spellSurge
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
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

        {(spellRecovery || spellSurge || fullCast || auraSurge) && (
          <div className="mb-5 space-y-3">
            {/* Spell Recovery */}

            {spellRecovery && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Recovery:</strong>{" "}
                  Automatically reapplies the Soul Enchant enchantment when the
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

          {/* Enchantment Status */}

          <div className="flex justify-between">
            <span>Enchantment Status</span>

            <span
              className={`font-semibold ${
                enabled ? "text-green-400" : "text-gray-500"
              }`}
            >
              {enabled ? "ENABLED" : "DISABLED"}
            </span>
          </div>

          {/* Soul Damage */}

          <div className="flex justify-between">
            <span>Soul Damage</span>

            <span className="font-semibold text-cyan-400">
              Equal to Weapon Damage
            </span>
          </div>

          {/* Spirit Damage */}

          <div className="flex justify-between">
            <span>Spirit Damage</span>

            <span className="font-semibold text-cyan-400">
              Equal to Weapon Damage
            </span>
          </div>

          {/* Weapon Requirement */}

          <div className="flex justify-between">
            <span>Weapon Requirement</span>

            <span className="font-semibold text-cyan-400">Soul-Bound</span>
          </div>

          {/* Spell Charge */}

          <div className="flex justify-between">
            <span>Spell Charge</span>

            <span className="font-semibold text-red-400">DISABLED</span>
          </div>

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
                  className={`font-semibold ${auraEligible ? "text-purple-400" : "text-gray-500"}`}
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

          {/* Mana Cost */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Mana Cost</span>

            <span className="text-lg font-bold text-orange-400">0</span>
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
      {/* Soul Enchant Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Soul Enchant Configuration
        </h3>

        {/* Enable Enchantment */}

        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div>
            <span className="block font-semibold text-gray-300">
              Enable Soul Enchant
            </span>

            <p className="mt-1 text-sm text-gray-500">
              Applies Soul and Spirit damage against targets immune to physical
              damage.
            </p>
          </div>

          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-5 w-5 accent-orange-500"
          />
        </label>

        {/* Enchantment Summary */}

        <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between text-gray-300">
            <span>Mastery TTT Requirement</span>

            <span className="font-semibold text-cyan-400">{baseTTT}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Applied TTT</span>

            <span className="font-semibold text-cyan-400">{finalTTT}</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-400">
          TTT (Novice / Intermediate / Mastered):{" "}
          <span className="font-medium text-cyan-400">20 / 15 / 10</span>
        </p>
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
            Once per turn, targets receive an additional Interact Action when a
            weapon enchantment is first cast on them. Using that action removes
            the enchantment.
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
            damage of the corresponding type while Soul Enchant is active.
          </p>
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
          <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
            <p className="text-sm text-gray-400">
              Matching damage types: {catalystDamageTypes[catalyst].join(", ")}
            </p>
            <div className="flex justify-between gap-3">
              <span>Scaling Status</span>
              <span
                className={`font-semibold ${auraEligible ? "text-purple-400" : "text-gray-500"}`}
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
                ? "The target qualifies for a +1 AOE level increase when Soul Enchant is reapplied."
                : "The target requires at least two existing enchantments from the caster and an enabled Soul Enchant."}
            </p>
          </div>

          {/* Reapplication Method */}

          <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <h4 className="mb-2 font-semibold text-gray-300">
              Reapplication Method
            </h4>

            <p className="text-sm leading-relaxed text-gray-400">
              {spellRecovery
                ? "Soul Enchant can be reapplied automatically when the target enters the caster's vicinity, or manually using a Main Action."
                : "Reapply Soul Enchant using a Main Action. Enable Spell Recovery to allow automatic reapplication when the target enters the caster's vicinity."}
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
            Enables Soul and Spirit damage equal to the damage dealt to targets
            that are immune to physical damage.
          </p>

          <p>Only viable with soul-bound weapons.</p>

          <p className="font-semibold text-red-400">
            Spell Charge is disabled.
          </p>
        </div>
      </div>
    </>
  );
};

export default SoulEnch;
