import React, { useEffect, useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import Select from "@/app/Select";

const AlterSpatial = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [size, setSize] = useState("Small AOE");

  const testMastery = new Mastery();

  const potencyStats = {
    MINOR: {
      NOVICE: { cost: 60, base: 6 },
      INTERMEDIATE: { cost: 45, base: 6 },
      MASTERED: { cost: 30, base: 6 },
    },
    MAJOR: {
      NOVICE: { cost: 120, base: 8 },
      INTERMEDIATE: { cost: 100, base: 8 },
      MASTERED: { cost: 80, base: 8 },
    },
    EXTREME: {
      NOVICE: { cost: 200, base: 10 },
      INTERMEDIATE: { cost: 175, base: 10 },
      MASTERED: { cost: 150, base: 10 },
    },
  };

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

  const sizes = ["Small AOE", "Moderate AOE", "Large AOE"];

  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
      setSize("Small AOE");
    }
  }, [active]);

  let mastery: "NOVICE" | "INTERMEDIATE" | "MASTERED";

  if (ParentMastery.getType() === testMastery.novice(true)) {
    mastery = "NOVICE";
  } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
    mastery = "INTERMEDIATE";
  } else {
    mastery = "MASTERED";
  }

  const currentStats = potencyStats[selectedPotency][mastery];

  const handlePotencyChange = (potency: "MINOR" | "MAJOR" | "EXTREME") => {
    setSelectedPotency(potency);

    const stats = potencyStats[potency][mastery];

    updateSpell("cost", stats.cost);
    updateSpell("base", stats.base);
  };

  return (
    <div>
      <h1>Alter Spatial</h1>

      <h3>DIRECT DAMAGE</h3>
      <h3>RANGE - DIRECT</h3>

      <div className="mt-6">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={handlePotencyChange}
        />
      </div>

      <div className="mt-4">
        <Select title="AOE" choices={sizes} changeChoice={setSize} />
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h3>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Resistance Check</span>

            <span className="font-semibold text-cyan-400">
              {currentStats.base}
            </span>
          </div>

          <div className="flex justify-between">
            <span>AOE</span>

            <span className="font-semibold text-cyan-400">{size}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Cost</span>

            <span className="font-semibold text-cyan-400">
              {currentStats.cost}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlterSpatial;
