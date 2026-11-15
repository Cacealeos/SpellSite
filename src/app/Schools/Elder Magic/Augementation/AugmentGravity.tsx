import { useEffect, useState } from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Soul Cast": false,
  "Full Cast ": false,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Aura Surge": false,
};

// ==================================================
// Potency Statistics
// ==================================================

const potencyStats = {
  MINOR: {
    base: 40,
    power: 2,
    aoe: 0,
    charge: 3,
    damage: 10,
    NOVICE: { cost: 90, costModifier: 30 },
    INTERMEDIATE: { cost: 75, costModifier: 25 },
    MASTERED: { cost: 60, costModifier: 20 },
  },
  MAJOR: {
    base: 80,
    power: 3,
    aoe: 1,
    charge: 5,
    damage: 15,
    NOVICE: { cost: 185, costModifier: 42 },
    INTERMEDIATE: { cost: 155, costModifier: 35 },
    MASTERED: { cost: 125, costModifier: 28 },
  },
  EXTREME: {
    base: 140,
    power: 4,
    aoe: 2,
    charge: 7,
    damage: 20,
    NOVICE: { cost: 330, costModifier: 48 },
    INTERMEDIATE: { cost: 280, costModifier: 40 },
    MASTERED: { cost: 230, costModifier: 32 },
  },
};

const AOE = ["SMALL", "MODERATE", "LARGE", "MASSIVE"];

// ==================================================
// Component
// ==================================================

const AugmentGravity = ({
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

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [increments, setIncrement] = useState(0);

  const [autoCast, setAutoCast] = useState(true);
  const [spellCharge, setSpellCharge] = useState(false);
  const [extraChargeTurns, setExtraChargeTurns] = useState(0);

  const [spellRecovery, setSpellRecovery] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  // ==================================================
  // Selected Statistics
  // ==================================================

  const selectedStats = potencyStats[selectedPotency];
  const masteryStats = selectedStats[mastery];

  // ==================================================
  // Power Limit
  // ==================================================

  // Augmentation spells may gain at most +1 Power
  // above their initial Potency-based Power.
  //
  // Augmentation and Hyper Spell share this limit.

  const maxPower = selectedStats.power + 1;

  const augmentationPower = selectedStats.power + (increments > 0 ? 1 : 0);

  const finalPower = Math.min(
    maxPower,
    augmentationPower + (hyperSpell ? 1 : 0),
  );

  // ==================================================
  // Derived Increment Statistics
  // ==================================================

  const currentStats = {
    base: selectedStats.base + selectedStats.damage * increments,

    power: finalPower,

    aoe:
      increments > 1
        ? Math.min(selectedStats.aoe + 1, AOE.length - 1)
        : selectedStats.aoe,

    charge: selectedStats.charge + (increments > 1 ? 1 : 0),

    damage: selectedStats.damage,

    cost: masteryStats.cost + masteryStats.costModifier * increments,
  };

  // ==================================================
  // Hyper Spell Calculation
  // ==================================================

  // Hyper Spell reduces Manna cost by 30%.
  // Augment Gravity is treated as non-Dimensional.

  const normalCost = currentStats.cost;

  const finalCost = hyperSpell ? Math.ceil(normalCost * 0.7) : normalCost;

  const hyperSpellSavings = normalCost - finalCost;

  const hyperPowerBonus = finalPower - augmentationPower;

  // ==================================================
  // Spell Recovery Calculation
  // ==================================================

  // Recovery uses 50% of the current casting cost.
  // It does not replace the normal spell cost.
  //
  // Sustained effects retain their charge progress
  // when Spell Recovery is used.

  const recoveryCost = Math.ceil(finalCost * 0.5);

  // ==================================================
  // Spell Charge & Scaling Calculations
  // ==================================================

  const chargeTurns = spellCharge ? extraChargeTurns : 0;

  const positiveScaling = chargeTurns * 10;

  const totalChargeTime = currentStats.charge + chargeTurns;

  // ==================================================
  // Actual Damage Scaling
  // ==================================================

  const totalDamage = currentStats.base;

  const positiveScalingDamage = totalDamage * (positiveScaling / 100);

  const negativeScalingDamage = totalDamage * 0.5;

  const scalingDisplay = `${positiveScalingDamage} / ${negativeScalingDamage}`;

  // ==================================================
  // Reset Techniques
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSpellRecovery(false);
      setHyperSpell(false);
    }
  }, [active]);

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", finalCost);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description:
        `Cost: ${potencyStats.MINOR.NOVICE.cost} / ` +
        `${potencyStats.MINOR.INTERMEDIATE.cost} / ` +
        `${potencyStats.MINOR.MASTERED.cost}`,
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description:
        `Cost: ${potencyStats.MAJOR.NOVICE.cost} / ` +
        `${potencyStats.MAJOR.INTERMEDIATE.cost} / ` +
        `${potencyStats.MAJOR.MASTERED.cost}`,
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description:
        `Cost: ${potencyStats.EXTREME.NOVICE.cost} / ` +
        `${potencyStats.EXTREME.INTERMEDIATE.cost} / ` +
        `${potencyStats.EXTREME.MASTERED.cost}`,
    },
  ];

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <AdjustmentsHorizontalIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Augment Gravity</h1>
      </div>

      {/* ================================================== */}
      {/* Spell Techniques Table */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* Potency */}
      {/* ================================================== */}

      <div className="mt-6">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* ================================================== */}
      {/* Augmentation */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Augmentation
        </h3>

        <label>
          <span className="text-gray-300">Increments</span>

          <input
            type="number"
            min={0}
            max={3}
            step={1}
            value={increments}
            onChange={(e) =>
              setIncrement(
                Math.min(
                  3,
                  Math.max(0, Math.trunc(Number(e.target.value) || 0)),
                ),
              )
            }
            className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
          />
        </label>

        <div className="mt-5 space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Base</span>

            <span className="font-semibold text-cyan-400">
              {selectedStats.base}
              {increments > 0 && ` → ${currentStats.base}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Power</span>

            <span className="font-semibold text-cyan-400">
              {selectedStats.power}
              {currentStats.power !== selectedStats.power &&
                ` → ${currentStats.power}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Area of Effect</span>

            <span className="font-semibold text-cyan-400">
              {AOE[selectedStats.aoe]}
              {increments > 1 && ` → ${AOE[currentStats.aoe]}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Charge Time</span>

            <span className="font-semibold text-cyan-400">
              {selectedStats.charge}
              {increments > 1 && ` → ${currentStats.charge}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Damage</span>

            <span className="font-semibold text-cyan-400">
              +{selectedStats.damage * increments}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Scaling</span>

            <span className="font-semibold text-cyan-400">
              {scalingDisplay}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Additional Cost</span>

            <span className="font-semibold text-cyan-400">
              +{masteryStats.costModifier * increments}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Spell Properties */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        {/* ================================================== */}
        {/* Spell Properties Header / Technique Buttons */}
        {/* ================================================== */}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <div className="flex flex-wrap gap-2">
            {/* Spell Charge */}

            <button
              type="button"
              aria-pressed={spellCharge}
              onClick={() => {
                setSpellCharge((prev) => !prev);
                setExtraChargeTurns(0);
              }}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                spellCharge
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-yellow-600 hover:text-white"
              }`}
            >
              Spell Charge
            </button>

            {/* Spell Recovery */}

            <button
              type="button"
              aria-pressed={spellRecovery}
              onClick={() => setSpellRecovery((prev) => !prev)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                spellRecovery
                  ? "bg-purple-700 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-700 hover:text-white"
              }`}
            >
              Spell Recovery
            </button>

            {/* Hyper Spell */}

            <button
              type="button"
              aria-pressed={hyperSpell}
              onClick={() => setHyperSpell((prev) => !prev)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                hyperSpell
                  ? "bg-fuchsia-700 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-fuchsia-700 hover:text-white"
              }`}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Auto Cast Caption */}
        {/* ================================================== */}

        {autoCast && (
          <p className="mb-4 text-sm text-green-400">
            Auto Cast: Casting Augmentation spells does not occupy a spell slot.
          </p>
        )}

        {/* ================================================== */}
        {/* Spell Charge */}
        {/* ================================================== */}

        {spellCharge && (
          <div className="mb-5">
            <p className="mb-4 text-sm text-yellow-400">
              Spell Charge increases positive scaling by 10% of total damage for
              each additional turn spent casting, up to 50%. Additional turns
              begin after all required charges have been completed.
            </p>

            <label className="block">
              <span className="mb-2 block text-sm text-gray-300">
                Additional Charge Turns (0–5)
              </span>

              <input
                type="number"
                min={0}
                max={5}
                step={1}
                value={extraChargeTurns}
                onChange={(e) =>
                  setExtraChargeTurns(
                    Math.min(
                      5,
                      Math.max(0, Math.trunc(Number(e.target.value) || 0)),
                    ),
                  )
                }
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-yellow-500 focus:outline-none"
              />
            </label>

            <div className="mt-4 space-y-2 rounded-md border border-gray-700 bg-gray-900 p-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Required Charges</span>

                <span className="font-semibold text-cyan-400">
                  {currentStats.charge}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">Additional Turns</span>

                <span className="font-semibold text-yellow-400">
                  +{chargeTurns}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">Positive Scaling Bonus</span>

                <span className="font-semibold text-yellow-400">
                  +{positiveScaling}%
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-700 pt-3">
                <span className="font-semibold text-gray-200">
                  Total Charge Time
                </span>

                <span className="font-bold text-yellow-400">
                  {totalChargeTime}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Recovery Description */}
        {/* ================================================== */}

        {spellRecovery && (
          <div className="mb-5 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <p>
              <span className="font-semibold">Spell Recovery:</span> Lost spells
              may be re-cast for 50% of their Manna cost. Sustained effects
              retain their accumulated charges instead of resetting.
            </p>

            <p className="mt-2 text-xs text-purple-300">
              Recovery Cost:{" "}
              <span className="font-semibold text-purple-200">
                {recoveryCost} Manna
              </span>
            </p>

            <p className="mt-1 text-xs text-purple-300">
              Required Charges Retained:{" "}
              <span className="font-semibold text-purple-200">
                {currentStats.charge}
              </span>
            </p>
          </div>
        )}

        {/* ================================================== */}
        {/* Hyper Spell Description */}
        {/* ================================================== */}

        {hyperSpell && (
          <div className="mb-5 rounded-lg border border-fuchsia-700 bg-fuchsia-950/30 p-4 text-sm text-fuchsia-200">
            <p>
              <span className="font-semibold">Hyper Spell:</span> Reduces the
              Manna cost of non-Dimensional spells by 30% and increases Power by
              1 when possible, without exceeding the spell's maximum.
            </p>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Normal Cost</span>

                <span className="font-semibold">{normalCost} Manna</span>
              </div>

              <div className="flex justify-between">
                <span>Manna Saved</span>

                <span className="font-semibold">{hyperSpellSavings} Manna</span>
              </div>

              <div className="flex justify-between">
                <span>Hyper Spell Cost</span>

                <span className="font-semibold">{finalCost} Manna</span>
              </div>

              <div className="flex justify-between">
                <span>Power Increase</span>

                <span className="font-semibold">+{hyperPowerBonus}</span>
              </div>

              <div className="flex justify-between">
                <span>Maximum Power</span>

                <span className="font-semibold">{maxPower}</span>
              </div>
            </div>

            {hyperPowerBonus === 0 && (
              <p className="mt-3 text-xs text-fuchsia-300">
                Power is already at its maximum. The 30% Manna discount still
                applies.
              </p>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* Final Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Base</span>

            <span className="font-semibold text-cyan-400">
              {currentStats.base}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Power</span>

            <span className="font-semibold text-cyan-400">
              {currentStats.power}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Area of Effect</span>

            <span className="font-semibold text-cyan-400">
              {AOE[currentStats.aoe]}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Charge Time</span>

            <span className="font-semibold text-cyan-400">
              {totalChargeTime}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Damage</span>

            <span className="font-semibold text-cyan-400">
              +{currentStats.damage * increments}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Scaling</span>

            <span className="font-semibold text-cyan-400">
              {scalingDisplay}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Damage Type</span>

            <span className="font-semibold text-cyan-400">GRAVITY DAMAGE</span>
          </div>

          <div className="flex justify-between">
            <span>Range</span>

            <span className="font-semibold text-cyan-400">RADIAL / CLOUD</span>
          </div>

          <div className="flex justify-between">
            <span>Spell Slot</span>

            <span className="font-semibold text-cyan-400">
              {autoCast ? "Not Occupied" : "Occupied"}
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Final Cost</span>

            <span className="font-semibold text-orange-400">{finalCost}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AugmentGravity;
