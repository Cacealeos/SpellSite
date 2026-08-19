import React, { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const AugmentMagnetism = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ==================================================
  // Constants
  // ==================================================

  const AOE = ["SMALL", "MODERATE", "LARGE", "MASSIVE"];

  // ==================================================
  // State
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [increments, setIncrement] = useState(0);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  // ==================================================
  // Potency Statistics
  // ==================================================

  const potencyStats = {
    MINOR: {
      base: 50,
      power: 3,
      aoe: 0,
      charge: 3,
      damage: 15,

      NOVICE: {
        cost: 90,
        costModifier: 30,
      },
      INTERMEDIATE: {
        cost: 75,
        costModifier: 25,
      },
      MASTERED: {
        cost: 60,
        costModifier: 20,
      },
    },

    MAJOR: {
      base: 100,
      power: 4,
      aoe: 1,
      charge: 5,
      damage: 20,

      NOVICE: {
        cost: 185,
        costModifier: 42,
      },
      INTERMEDIATE: {
        cost: 155,
        costModifier: 35,
      },
      MASTERED: {
        cost: 125,
        costModifier: 28,
      },
    },

    EXTREME: {
      base: 175,
      power: 6,
      aoe: 2,
      charge: 7,
      damage: 25,

      NOVICE: {
        cost: 330,
        costModifier: 48,
      },
      INTERMEDIATE: {
        cost: 280,
        costModifier: 40,
      },
      MASTERED: {
        cost: 230,
        costModifier: 32,
      },
    },
  };

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
      description: `Cost: ${potencyStats.MINOR.NOVICE.cost} / ${potencyStats.MINOR.INTERMEDIATE.cost} / ${potencyStats.MINOR.MASTERED.cost}`,
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: `Cost: ${potencyStats.MAJOR.NOVICE.cost} / ${potencyStats.MAJOR.INTERMEDIATE.cost} / ${potencyStats.MAJOR.MASTERED.cost}`,
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: `Cost: ${potencyStats.EXTREME.NOVICE.cost} / ${potencyStats.EXTREME.INTERMEDIATE.cost} / ${potencyStats.EXTREME.MASTERED.cost}`,
    },
  ];

  return (
    <>
      {/* ==================================================
          Spell Title
          ================================================== */}

      <h2 className="mb-6 text-center text-3xl font-bold text-cyan-400">
        Augment Entropy or Magnetism
      </h2>

      {/* ==================================================
          Potency
          ================================================== */}

      <div>
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* ==================================================
          Augmentation
          ================================================== */}

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
                Math.min(3, Math.max(0, Number(e.target.value) || 0)),
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

            <span className="font-semibold text-cyan-400">0% / 30%</span>
          </div>

          <div className="flex justify-between">
            <span>Additional Cost</span>

            <span className="font-semibold text-cyan-400">
              +{masteryStats.costModifier * increments}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          Spell Properties
          ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Spell Properties
        </h3>

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
              {currentStats.charge}
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

            <span className="font-semibold text-cyan-400">0% / 30%</span>
          </div>

          <div className="flex justify-between">
            <span>Damage Type</span>

            <span className="font-semibold text-cyan-400">
              ELECTRIC OR PRESSURE DAMAGE
            </span>
          </div>

          <div className="flex justify-between">
            <span>Range</span>

            <span className="font-semibold text-cyan-400">RADIAL / CLOUD</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Final Cost</span>

            <span className="font-semibold text-cyan-400">
              {currentStats.cost}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AugmentMagnetism;
