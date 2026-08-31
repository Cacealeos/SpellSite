import { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import Select from "@/app/Select";

type TransmuteSubstrateProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const TransmuteSubstrate = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmuteSubstrateProps) => {
  const [type, setType] = useState("Displacement");

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const types = ["Displacement", "Warp", "Obfuscation"];

  const potencyCosts = {
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
      description: "75 / 50 / 25",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: `150 / 100 / 50${type === "Obfuscation" ? " × 2" : ""}`,
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: `300 / 200 / 100${type === "Obfuscation" ? " × 4" : ""}`,
    },
  ];

  const getObfuscationMultiplier = () => {
    if (type !== "Obfuscation") return 1;

    if (selectedPotency === "MAJOR") return 2;
    if (selectedPotency === "EXTREME") return 4;

    return 1;
  };

  const getBaseCost = () => {
    const masteryType = ParentMastery.getType();

    if (
      masteryType !== "NOVICE" &&
      masteryType !== "INTERMEDIATE" &&
      masteryType !== "MASTERED"
    ) {
      return 0;
    }

    return potencyCosts[selectedPotency][masteryType];
  };

  const finalCost =
    type === "Displacement" ? 0 : getBaseCost() * getObfuscationMultiplier();

  // Reset local UI state whenever this spell is deselected.
  useEffect(() => {
    if (!active) {
      setType("Displacement");
      setSelectedPotency("MINOR");
    }
  }, [active]);

  // Synchronize this spell's calculated values with the parent Spell.
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

    updateSpell("cost", finalCost);
    updateSpell("ttt", 0);

    // Displacement does not use potency.
    if (type === "Displacement") {
      updateSpell("potency", new Potency());
    } else {
      updateSpell("potency", pot);
    }
  }, [active, type, selectedPotency, finalCost, updateSpell]);

  if (!active) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-100">
          Transmute Substrate
        </h1>

        <h3 className="text-sm font-semibold tracking-wide text-gray-400">
          RANGE - DIRECT
        </h3>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-xl font-bold text-orange-400">
          Spell Properties
        </h2>

        <Select title={type} choices={types} changeChoice={setType} />
        {type !== "Displacement" && (
          <div className="mt-6">
            <PotencySelector
              options={potencyOptions}
              selectedPotency={selectedPotency}
              setSelectedPotency={setSelectedPotency}
            />
          </div>
        )}

        {type === "Obfuscation" && (
          <p className="mt-3 text-sm text-gray-400">
            Obfuscation increases Major Potency to 2× cost and Extreme Potency
            to 4× cost.
          </p>
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

          {type !== "Displacement" && (
            <div className="flex justify-between">
              <span>Potency</span>
              <span className="font-semibold text-orange-400">
                {selectedPotency}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Manna</span>
            <span className="font-semibold text-cyan-400">{finalCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransmuteSubstrate;
