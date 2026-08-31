import { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type TransmuteMassProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const TransmuteMass = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmuteMassProps) => {
  const [endurance, setEndurance] = useState(0);

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "100 / 75 / 50",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "300 / 225 / 150",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "900 / 675 / 450",
    },
  ];

  const getCost = (masteryType: string, potencyType: string): number => {
    switch (masteryType) {
      case "NOVICE":
        switch (potencyType) {
          case "MINOR":
            return 100;
          case "MAJOR":
            return 300;
          case "EXTREME":
            return 900;
        }
        break;

      case "INTERMEDIATE":
        switch (potencyType) {
          case "MINOR":
            return 75;
          case "MAJOR":
            return 225;
          case "EXTREME":
            return 675;
        }
        break;

      case "MASTERED":
        switch (potencyType) {
          case "MINOR":
            return 50;
          case "MAJOR":
            return 150;
          case "EXTREME":
            return 450;
        }
        break;
    }

    return 0;
  };

  const getEnduranceModifier = (masteryType: string): number => {
    switch (masteryType) {
      case "NOVICE":
        return 0.2;

      case "INTERMEDIATE":
        return 0.15;

      case "MASTERED":
        return 0.1;

      default:
        return 0;
    }
  };

  // Reset local UI state whenever this spell is deselected.
  useEffect(() => {
    if (active) return;

    setEndurance(0);
    setSelectedPotency("MINOR");
  }, [active]);

  // Synchronize the final spell statistics with the parent Spell object.
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

    const masteryType = ParentMastery.getType();

    const baseCost = getCost(masteryType, pot.getType());

    const modifier = getEnduranceModifier(masteryType);

    const finalCost = Math.round(baseCost + baseCost * modifier * endurance);

    updateSpell("potency", pot);
    updateSpell("cost", finalCost);

    // This spell does not intrinsically generate TTT.
    updateSpell("ttt", 0);
  }, [active, selectedPotency, endurance, ParentMastery, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <PotencySelector
        options={potencyOptions}
        selectedPotency={selectedPotency}
        setSelectedPotency={setSelectedPotency}
      />

      <div className="border-t border-gray-700 pt-6">
        <h2 className="mb-3 text-xl font-bold text-orange-400">
          Manna to Endurance
        </h2>

        <input
          type="number"
          min="0"
          max="4"
          step="1"
          value={endurance}
          onChange={(e) =>
            setEndurance(Math.min(4, Math.max(0, Number(e.target.value))))
          }
          className="
            w-24
            rounded
            border
            border-gray-600
            bg-gray-800
            px-3
            py-2
            text-center
            text-lg
            text-white
            outline-none
            transition
            focus:border-cyan-500
            focus:ring-2
            focus:ring-cyan-500/50
          "
        />

        <p className="mt-2 text-sm text-gray-400">
          Each Endurance increment increases Manna cost relative to the selected
          Potency.
          <br />
          (NOVICE +20%, INTERMEDIATE +15%, MASTERED +10% of base cost per
          increment. Max of 4. Starts at 0).
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-2 text-gray-300">
          <div className="flex justify-between">
            <span>Base Cost</span>
            <span className="font-semibold text-cyan-400">
              {getCost(ParentMastery.getType(), selectedPotency)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Endurance</span>
            <span className="font-semibold text-cyan-400">{endurance}</span>
          </div>

          <div className="flex justify-between">
            <span>Final Cost</span>
            <span className="font-semibold text-cyan-400">
              {(() => {
                const baseCost = getCost(
                  ParentMastery.getType(),
                  selectedPotency,
                );

                const modifier = getEnduranceModifier(ParentMastery.getType());

                return Math.round(baseCost + baseCost * modifier * endurance);
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransmuteMass;
