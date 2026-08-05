import { useEffect, useState } from "react";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const aoeOptions = [
  {
    value: "SMALL" as const,
    label: "Small Area",
    description: "Cost ×1",
    multiplier: 1,
  },
  {
    value: "MODERATE" as const,
    label: "Moderate Area",
    description: "Cost ×1.5",
    multiplier: 1.5,
  },
  {
    value: "LARGE" as const,
    label: "Large Area",
    description: "Cost ×3",
    multiplier: 3,
  },
];

const Unveil = ({
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
    "SMALL" | "MODERATE" | "LARGE"
  >("SMALL");

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "45 / 35 / 25",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "75 / 65 / 55",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "105 / 95 / 85",
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

    const spellPotency = new Potency();

    let cost = 0;

    switch (selectedPotency) {
      case "MINOR":
        spellPotency.minor();

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 45;
            break;
          case "INTERMEDIATE":
            cost = 35;
            break;
          case "MASTERED":
            cost = 25;
            break;
        }
        break;

      case "MAJOR":
        spellPotency.major();

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 75;
            break;
          case "INTERMEDIATE":
            cost = 65;
            break;
          case "MASTERED":
            cost = 55;
            break;
        }
        break;

      case "EXTREME":
        spellPotency.extreme();

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 105;
            break;
          case "INTERMEDIATE":
            cost = 95;
            break;
          case "MASTERED":
            cost = 85;
            break;
        }
        break;
    }

    const multiplier =
      aoeOptions.find((option) => option.value === selectedAOE)?.multiplier ??
      1;

    cost *= multiplier;

    updateSpell("cost", cost);
    updateSpell("potency", spellPotency);
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

      {/* Area of Effect */}
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
    </>
  );
};

export default Unveil;
