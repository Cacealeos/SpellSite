import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type DrawMemoryProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type Potency = "MINOR" | "MAJOR" | "EXTREME";

const DrawMemory = ({
  ParentMastery,
  active,
  updateSpell,
}: DrawMemoryProps) => {
  const [potency, setPotency] = useState<Potency>("MINOR");

  const getCost = (): number => {
    switch (ParentMastery.getType()) {
      case "NOVICE":
        if (potency === "MINOR") return 60;
        if (potency === "MAJOR") return 120;
        if (potency === "EXTREME") return 180;
        break;

      case "INTERMEDIATE":
        if (potency === "MINOR") return 40;
        if (potency === "MAJOR") return 100;
        if (potency === "EXTREME") return 160;
        break;

      case "MASTERED":
        if (potency === "MINOR") return 20;
        if (potency === "MAJOR") return 80;
        if (potency === "EXTREME") return 140;
        break;
    }

    return 0;
  };

  const cost = getCost();

  const potencyOptions = [
    {
      value: "MINOR" as Potency,
      label: "Minor",
      description: "60 / 40 / 20 Manna",
    },
    {
      value: "MAJOR" as Potency,
      label: "Major",
      description: "120 / 100 / 80 Manna",
    },
    {
      value: "EXTREME" as Potency,
      label: "Extreme",
      description: "180 / 160 / 140 Manna",
    },
  ];

  useEffect(() => {
    if (!active) {
      setPotency("MINOR");
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* Spell Title */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Draw Memory</h1>
      </div>

      {/* Potency */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={potency}
          setSelectedPotency={setPotency}
        />

        <div className="mt-4 rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">
            Spell-craft Lore Threshold
          </p>

          <div className="mt-2 space-y-1 text-sm text-gray-400">
            <p>Minor — Lore 1</p>
            <p>Major — Lore 2</p>
            <p>Extreme — Lore 3</p>
          </div>
        </div>
      </div>

      {/* Spell Statistics */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 text-xl font-bold text-orange-400">
          Spell Statistics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Cost</p>
            <p className="text-xl font-bold text-white">{cost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Potency</p>
            <p className="text-xl font-bold text-white">{potency}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawMemory;
