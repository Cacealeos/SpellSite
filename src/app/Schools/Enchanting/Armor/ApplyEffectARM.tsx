import { useEffect, useState } from "react";
import { SparklesIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import { appliedEffects } from "./ApplyEffect";
import Select from "@/app/Select";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type TechniqueType =
  | "Counter Spell"
  | "Spell Reflex"
  | "Auto Cast"
  | "Hyper Spell"
  | "Spell Recovery"
  | "Spell Surge"
  | "Double Cast";

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

const masteryRates: Record<MasteryType, { cost: number; ttt: number }> = {
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
// Technique Descriptions
// ==================================================

const techniqueDescriptions: Record<TechniqueType, string> = {
  "Counter Spell": "Apply Effects may be applied as a Defensive Action.",

  "Spell Reflex":
    "Apply Effects may be used twice in the same turn as a Defensive Action.",

  "Auto Cast":
    "Apply Effects armor enchantments do not cost a Defensive Action.",

  "Hyper Spell": "Apply Effects have a Small AOE.",

  "Spell Recovery":
    "Automatically reapplies the enchantment when the target enters the caster's vicinity.",

  "Spell Surge":
    "Increases the enchantment's AOE level by one when the initial recipient already has two or more active enchantments from the caster. Reapplication requires a Main Action or can occur automatically through Spell Recovery.",
};

// ==================================================
// Component
// ==================================================

const ApplyEffectA = ({
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

  const [selectedEffect, setSelectedEffect] = useState(0);

  const [baseCost, setBaseCost] = useState(0);

  const [enabledTechniques, setEnabledTechniques] = useState<TechniqueType[]>(
    [],
  );

  const [existingEnchantments, setExistingEnchantments] = useState(0);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const rates = masteryRates[mastery];

  // ==================================================
  // Derived Values
  // ==================================================

  const selectedEffectData =
    appliedEffects[selectedEffect] ?? appliedEffects[0];

  const cost = Math.ceil(baseCost * rates.cost);

  const ttt = Math.ceil(baseCost * rates.ttt);

  // ==================================================
  // Technique Helpers
  // ==================================================

  const hasTechnique = (technique: TechniqueType) =>
    enabledTechniques.includes(technique);

  const toggleTechnique = (technique: TechniqueType) => {
    setEnabledTechniques((previous) =>
      previous.includes(technique)
        ? previous.filter((item) => item !== technique)
        : [...previous, technique],
    );

    if (technique === "Spell Surge") {
      setExistingEnchantments(0);
    }
  };

  // ==================================================
  // Action Calculations
  // ==================================================

  const counterSpell = hasTechnique("Counter Spell");

  const spellReflex = hasTechnique("Spell Reflex");

  const autoCast = hasTechnique("Auto Cast");

  const hyperSpell = hasTechnique("Hyper Spell");

  const spellRecovery = hasTechnique("Spell Recovery");

  const spellSurge = hasTechnique("Spell Surge");

  const surgeEligible = spellSurge && existingEnchantments >= 2;

  const baseAOE = hyperSpell ? "Small" : "None";

  const aoeIncrease = surgeEligible ? 1 : 0;

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
      setSelectedEffect(0);
      setBaseCost(0);
      setEnabledTechniques([]);
      setExistingEnchantments(0);
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const changeBaseCost = (value: number) => {
    setBaseCost(Math.min(300, Math.max(0, Math.trunc(value || 0))));
  };

  const changeExistingEnchantments = (value: number) => {
    setExistingEnchantments(Math.max(0, Math.trunc(value || 0)));
  };

  // ==================================================
  // Technique Button
  // ==================================================

  const TechniqueButton = ({ technique }: { technique: TechniqueType }) => {
    const enabled = hasTechnique(technique);

    return (
      <button
        type="button"
        onClick={() => toggleTechnique(technique)}
        aria-pressed={enabled}
        className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
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
            <TechniqueButton technique="Counter Spell" />
            <TechniqueButton technique="Spell Reflex" />
            <TechniqueButton technique="Auto Cast" />
            <TechniqueButton technique="Hyper Spell" />
            <TechniqueButton technique="Spell Recovery" />
            <TechniqueButton technique="Spell Surge" />
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Descriptions */}
        {/* ================================================== */}

        {enabledTechniques.length > 0 && (
          <div className="mb-5 space-y-3">
            {enabledTechniques.map((technique) => (
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
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Applied Effect */}

          <div className="flex justify-between gap-4">
            <span>Applied Effect</span>

            <span className="text-right font-semibold text-cyan-400">
              {selectedEffectData?.label ?? "None"}
            </span>
          </div>

          {/* Base Cost */}

          <div className="flex justify-between">
            <span>Base Spell Cost</span>

            <span className="font-semibold text-cyan-400">{baseCost}</span>
          </div>

          {/* Cost Rate */}

          <div className="flex justify-between">
            <span>Mana Cost Rate</span>

            <span className="font-semibold text-cyan-400">
              {Math.round(rates.cost * 100)}%
            </span>
          </div>

          {/* TTT Rate */}

          <div className="flex justify-between">
            <span>TTT Rate</span>

            <span className="font-semibold text-cyan-400">
              {Math.round(rates.ttt * 100)}%
            </span>
          </div>

          {/* Action */}

          <div className="flex justify-between gap-4">
            <span>Casting Action</span>

            <span className="text-right font-semibold text-cyan-400">
              {autoCast
                ? "No Defensive Action"
                : counterSpell || spellReflex
                  ? "Defensive Action"
                  : "Standard"}
            </span>
          </div>

          {/* Spell Reflex */}

          {spellReflex && (
            <div className="flex justify-between">
              <span>Defensive Uses per Turn</span>

              <span className="font-semibold text-purple-400">2</span>
            </div>
          )}

          {/* AOE */}

          <div className="flex justify-between">
            <span>Base AOE</span>

            <span className="font-semibold text-cyan-400">{baseAOE}</span>
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

          {/* Final Cost */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Mana Cost</span>

            <span className="text-lg font-bold text-orange-400">{cost}</span>
          </div>

          {/* Final TTT */}

          <div className="flex justify-between">
            <span className="font-semibold text-gray-100">Final TTT</span>

            <span className="text-lg font-bold text-orange-400">{ttt}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Applied Effect Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Applied Effect Configuration
        </h3>

        {/* Effect Selection */}

        <Select
          title="Applied Effects"
          choices={appliedEffects.map((effect) => effect.label)}
          changeChoice={(choice: string) => {
            const index = appliedEffects.findIndex(
              (effect) => effect.label === choice,
            );

            if (index >= 0) {
              setSelectedEffect(index);
            }
          }}
        />

        {/* Selected Effect */}

        {selectedEffectData && (
          <div className="mt-5 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <h4 className="mb-3 border-b border-gray-700 pb-2 text-xl font-bold text-orange-400">
              {selectedEffectData.label}
            </h4>

            <div className="space-y-2">
              {selectedEffectData.info.map((line, index) => (
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
      {/* Base Spell Cost Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Base Spell Cost Configuration
        </h3>

        <label className="block">
          <span className="mb-2 block font-semibold text-gray-300">
            Base Cost of Applied Spell
          </span>

          <input
            type="number"
            min={0}
            max={300}
            step={1}
            value={baseCost}
            onChange={(e) => changeBaseCost(Number(e.target.value))}
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <p className="mt-3 text-sm text-gray-400">
          Cost: 70% / 50% / 30%
          <br />
          TTT: 30% / 20% / 10%
        </p>

        {/* Cost Summary */}

        <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
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
                ? "The target qualifies for an AOE level increase when Apply Effect is reapplied."
                : "At least two existing enchantments from the caster are required."}
            </p>
          </div>

          {/* Reapplication */}

          <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <h4 className="mb-2 font-semibold text-gray-300">
              Reapplication Method
            </h4>

            <p className="text-sm leading-relaxed text-gray-400">
              {spellRecovery
                ? "The enchantment can be reapplied automatically when the target enters the caster's vicinity, or manually using a Main Action."
                : "Reapply the enchantment using a Main Action. Enable Spell Recovery to allow automatic reapplication."}
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

        <div className="flex items-start gap-3">
          <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

          <p className="text-sm leading-relaxed text-gray-300">
            Applies a selected spell effect as an armor enchantment. Mana cost
            and TTT are determined by the base cost of the applied spell and the
            caster's mastery.
          </p>
        </div>
      </div>
    </>
  );
};

export default ApplyEffectA;
