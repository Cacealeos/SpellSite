import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import Select from "@/app/Select";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";
import { appliedWeapons } from "./ApplyEffect";

// ==================================================
// TYPES
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
  | "Spell Reflex"
  | "Auto Cast"
  | "Counter Spell"
  | "Full Cast"
  | "Aura Surge"
  | "Spell Recovery"
  | "Spell Surge"
  | "Hyper Spell";

// ==================================================
// SPELL TECHNIQUES
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": true,
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
// MASTERY DATA
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
// CATALYST DATA
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
// CONSTANTS
// ==================================================

const MAX_BASE_COST = 300;
const AURA_SURGE_SCALING = 0.3;

const techniqueNames: TechniqueType[] = [
  "Spell Reflex",
  "Auto Cast",
  "Counter Spell",
  "Full Cast",
  "Aura Surge",
  "Spell Recovery",
  "Spell Surge",
  "Hyper Spell",
];

const initialTechniques: Record<TechniqueType, boolean> = {
  "Spell Reflex": false,
  "Auto Cast": false,
  "Counter Spell": false,
  "Full Cast": false,
  "Aura Surge": false,
  "Spell Recovery": false,
  "Spell Surge": false,
  "Hyper Spell": false,
};

const techniqueDescriptions: Record<TechniqueType, string> = {
  "Spell Reflex":
    "Apply Effects may be used twice in the same turn as a Defensive Action. Requires Counter Spell.",

  "Auto Cast":
    "Apply Effects do not cost a Defensive Action. Requires Counter Spell.",

  "Counter Spell": "Apply Effects can be cast as a Defensive Action.",

  "Full Cast":
    "Once per turn, targets receive an additional INTERACT ACTION when a weapon enchantment is first cast on them. Using this additional action REMOVES the enchantment.",

  "Aura Surge":
    "While a weapon enchantment is active, adds 30% positive scaling to weapon and UNLEASH damage when channeling a matching catalyst and dealing its corresponding damage type.",

  "Spell Recovery":
    "Automatically reapplies lost enchantments when targets enter the caster's vicinity (Small AOE).",

  "Spell Surge":
    "Increases the target enchantment's AOE level by one when the initial recipient already has two or more active enchantments from the caster. Reapply using a Main Action or automatically through Spell Recovery.",

  "Hyper Spell": "Increases the AOE level of Apply Effects by one.",
};

// ==================================================
// COMPONENT
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
  // STATE
  // ==================================================

  const [selectedWeapon, setSelectedWeapon] = useState(0);
  const [baseCost, setBaseCost] = useState(0);

  const [techniques, setTechniques] = useState<Record<TechniqueType, boolean>>({
    ...initialTechniques,
  });

  const [existingEnchantments, setExistingEnchantments] = useState(0);

  const [catalyst, setCatalyst] = useState<CatalystType>("MENTAL");

  const [damageType, setDamageType] = useState<DamageType>("PRESSURE");

  const [weaponDamage, setWeaponDamage] = useState(0);
  const [unleashDamage, setUnleashDamage] = useState(0);

  // ==================================================
  // TECHNIQUE FLAGS
  // ==================================================

  const spellReflex = techniques["Spell Reflex"];
  const autoCast = techniques["Auto Cast"];
  const counterSpell = techniques["Counter Spell"];
  const fullCast = techniques["Full Cast"];
  const auraSurge = techniques["Aura Surge"];
  const spellRecovery = techniques["Spell Recovery"];
  const spellSurge = techniques["Spell Surge"];
  const hyperSpell = techniques["Hyper Spell"];

  // ==================================================
  // MASTERY
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const rates = masteryRates[mastery];

  // ==================================================
  // APPLIED WEAPON
  // ==================================================

  const selectedEffect = appliedWeapons[selectedWeapon] ?? appliedWeapons[0];

  // ==================================================
  // COST & TTT CALCULATIONS
  // ==================================================

  const cost = Math.ceil(baseCost * rates.cost);

  const ttt = Math.ceil(baseCost * rates.ttt);

  // ==================================================
  // DEFENSIVE ACTION CALCULATIONS
  // ==================================================

  // Counter Spell is required for both
  // Spell Reflex and Auto Cast.

  const defensiveCastingAvailable = counterSpell;

  const defensiveActionCost = counterSpell ? (autoCast ? 0 : 1) : null;

  const defensiveUsesPerTurn = counterSpell ? (spellReflex ? 2 : 1) : 0;

  // ==================================================
  // AOE CALCULATIONS
  // ==================================================

  const surgeEligible = active && spellSurge && existingEnchantments >= 2;

  const hyperAOEIncrease = hyperSpell ? 1 : 0;

  const surgeAOEIncrease = surgeEligible ? 1 : 0;

  const totalAOEIncrease = hyperAOEIncrease + surgeAOEIncrease;

  // ==================================================
  // FULL CAST CALCULATIONS
  // ==================================================

  const additionalInteractActions = active && fullCast ? 1 : 0;

  // Full Cast grants the action on the first cast.
  // Using that action removes the enchantment.
  // Actual turn tracking is handled by the combat system.

  // ==================================================
  // AURA SURGE CALCULATIONS
  // ==================================================

  const catalystMatches = catalystDamageTypes[catalyst].includes(damageType);

  const auraEligible = active && auraSurge && catalystMatches;

  const auraMultiplier = auraEligible ? 1 + AURA_SURGE_SCALING : 1;

  const weaponBonus = weaponDamage * (auraMultiplier - 1);

  const unleashBonus = unleashDamage * (auraMultiplier - 1);

  const finalWeaponDamage = weaponDamage * auraMultiplier;

  const finalUnleashDamage = unleashDamage * auraMultiplier;

  const displayDamage = (value: number) => Number(value.toFixed(2));

  // ==================================================
  // PARENT SPELL UPDATE
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? cost : 0);
    updateSpell("ttt", active ? ttt : 0);
  }, [active, cost, ttt, updateSpell]);

  // ==================================================
  // RESET
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedWeapon(0);
      setBaseCost(0);

      setTechniques({ ...initialTechniques });

      setExistingEnchantments(0);

      setCatalyst("MENTAL");
      setDamageType("PRESSURE");

      setWeaponDamage(0);
      setUnleashDamage(0);
    }
  }, [active]);

  // ==================================================
  // HANDLERS
  // ==================================================

  const changeBaseCost = (value: number) => {
    setBaseCost(Math.min(MAX_BASE_COST, Math.max(0, Math.trunc(value || 0))));
  };

  const changeExistingEnchantments = (value: number) => {
    setExistingEnchantments(Math.max(0, Math.trunc(value || 0)));
  };

  const changeDamage = (value: number, setter: (value: number) => void) => {
    setter(Number.isFinite(value) ? Math.max(0, value) : 0);
  };

  // ==================================================
  // TECHNIQUE HANDLER
  // ==================================================

  const toggleTechnique = (technique: TechniqueType) => {
    setTechniques((previous) => {
      const next = { ...previous };

      // Counter Spell controls the prerequisites
      // for Spell Reflex and Auto Cast.

      if (technique === "Counter Spell") {
        next["Counter Spell"] = !previous["Counter Spell"];

        if (!next["Counter Spell"]) {
          next["Spell Reflex"] = false;
          next["Auto Cast"] = false;
        }

        return next;
      }

      // Spell Reflex and Auto Cast cannot be
      // activated without Counter Spell.

      if (
        (technique === "Spell Reflex" || technique === "Auto Cast") &&
        !previous["Counter Spell"]
      ) {
        return previous;
      }

      next[technique] = !previous[technique];

      return next;
    });
  };

  // ==================================================
  // TECHNIQUE BUTTON STYLING
  // ==================================================

  const techniqueButtonClass = (enabled: boolean, disabled = false) =>
    `shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
      disabled
        ? "cursor-not-allowed bg-gray-900 text-gray-600"
        : enabled
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
        <SparklesIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Apply Effect</h1>
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

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <div className="flex flex-wrap gap-2">
            {techniqueNames.map((technique) => {
              const requiresCounterSpell =
                technique === "Spell Reflex" || technique === "Auto Cast";

              const disabled = requiresCounterSpell && !counterSpell;

              return (
                <button
                  key={technique}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleTechnique(technique)}
                  aria-pressed={techniques[technique]}
                  title={disabled ? "Requires Counter Spell" : undefined}
                  className={techniqueButtonClass(
                    techniques[technique],
                    disabled,
                  )}
                >
                  {technique}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================== */}
        {/* TECHNIQUE DESCRIPTIONS */}
        {/* ================================================== */}

        {techniqueNames.some((technique) => techniques[technique]) && (
          <div className="mb-5 space-y-3">
            {techniqueNames
              .filter((technique) => techniques[technique])
              .map((technique) => (
                <div
                  key={technique}
                  className="rounded-lg border border-purple-800 bg-purple-950/30 p-3"
                >
                  <p className="text-sm leading-relaxed text-gray-300">
                    <strong className="text-purple-400">{technique}:</strong>{" "}
                    {techniqueDescriptions[technique]}
                  </p>
                </div>
              ))}
          </div>
        )}

        {/* ================================================== */}
        {/* SPELL STATISTICS */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Mastery */}

          <div className="flex justify-between gap-3">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          {/* Applied Effect */}

          <div className="flex justify-between gap-3">
            <span>Applied Weapon Effect</span>

            <span className="text-right font-semibold text-cyan-400">
              {selectedEffect?.label ?? "None"}
            </span>
          </div>

          {/* Base Cost */}

          <div className="flex justify-between gap-3">
            <span>Base Applied Spell Cost</span>

            <span className="font-semibold text-cyan-400">{baseCost}</span>
          </div>

          {/* Mana Multiplier */}

          <div className="flex justify-between gap-3">
            <span>Mana Cost Multiplier</span>

            <span className="font-semibold text-cyan-400">
              {Math.round(rates.cost * 100)}%
            </span>
          </div>

          {/* TTT Multiplier */}

          <div className="flex justify-between gap-3">
            <span>TTT Multiplier</span>

            <span className="font-semibold text-cyan-400">
              {Math.round(rates.ttt * 100)}%
            </span>
          </div>

          {/* ================================================== */}
          {/* DEFENSIVE CASTING STATISTICS */}
          {/* ================================================== */}

          {defensiveCastingAvailable && (
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

          {/* ================================================== */}
          {/* FULL CAST STATISTICS */}
          {/* ================================================== */}

          {fullCast && (
            <>
              <div className="flex justify-between gap-3">
                <span>Additional Interact Actions</span>

                <span className="font-semibold text-purple-400">
                  +{additionalInteractActions}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Activation</span>

                <span className="font-semibold text-cyan-400">FIRST CAST</span>
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

          {/* ================================================== */}
          {/* AURA SURGE STATISTICS */}
          {/* ================================================== */}

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

          {/* ================================================== */}
          {/* SPELL RECOVERY STATISTICS */}
          {/* ================================================== */}

          {spellRecovery && (
            <>
              <div className="flex justify-between gap-3">
                <span>Automatic Reapplication</span>

                <span className="font-semibold text-purple-400">ENABLED</span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Recovery AOE</span>

                <span className="font-semibold text-cyan-400">SMALL</span>
              </div>
            </>
          )}

          {/* ================================================== */}
          {/* SPELL SURGE STATISTICS */}
          {/* ================================================== */}

          {spellSurge && (
            <>
              <div className="flex justify-between gap-3">
                <span>Existing Enchantments</span>

                <span className="font-semibold text-cyan-400">
                  {existingEnchantments}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Spell Surge Eligibility</span>

                <span
                  className={`font-semibold ${
                    surgeEligible ? "text-purple-400" : "text-gray-500"
                  }`}
                >
                  {surgeEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
                </span>
              </div>
            </>
          )}

          {/* ================================================== */}
          {/* AOE STATISTICS */}
          {/* ================================================== */}

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

          {/* ================================================== */}
          {/* FINAL COST */}
          {/* ================================================== */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Mana Cost</span>

            <span className="text-lg font-bold text-orange-400">{cost}</span>
          </div>

          {/* ================================================== */}
          {/* FINAL TTT */}
          {/* ================================================== */}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-gray-100">Final TTT</span>

            <span className="text-lg font-bold text-orange-400">{ttt}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* APPLIED WEAPON SELECTION */}
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
      {/* APPLIED SPELL COST CONFIGURATION */}
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
          based on Mastery.
        </p>

        <p className="mt-1 text-sm leading-relaxed text-gray-400">
          TTT:{" "}
          <span className="font-semibold text-cyan-400">30% / 20% / 10%</span>{" "}
          based on Mastery.
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
      {/* DEFENSIVE CASTING CONFIGURATION */}
      {/* ================================================== */}

      {(counterSpell || spellReflex || autoCast) && (
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
            Counter Spell enables defensive casting. Spell Reflex allows two
            uses per turn. Auto Cast removes the Defensive Action cost.
          </p>
        </div>
      )}

      {/* ================================================== */}
      {/* FULL CAST CONFIGURATION */}
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

              <span className="font-semibold text-purple-400">
                +{additionalInteractActions}
              </span>
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
      {/* AURA SURGE CONFIGURATION */}
      {/* ================================================== */}

      {auraSurge && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Aura Surge Configuration
          </h3>

          <p className="mb-4 text-sm leading-relaxed text-gray-300">
            Channel a catalyst to add 30% positive scaling to weapon and UNLEASH
            damage of the corresponding damage type while the weapon enchantment
            is active.
          </p>

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

          {/* ================================================== */}
          {/* AURA SURGE SUMMARY */}
          {/* ================================================== */}

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
              <span>Weapon Damage Bonus</span>

              <span className="font-semibold text-purple-400">
                +{displayDamage(weaponBonus)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>Final Weapon Damage</span>

              <span className="font-semibold text-cyan-400">
                {displayDamage(finalWeaponDamage)}
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
      {/* SPELL RECOVERY CONFIGURATION */}
      {/* ================================================== */}

      {spellRecovery && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Spell Recovery Configuration
          </h3>

          <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
            <div className="flex justify-between gap-3">
              <span>Automatic Reapplication</span>

              <span className="font-semibold text-purple-400">ENABLED</span>
            </div>

            <div className="flex justify-between gap-3">
              <span>Vicinity AOE</span>

              <span className="font-semibold text-cyan-400">SMALL</span>
            </div>

            <div className="flex justify-between gap-3">
              <span>Trigger</span>

              <span className="font-semibold text-cyan-400">
                TARGET ENTERS VICINITY
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            Lost enchantments are automatically reapplied when their targets
            enter the caster's vicinity.
          </p>
        </div>
      )}

      {/* ================================================== */}
      {/* SPELL SURGE CONFIGURATION */}
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
                ? "The target qualifies for a +1 AOE level increase when the same enchantment is reapplied."
                : "The target must already have at least two active enchantments from the caster."}
            </p>
          </div>

          {/* Reapplication Method */}

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
      {/* AOE CONFIGURATION */}
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
            Hyper Spell and eligible Spell Surge increases stack as AOE level
            adjustments.
          </p>
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
            Applies a selected spell effect to a weapon. The Mana cost and TTT
            requirement are calculated as percentages of the applied spell's
            base cost.
          </p>

          <p>Novice: 70% Mana Cost and 30% TTT.</p>

          <p>Intermediate: 50% Mana Cost and 20% TTT.</p>

          <p>Mastered: 30% Mana Cost and 10% TTT.</p>

          <p>Spell Reflex and Auto Cast require Counter Spell.</p>

          <p>
            Full Cast grants an additional Interact Action once per turn on the
            first cast of the weapon enchantment. Using that action removes the
            enchantment.
          </p>

          <p>
            Aura Surge provides 30% positive scaling to matching weapon and
            UNLEASH damage.
          </p>
        </div>
      </div>
    </>
  );
};

export default ApplyEffectW;
