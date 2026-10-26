import { useEffect, useState } from "react";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

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
  "Spell Surge": true,
  "Junction Cast": false,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": false,
  "Auto Cast": false,
  "Rivet Cast": false,
  "Spell Recovery": true,
  "Father Spell": false,
};

// ==================================================
// Potency Data
// ==================================================

const potencyOptions = [
  {
    value: "MINOR",
    label: "Minor",
    description: "20 / 15 / 10",
  },
  {
    value: "MAJOR",
    label: "Major",
    description: "40 / 35 / 30",
  },
  {
    value: "EXTREME",
    label: "Extreme",
    description: "60 / 55 / 50",
  },
];

// ==================================================
// Mana Cost Data
// ==================================================

const potencyCosts: Record<PotencyType, Record<MasteryType, number>> = {
  MINOR: {
    NOVICE: 20,
    INTERMEDIATE: 15,
    MASTERED: 10,
  },
  MAJOR: {
    NOVICE: 40,
    INTERMEDIATE: 35,
    MASTERED: 30,
  },
  EXTREME: {
    NOVICE: 60,
    INTERMEDIATE: 55,
    MASTERED: 50,
  },
};

// ==================================================
// Component
// ==================================================

const InstillMotion = ({
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

  const [selectedPotency, setSelectedPotency] = useState<PotencyType>("MINOR");

  const [spellRecovery, setSpellRecovery] = useState(false);

  const [spellSurge, setSpellSurge] = useState(false);

  const [existingEnchantments, setExistingEnchantments] = useState(0);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  // ==================================================
  // Cost Calculations
  // ==================================================

  const cost = potencyCosts[selectedPotency][mastery];

  // ==================================================
  // Spell Surge Calculations
  // ==================================================

  const surgeEligible = spellSurge && existingEnchantments >= 2;

  const aoeIncrease = surgeEligible ? 1 : 0;

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? cost : 0);
    updateSpell("ttt", 0);
  }, [active, cost, updateSpell]);

  // ==================================================
  // Potency Update
  // ==================================================

  useEffect(() => {
    if (!active) return;

    const potency = new Potency();

    switch (selectedPotency) {
      case "MINOR":
        potency.minor();
        break;

      case "MAJOR":
        potency.major();
        break;

      case "EXTREME":
        potency.extreme();
        break;
    }

    updateSpell("potency", potency);
  }, [active, selectedPotency, updateSpell]);

  // ==================================================
  // Reset When Inactive
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
      setSpellRecovery(false);
      setSpellSurge(false);
      setExistingEnchantments(0);
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

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
        <ArrowsPointingOutIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Instill Motion</h1>
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
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Descriptions */}
        {/* ================================================== */}

        {(spellRecovery || spellSurge) && (
          <div className="mb-5 space-y-3">
            {/* Spell Recovery */}

            {spellRecovery && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Recovery:</strong>{" "}
                  Automatically reapplies the Instill Motion enchantment when
                  the target enters the caster's vicinity.
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
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Potency */}

          <div className="flex justify-between gap-3">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">
              {selectedPotency}
            </span>
          </div>

          {/* Motion Effect */}

          <div className="flex justify-between gap-3">
            <span>Motion Effect</span>

            <span className="font-semibold text-cyan-400">
              Animate / Resist
            </span>
          </div>

          {/* Scaling */}

          <div className="flex justify-between gap-3">
            <span>Scaling</span>

            <span className="text-right font-semibold text-cyan-400">
              Mass / Energy Tolerance
            </span>
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

          {/* Final Mana Cost */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Mana Cost</span>

            <span className="text-lg font-bold text-orange-400">{cost}</span>
          </div>

          {/* TTT */}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-gray-100">TTT</span>

            <span className="text-lg font-bold text-orange-400">0</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Potency Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Potency Configuration
        </h3>

        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />

        {/* Potency Summary */}

        <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between text-gray-300">
            <span>Selected Potency</span>

            <span className="font-semibold text-cyan-400">
              {selectedPotency}
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3 text-gray-300">
            <span className="font-semibold text-gray-100">
              Calculated Mana Cost
            </span>

            <span className="text-lg font-bold text-orange-400">{cost}</span>
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
                ? "The target qualifies for a +1 AOE level increase when Instill Motion is reapplied."
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
                ? "Instill Motion can be reapplied automatically when the target enters the caster's vicinity, or manually using a Main Action."
                : "Reapply Instill Motion using a Main Action. Enable Spell Recovery to allow automatic reapplication when the target enters the caster's vicinity."}
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
            Animate an object or objects to produce motion or resist motion.
          </p>

          <p>
            Potency scales with the level of mass being moved or the total
            energy tolerance for resisting movement.
          </p>
        </div>
      </div>
    </>
  );
};

export default InstillMotion;
