import React, { useEffect, useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const ManifestDeath = ({
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

  const [cost, setCost] = useState(0);
  const [resistance, setResistance] = useState(6);

  const testMastery = new Mastery();

  const potencyStats = {
    MINOR: {
      NOVICE: { cost: 60, resistance: 6 },
      INTERMEDIATE: { cost: 45, resistance: 6 },
      MASTERED: { cost: 30, resistance: 6 },
    },
    MAJOR: {
      NOVICE: { cost: 120, resistance: 7 },
      INTERMEDIATE: { cost: 100, resistance: 7 },
      MASTERED: { cost: 80, resistance: 7 },
    },
    EXTREME: {
      NOVICE: { cost: 200, resistance: 8 },
      INTERMEDIATE: { cost: 175, resistance: 8 },
      MASTERED: { cost: 150, resistance: 8 },
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

  let mastery: "NOVICE" | "INTERMEDIATE" | "MASTERED" = "NOVICE";

  if (ParentMastery.getType() === testMastery.intermediate(true)) {
    mastery = "INTERMEDIATE";
  } else if (ParentMastery.getType() === testMastery.mastered(true)) {
    mastery = "MASTERED";
  }

  useEffect(() => {
    if (!active) {
      setCost(0);
      setResistance(6);
      setSelectedPotency("MINOR");
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const stats = potencyStats[selectedPotency][mastery];

    setCost(stats.cost);
    setResistance(stats.resistance);

    updateSpell("cost", stats.cost);
  }, [active, mastery, selectedPotency, updateSpell]);

  return (
    <div>
      <h1>Manifest Death</h1>

      <h3>RANGE - DIRECT</h3>

      <div className="mt-6">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-2 text-gray-300">
          <div className="flex justify-between">
            <span>Resistance Check</span>
            <span className="font-semibold text-cyan-400">{resistance}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Manna</span>
            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManifestDeath;
