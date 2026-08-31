import { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import Select from "@/app/Select";

type TransmuteCacealeosProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const TransmuteCacealeos = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmuteCacealeosProps) => {
  const [type, setType] = useState("Prism");

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const types = ["Prism", "Law", "Reinforcement", "Junction"];

  const isJunction = type === "Junction";

  const potencyStats = {
    MINOR: {
      NOVICE: 75,
      INTERMEDIATE: 50,
      MASTERED: 25,
    },
    MAJOR: {
      NOVICE: 150,
      INTERMEDIATE: 100,
      MASTERED: 50,
    },
    EXTREME: {
      NOVICE: 300,
      INTERMEDIATE: 200,
      MASTERED: 100,
    },
  };

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: `Cost: ${potencyStats.MINOR.NOVICE} / ${potencyStats.MINOR.INTERMEDIATE} / ${potencyStats.MINOR.MASTERED}`,
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: `Cost: ${potencyStats.MAJOR.NOVICE} / ${potencyStats.MAJOR.INTERMEDIATE} / ${potencyStats.MAJOR.MASTERED}`,
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: `Cost: ${potencyStats.EXTREME.NOVICE} / ${potencyStats.EXTREME.INTERMEDIATE} / ${potencyStats.EXTREME.MASTERED}`,
    },
  ];

  const masteryType = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const finalCost = potencyStats[selectedPotency][masteryType] ?? 0;

  // Reset local UI state whenever this spell is deselected.
  useEffect(() => {
    if (!active) {
      setType("Prism");
      setSelectedPotency("MINOR");
    }
  }, [active]);

  // Synchronize the selected potency and cost with the parent Spell.
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
    updateSpell("cost", isJunction ? finalCost : 0);

    // This spell does not intrinsically generate TTT.
    updateSpell("ttt", 0);
  }, [active, selectedPotency, finalCost, isJunction, updateSpell]);

  if (!active) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-100">
          Transmute Cacealeos
        </h1>

        <h3 className="text-sm font-semibold tracking-wide text-gray-400">
          RANGE - DIRECT
        </h3>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-xl font-bold text-orange-400">
          Spell Properties
        </h2>

        <Select title="Type" choices={types} changeChoice={setType} />

        {isJunction && (
          <div className="mt-6">
            <PotencySelector
              options={potencyOptions}
              selectedPotency={selectedPotency}
              setSelectedPotency={setSelectedPotency}
            />
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-2 text-gray-300">
          <div className="flex justify-between">
            <span>Type</span>
            <span className="font-semibold text-orange-400">{type}</span>
          </div>

          {isJunction && (
            <>
              <div className="flex justify-between">
                <span>Potency</span>
                <span className="font-semibold text-orange-400">
                  {selectedPotency}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Manna</span>
                <span className="font-semibold text-cyan-400">{finalCost}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransmuteCacealeos;
