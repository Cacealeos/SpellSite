import { useEffect, useState } from "react";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const spellTable = {
  NOVICE: {
    MINOR: { cost: 40 },
    MAJOR: { cost: 70 },
    EXTREME: { cost: 100 },
  },
  INTERMEDIATE: {
    MINOR: { cost: 30 },
    MAJOR: { cost: 60 },
    EXTREME: { cost: 90 },
  },
  MASTERED: {
    MINOR: { cost: 20 },
    MAJOR: { cost: 50 },
    EXTREME: { cost: 80 },
  },
};

const Cleanse = ({
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
      description: "40 / 30 / 20",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "70 / 60 / 50",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "100 / 90 / 80",
    },
  ];

  const { cost } =
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
          Cleanse Statistics
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Cost</span>

            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cleanse;
