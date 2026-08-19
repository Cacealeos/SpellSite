import React, { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const InstillPremonition = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ==================================================
  // Potency Data
  // ==================================================

  const potencyStats = {
    MINOR: {
      NOVICE: {
        cost: 20,
        base: 1,
      },
      INTERMEDIATE: {
        cost: 15,
        base: 1,
      },
      MASTERED: {
        cost: 10,
        base: 1,
      },
    },
    MAJOR: {
      NOVICE: {
        cost: 35,
        base: 3,
      },
      INTERMEDIATE: {
        cost: 30,
        base: 3,
      },
      MASTERED: {
        cost: 25,
        base: 3,
      },
    },
    EXTREME: {
      NOVICE: {
        cost: 50,
        base: 5,
      },
      INTERMEDIATE: {
        cost: 45,
        base: 5,
      },
      MASTERED: {
        cost: 40,
        base: 5,
      },
    },
  };

  // ==================================================
  // State
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const currentStats = potencyStats[selectedPotency][mastery];

  // ==================================================
  // Potency Selector Options
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

  // ==================================================
  // Spell State
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
    }
  }, [active, updateSpell]);

  useEffect(() => {
    if (!active) return;

    updateSpell("cost", currentStats.cost);
  }, [active, currentStats.cost, updateSpell]);

  // ==================================================
  // UI
  // ==================================================

  return (
    <>
      <h2 className="mb-6 text-center text-3xl font-bold text-cyan-400">
        Instill Premonition
      </h2>

      {/* ==================================================
    Spell Properties & Final Statistics
    ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Properties
        </h3>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Range</span>
            <span className="font-semibold text-cyan-400">DIRECT</span>
          </div>

          <div className="flex justify-between">
            <span>Bonus</span>
            <span className="font-semibold text-cyan-400">
              +{currentStats.base}
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Cost</span>
            <span className="font-semibold text-cyan-400">
              {currentStats.cost}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          Potency
          ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Potency
        </h3>

        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>
    </>
  );
};

export default InstillPremonition;
