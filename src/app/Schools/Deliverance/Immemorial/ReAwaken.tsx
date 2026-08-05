import { useEffect, useState } from "react";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const costTable = {
  NOVICE: {
    MINOR: 90,
    MAJOR: 190,
    EXTREME: 330,
  },
  INTERMEDIATE: {
    MINOR: 70,
    MAJOR: 150,
    EXTREME: 270,
  },
  MASTERED: {
    MINOR: 50,
    MAJOR: 110,
    EXTREME: 210,
  },
};

const ReAwaken = ({
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

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "33% • 1 Turn • 90 / 70 / 50",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "67% • 2 Turns • 190 / 150 / 110",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "100% • 3 Turns • 330 / 270 / 210",
    },
  ];

  const cost =
    costTable[ParentMastery.getType() as keyof typeof costTable][
      selectedPotency
    ];

  // ==================================================
  // Spell Calculation
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      updateSpell("potency", new Potency());
      return;
    }

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

    updateSpell("cost", cost);
    updateSpell("potency", potency);
  }, [active, cost, selectedPotency, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      <PotencySelector
        options={potencyOptions}
        selectedPotency={selectedPotency}
        setSelectedPotency={setSelectedPotency}
      />

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          ReAwaken Statistics
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Range</span>
            <span className="font-semibold text-cyan-400">Radial</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Cost</span>
            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReAwaken;
