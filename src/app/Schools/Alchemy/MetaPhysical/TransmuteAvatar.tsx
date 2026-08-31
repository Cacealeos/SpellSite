import { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type TransmuteAvatarProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const TransmuteAvatar = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmuteAvatarProps) => {
  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const potencyStats = {
    MINOR: {
      NOVICE: { cost: 20, spellCraft: 2, mageTech: 75 },
      INTERMEDIATE: { cost: 10, spellCraft: 2, mageTech: 75 },
      MASTERED: { cost: 0, spellCraft: 2, mageTech: 75 },
    },
    MAJOR: {
      NOVICE: { cost: 60, spellCraft: 3, mageTech: 100 },
      INTERMEDIATE: { cost: 40, spellCraft: 3, mageTech: 100 },
      MASTERED: { cost: 20, spellCraft: 3, mageTech: 100 },
    },
    EXTREME: {
      NOVICE: { cost: 100, spellCraft: 4, mageTech: 125 },
      INTERMEDIATE: { cost: 80, spellCraft: 4, mageTech: 125 },
      MASTERED: { cost: 60, spellCraft: 4, mageTech: 125 },
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

  const masteryType = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const selectedStats =
    potencyStats[selectedPotency][masteryType] ??
    potencyStats[selectedPotency].NOVICE;

  // Reset local UI state whenever this spell is deselected.
  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
    }
  }, [active]);

  // Synchronize the selected potency and calculated values
  // with the parent Spell object.
  useEffect(() => {
    if (!active) return;

    const pot = new Potency();

    switch (selectedPotency) {
      case "MINOR":
        pot.minor();
        break;

      case "MAJOR":
        pot.major();
        break;

      case "EXTREME":
        pot.extreme();
        break;
    }

    updateSpell("potency", pot);
    updateSpell("cost", selectedStats.cost);

    // Transmute Avatar does not intrinsically generate TTT.
    updateSpell("ttt", 0);
  }, [active, selectedPotency, selectedStats.cost, updateSpell]);

  if (!active) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {" "}
      <div>
        {" "}
        <h1 className="mb-2 text-2xl font-bold text-gray-100">
          Transmute Avatar{" "}
        </h1>
        <h3 className="text-sm font-semibold tracking-wide text-gray-400">
          RANGE - DIRECT
        </h3>
      </div>
      <div className="mt-6">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-xl font-bold text-orange-400">
          Spell Properties
        </h2>

        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>
      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-2 text-gray-300">
          <div className="flex justify-between">
            <span>Potency</span>
            <span className="font-semibold text-orange-400">
              {selectedPotency}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Manna</span>
            <span className="font-semibold text-cyan-400">
              {selectedStats.cost}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Spellcraft</span>
            <span className="font-semibold text-cyan-400">
              {selectedStats.spellCraft}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Mage Tech</span>
            <span className="font-semibold text-cyan-400">
              {selectedStats.mageTech}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransmuteAvatar;
