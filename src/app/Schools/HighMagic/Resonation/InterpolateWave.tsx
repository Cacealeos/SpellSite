import { useEffect, useState } from "react";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const InterpolateWave = ({
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
      description: "30 / 20 / 10",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "75 / 60 / 45",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "150 / 120 / 90",
    },
  ];

  // ==================================================
  // Spell Calculation
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      updateSpell("ttt", 0);
      return;
    }

    const mastery = ParentMastery.getType();

    const costs = {
      MINOR: {
        NOVICE: 30,
        INTERMEDIATE: 20,
        MASTERED: 10,
      },
      MAJOR: {
        NOVICE: 75,
        INTERMEDIATE: 60,
        MASTERED: 45,
      },
      EXTREME: {
        NOVICE: 150,
        INTERMEDIATE: 120,
        MASTERED: 90,
      },
    };

    const tttValues = {
      NOVICE: 8,
      INTERMEDIATE: 5,
      MASTERED: 3,
    };

    const cost =
      costs[selectedPotency][mastery as "NOVICE" | "INTERMEDIATE" | "MASTERED"];

    const ttt = tttValues[mastery as "NOVICE" | "INTERMEDIATE" | "MASTERED"];

    updateSpell("cost", cost);
    updateSpell("ttt", ttt);

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
  }, [active, ParentMastery, selectedPotency, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  const ttt = {
    NOVICE: 3,
    INTERMEDIATE: 5,
    MASTERED: 8,
  }[ParentMastery.getType() as "NOVICE" | "INTERMEDIATE" | "MASTERED"];

  return (
    <>
      <PotencySelector
        options={potencyOptions}
        selectedPotency={selectedPotency}
        setSelectedPotency={setSelectedPotency}
      />

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Sustained TTT Cost
        </h3>

        <p className="text-center text-3xl font-bold text-cyan-400">
          {ttt} TTT
        </p>

        <p className="mt-2 text-center text-sm text-gray-400">
          Sustain cost varies based on Mastery.
        </p>
      </div>

      <div className="mt-6 space-y-4 text-gray-300">
        <p>
          Detects light waves outside the visible spectrum but cannot interpret
          them without some form of key.
        </p>

        <p>
          Allows the insertion of noise into detected signals at the risk of
          projecting the caster's manna signature.
        </p>

        <p>Uses a TTT cost to sustain the broadcast.</p>

        <p>
          Potency scales with parsing ability and the strength of both detected
          signals and injected noise.
        </p>
      </div>
    </>
  );
};

export default InterpolateWave;
