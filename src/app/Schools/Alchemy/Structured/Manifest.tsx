import { useEffect, useMemo, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import { types, Costs } from "./costsData";
import Select from "@/app/Select";
import PotencySelector from "@/app/PotencyDisplay";

type ManifestProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const Manifest = ({ ParentMastery, active, updateSpell }: ManifestProps) => {
  const [type, setType] = useState("Organic");

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const typeCosts = Costs[type as keyof typeof Costs];

  const potencyOptions = useMemo(() => {
    if (!typeCosts) {
      return [];
    }

    return [
      {
        value: "MINOR" as const,
        label: "Minor",
        description: `${typeCosts[0]} / ${typeCosts[1]} / ${typeCosts[2]}`,
      },
      {
        value: "MAJOR" as const,
        label: "Major",
        description: `${typeCosts[0]} / ${typeCosts[1]} / ${typeCosts[2]}`,
      },
      {
        value: "EXTREME" as const,
        label: "Extreme",
        description: `${typeCosts[0]} / ${typeCosts[1]} / ${typeCosts[2]}`,
      },
    ];
  }, [type, typeCosts]);

  const masteryIndex =
    ParentMastery.getType() === "NOVICE"
      ? 0
      : ParentMastery.getType() === "INTERMEDIATE"
        ? 1
        : ParentMastery.getType() === "MASTERED"
          ? 2
          : -1;

  const potencyIndex =
    selectedPotency === "MINOR" ? 0 : selectedPotency === "MAJOR" ? 1 : 2;

  const cost = typeCosts && masteryIndex >= 0 ? typeCosts[potencyIndex] : 0;

  useEffect(() => {
    if (!active) {
      setType("Organic");
      setSelectedPotency("MINOR");
    }
  }, [active]);

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

    updateSpell("cost", cost);
    updateSpell("potency", pot);
    updateSpell("ttt", 0);
  }, [active, type, selectedPotency, cost, updateSpell]);

  if (!active) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-100">Manifest</h1>

        <h3 className="text-sm font-semibold tracking-wide text-gray-400">
          RANGE - DIRECT
        </h3>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-xl font-bold text-orange-400">
          Manifest Type
        </h2>

        <Select title={type} choices={types} changeChoice={setType} />
      </div>

      <div className="mt-6">
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
            <span>Type</span>
            <span className="font-semibold text-orange-400">{type}</span>
          </div>

          <div className="flex justify-between">
            <span>Potency</span>
            <span className="font-semibold text-orange-400">
              {selectedPotency}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Manna</span>
            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manifest;
