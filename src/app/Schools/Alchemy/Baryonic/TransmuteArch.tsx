import { useEffect, useState } from "react";
import { Mastery, Potency } from "@/app/models";
import { Spell } from "@/app/models";
import CustomRadio from "@/app/Radio";

type TransmuteArchProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const TransmuteArch = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmuteArchProps) => {
  const [endurance, setEndurance] = useState(0);

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const getCost = (masteryType: string, potencyType: string): number => {
    switch (masteryType) {
      case "NOVICE":
        switch (potencyType) {
          case "MINOR":
            return 150;

          case "MAJOR":
            return 450;

          case "EXTREME":
            return 1350;
        }
        break;

      case "INTERMEDIATE":
        switch (potencyType) {
          case "MINOR":
            return 100;

          case "MAJOR":
            return 300;

          case "EXTREME":
            return 900;
        }
        break;

      case "MASTERED":
        switch (potencyType) {
          case "MINOR":
            return 75;

          case "MAJOR":
            return 225;

          case "EXTREME":
            return 675;
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

  // Synchronize this component's local UI state with
  // the parent Spell object.
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

    // Base cost is derived from mastery rank and potency.
    const baseCost = getCost(ParentMastery.getType(), pot.getType());

    // Each Endurance increment increases cost
    // by a mastery-dependent percentage.
    const modifier = getEnduranceModifier(ParentMastery.getType());

    const finalCost = Math.round(baseCost + baseCost * modifier * endurance);

    updateSpell("potency", pot);
    updateSpell("cost", finalCost);

    // This spell does not intrinsically create TTT.
    updateSpell("ttt", 0);
  }, [active, selectedPotency, endurance, ParentMastery, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <div className="mb-6">
        <h2 className="mb-4 text-xl font-bold text-cyan-400">Potency</h2>

        <div className="space-y-3">
          <CustomRadio
            selected={selectedPotency === "MINOR"}
            value="MINOR"
            label="Minor"
            description="150 / 100 / 75"
            onClick={() => setSelectedPotency("MINOR")}
          />

          <CustomRadio
            selected={selectedPotency === "MAJOR"}
            value="MAJOR"
            label="Major"
            description="450 / 300 / 225"
            onClick={() => setSelectedPotency("MAJOR")}
          />

          <CustomRadio
            selected={selectedPotency === "EXTREME"}
            value="EXTREME"
            label="Extreme"
            description="1350 / 900 / 675"
            onClick={() => setSelectedPotency("EXTREME")}
          />
        </div>
      </div>

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
          onChange={(e) => setEndurance(Number(e.target.value))}
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
          Potency <br />
          (NOVICE +20%, INTERMEDIATE +15%, MASTERED +10% of base cost per
          increment. Max of 4. Starts at 0).
        </p>
      </div>
    </div>
  );
};

export default TransmuteArch;
