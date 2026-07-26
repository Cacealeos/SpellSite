import { useEffect, useState } from "react";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const StabilizeEnvironment = ({
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

  const [selectedAOE, setSelectedAOE] = useState<
    "MODERATE" | "LARGE" | "MASSIVE"
  >("LARGE");

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "150 / 120 / 100",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "300 / 240 / 180",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "600 / 480 / 360",
    },
  ];

  // ==================================================
  // AOE Options
  // ==================================================

  const aoeOptions = [
    {
      value: "MODERATE" as const,
      label: "Moderate AOE",
      description: "Cost -50%",
    },
    {
      value: "LARGE" as const,
      label: "Large AOE",
      description: "No cost modifier",
    },
    {
      value: "MASSIVE" as const,
      label: "Massive AOE",
      description: "Cost +200%",
    },
  ];

  // ==================================================
  // Spell Calculation
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    const mastery = ParentMastery.getType();

    const costs = {
      MINOR: {
        NOVICE: 150,
        INTERMEDIATE: 120,
        MASTERED: 100,
      },
      MAJOR: {
        NOVICE: 300,
        INTERMEDIATE: 240,
        MASTERED: 180,
      },
      EXTREME: {
        NOVICE: 600,
        INTERMEDIATE: 480,
        MASTERED: 360,
      },
    };

    const aoeMultipliers = {
      MODERATE: 0.5,
      LARGE: 1,
      MASSIVE: 3,
    };

    const baseCost =
      costs[selectedPotency][mastery as "NOVICE" | "INTERMEDIATE" | "MASTERED"];

    const cost = Math.round(baseCost * aoeMultipliers[selectedAOE]);

    updateSpell("cost", cost);

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
  }, [active, ParentMastery, selectedPotency, selectedAOE, updateSpell]);

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
          Area of Effect
        </h3>

        <div className="space-y-3">
          {aoeOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-4 py-3 hover:border-orange-500"
            >
              <div>
                <p className="font-medium text-gray-100">{option.label}</p>

                <p className="text-sm text-gray-400">{option.description}</p>
              </div>

              <input
                type="radio"
                name="aoe"
                checked={selectedAOE === option.value}
                onChange={() => setSelectedAOE(option.value)}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4 text-gray-300">
        <p>
          Organizes scrambled transmissions within the area. Stabilization
          strength is measured against the level of instability created by
          effects such as Scramble Signature.
        </p>

        <p>
          Potency scales with the degree of remediation required to restore
          damaged or jammed signals.
        </p>
      </div>
    </>
  );
};

export default StabilizeEnvironment;
