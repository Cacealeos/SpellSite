import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type Potency = "MINOR" | "MAJOR" | "EXTREME";

type DrawCatalystProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const DrawCatalyst = ({
  ParentMastery,
  active,
  updateSpell,
}: DrawCatalystProps) => {
  const [cost, setCost] = useState(0);
  const [pot, setPot] = useState<Potency>("MINOR");

  const TTT = 20;

  const potencyOptions = [
    {
      value: "MINOR" as Potency,
      label: "Minor",
      description: "60 / 45 / 30",
    },
    {
      value: "MAJOR" as Potency,
      label: "Major",
      description: "90 / 75 / 60",
    },
    {
      value: "EXTREME" as Potency,
      label: "Extreme",
      description: "120 / 105 / 90",
    },
  ];

  const getCost = (potency: Potency): number => {
    switch (ParentMastery.getType()) {
      case "NOVICE":
        switch (potency) {
          case "MINOR":
            return 60;
          case "MAJOR":
            return 90;
          case "EXTREME":
            return 120;
        }

      case "INTERMEDIATE":
        switch (potency) {
          case "MINOR":
            return 45;
          case "MAJOR":
            return 75;
          case "EXTREME":
            return 105;
        }

      case "MASTERED":
        switch (potency) {
          case "MINOR":
            return 30;
          case "MAJOR":
            return 60;
          case "EXTREME":
            return 90;
        }

      default:
        return 0;
    }
  };

  useEffect(() => {
    if (!active) {
      setCost(0);
      setPot("MINOR");
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const newCost = getCost(pot);

    setCost(newCost);
    updateSpell("cost", newCost);
    updateSpell("ttt", TTT);
  }, [active, pot, ParentMastery, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Draw Catalyst</h1>
      </div>

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={pot}
          setSelectedPotency={setPot}
        />
      </div>

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 text-lg font-bold text-orange-400">
          Spell Statistics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Cost</p>
            <p className="text-xl font-bold text-white">{cost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">TTT</p>
            <p className="text-xl font-bold text-white">{TTT}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawCatalyst;
