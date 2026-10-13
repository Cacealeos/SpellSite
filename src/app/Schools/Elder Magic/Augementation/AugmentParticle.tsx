import { useEffect, useState } from "react";
import { CircleStackIcon } from "@heroicons/react/24/solid";

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
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Constants
// ==================================================

const AOE = ["SMALL", "MODERATE", "LARGE", "MASSIVE"];

// ==================================================
// Potency Statistics
// ==================================================

const potencyStats = {
  MINOR: {
    base: 60,
    power: 3,
    aoe: 0,
    charge: 3,
    damage: 15,
    NOVICE: { cost: 96, costModifier: 30 },
    INTERMEDIATE: { cost: 80, costModifier: 25 },
    MASTERED: { cost: 64, costModifier: 20 },
  },
  MAJOR: {
    base: 125,
    power: 4,
    aoe: 1,
    charge: 5,
    damage: 20,
    NOVICE: { cost: 225, costModifier: 48 },
    INTERMEDIATE: { cost: 185, costModifier: 40 },
    MASTERED: { cost: 145, costModifier: 32 },
  },
  EXTREME: {
    base: 215,
    power: 6,
    aoe: 2,
    charge: 7,
    damage: 25,
    NOVICE: { cost: 425, costModifier: 60 },
    INTERMEDIATE: { cost: 355, costModifier: 50 },
    MASTERED: { cost: 285, costModifier: 40 },
  },
};

// ==================================================
// Component
// ==================================================

const AugmentParticle = ({
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
  // Derived Increment Statistics
  // ==================================================

  const currentStats = {
    base: selectedStats.base + selectedStats.damage * increments,

    power: selectedStats.power + (increments > 0 ? 1 : 0),

    aoe:
      increments > 1
        ? Math.min(selectedStats.aoe + 1, AOE.length - 1)
        : selectedStats.aoe,

    charge: selectedStats.charge + (increments > 1 ? 1 : 0),

    damage: selectedStats.damage,

    cost: masteryStats.cost + masteryStats.costModifier * increments,
  };

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

  const negativeScalingDamage = totalDamage * 0.25;

  const scalingDisplay = `${positiveScalingDamage} / ${negativeScalingDamage}`;

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", currentStats.cost);
  }, [active, currentStats.cost, updateSpell]);

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
        <CircleStackIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Augment Particle</h1>
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
              {increments > 0 && ` → ${currentStats.power}`}
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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-cyan-400">
            Spell Properties
          </h3>

          {/* ================================================== */}
          {/* Technique Buttons */}
          {/* ================================================== */}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAutoCast(!autoCast)}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                autoCast
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-green-600 hover:text-white"
              }`}
            >
              Auto Cast
            </button>

            <button
              type="button"
              onClick={() => {
                setSpellCharge(!spellCharge);
                setExtraChargeTurns(0);
              }}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                spellCharge
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-yellow-600 hover:text-white"
              }`}
            >
              Spell Charge
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
                  +{positiveScalingDamage}
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

            <span className="font-semibold text-cyan-400">
              EXPLOSIVE OR ELECTRIC DAMAGE
            </span>
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

            <span className="font-semibold text-orange-400">
              {currentStats.cost}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AugmentParticle;
