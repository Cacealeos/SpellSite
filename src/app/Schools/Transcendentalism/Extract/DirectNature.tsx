import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type DirectNatureProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const DirectNature = ({
  ParentMastery,
  active,
  updateSpell,
}: DirectNatureProps) => {
  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "30 / 20 / 10",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "60 / 50 / 40",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "90 / 80 / 70",
    },
  ];

  const masteryCosts = {
    NOVICE: {
      MINOR: 30,
      MAJOR: 60,
      EXTREME: 90,
    },
    INTERMEDIATE: {
      MINOR: 20,
      MAJOR: 50,
      EXTREME: 80,
    },
    MASTERED: {
      MINOR: 10,
      MAJOR: 40,
      EXTREME: 70,
    },
  };

  const masteryType = ParentMastery.getType();

  const cost =
    masteryCosts[masteryType as keyof typeof masteryCosts]?.[selectedPotency] ??
    0;

  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Direct Nature</h1>
      </div>

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">Spell Effect</h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">Direct Nature</p>
        </div>
      </div>

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
            <p className="text-sm text-gray-400">Potency</p>
            <p className="text-xl font-bold text-white">{selectedPotency}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectNature;
