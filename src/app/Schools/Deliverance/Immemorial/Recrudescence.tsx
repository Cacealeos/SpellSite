import { useEffect, useState } from "react";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const spellTable = {
  NOVICE: {
    MINOR: { cost: 100, turns: 1 },
    MAJOR: { cost: 250, turns: 2 },
    EXTREME: { cost: 500, turns: 3 },
  },
  INTERMEDIATE: {
    MINOR: { cost: 75, turns: 1 },
    MAJOR: { cost: 150, turns: 2 },
    EXTREME: { cost: 350, turns: 3 },
  },
  MASTERED: {
    MINOR: { cost: 40, turns: 1 },
    MAJOR: { cost: 100, turns: 2 },
    EXTREME: { cost: 200, turns: 3 },
  },
};

const Recrudescence = ({
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
      description: "1 Turn • 100 / 75 / 40",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "2 Turns • 250 / 150 / 100",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "3 Turns • 500 / 350 / 200",
    },
  ];

  const { cost, turns } =
    spellTable[ParentMastery.getType() as keyof typeof spellTable][
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
          Recrudescence Statistics
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Range</span>
            <span className="font-semibold text-cyan-400">Radial</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Duration</span>
            <span className="font-semibold text-cyan-400">
              {turns} {turns === 1 ? "Turn" : "Turns"}
            </span>
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

export default Recrudescence;
