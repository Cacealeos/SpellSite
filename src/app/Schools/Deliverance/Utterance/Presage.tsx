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

const Presage = ({
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
      description: "80 / 60 / 40",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "120 / 90 / 60",
    },
  ];

  const deliveranceAspect =
    selectedPotency === "MINOR"
      ? "Immemorial"
      : selectedPotency === "MAJOR"
        ? "Sagacity"
        : "Ire";

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
            cost = 40;
            break;
          case "INTERMEDIATE":
            cost = 30;
            break;
          case "MASTERED":
            cost = 20;
            break;
        }
        break;

      case "MAJOR":
        spellPotency.major();

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 80;
            break;
          case "INTERMEDIATE":
            cost = 60;
            break;
          case "MASTERED":
            cost = 40;
            break;
        }
        break;

      case "EXTREME":
        spellPotency.extreme();

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 120;
            break;
          case "INTERMEDIATE":
            cost = 90;
            break;
          case "MASTERED":
            cost = 60;
            break;
        }
        break;
    }

    updateSpell("cost", cost);
    updateSpell("potency", spellPotency);
  }, [active, ParentMastery, selectedPotency, updateSpell]);

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
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Deliverance Aspect
        </h3>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Selected Potency corresponds to
          </p>

          <p className="mt-2 text-xl font-semibold text-cyan-300">
            {deliveranceAspect}
          </p>
        </div>
      </div>
    </>
  );
};

export default Presage;
