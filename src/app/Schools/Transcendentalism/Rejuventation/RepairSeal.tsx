import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type RepairSealProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const RepairSeal = ({
  ParentMastery,
  active,
  updateSpell,
}: RepairSealProps) => {
  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const getCost = (
    masteryType: string,
    potency: "MINOR" | "MAJOR" | "EXTREME",
  ): number => {
    switch (masteryType) {
      case "NOVICE":
        switch (potency) {
          case "MINOR":
            return 150;
          case "MAJOR":
            return 250;
          case "EXTREME":
            return 350;
        }
        break;

      case "INTERMEDIATE":
        switch (potency) {
          case "MINOR":
            return 100;
          case "MAJOR":
            return 175;
          case "EXTREME":
            return 225;
        }
        break;

      case "MASTERED":
        switch (potency) {
          case "MINOR":
            return 50;
          case "MAJOR":
            return 100;
          case "EXTREME":
            return 150;
        }
        break;
    }

    return 0;
  };

  const cost = getCost(ParentMastery.getType(), selectedPotency);

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "150 / 100 / 50 Manna",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "250 / 175 / 100 Manna",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "350 / 225 / 150 Manna",
    },
  ];

  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
      return;
    }

    updateSpell("cost", cost);
    updateSpell("ttt", 0);
  }, [active, cost, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* Title */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Repair Seal</h1>
        <p className="mt-2 text-sm text-gray-400">Revives Deceased Spirit</p>
      </div>

      {/* Potency */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* Spell Statistics */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Spell Statistics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Cost</p>
            <p className="text-xl font-bold text-white">{cost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">TTT</p>
            <p className="text-xl font-bold text-white">0</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Potency</p>
            <p className="text-xl font-bold text-white">
              {
                potencyOptions.find(
                  (option) => option.value === selectedPotency,
                )?.label
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairSeal;
