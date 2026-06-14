import { useEffect, useState } from "react";
import { Mastery } from "@/app/models";
import { Potency } from "@/app/models";
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
  const [ttt, setTTT] = useState(0);
  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const getCost = (masteryType: string, potencyType: string): number => {
    const mastery = new Mastery();

    if (masteryType === mastery.novice(true)) {
      switch (potencyType) {
        case "MINOR":
          return 150;
        case "MAJOR":
          return 450;
        case "EXTREME":
          return 1350;
      }
    }

    if (masteryType === mastery.intermediate(true)) {
      switch (potencyType) {
        case "MINOR":
          return 100;
        case "MAJOR":
          return 300;
        case "EXTREME":
          return 900;
      }
    }

    if (masteryType === mastery.mastered(true)) {
      switch (potencyType) {
        case "MINOR":
          return 75;
        case "MAJOR":
          return 225;
        case "EXTREME":
          return 675;
      }
    }

    return 0;
  };

  useEffect(() => {
    // This component owns the UI state (potency selection and TTT),
    // but the parent owns the final Spell object.
    //
    // Whenever the local state changes, synchronize the derived
    // spell values back to the parent.

    if (!active) {
      // Spell is no longer selected.
      // Reset both the parent spell values and the local UI state
      // so the spell starts from a clean slate next time.

      updateSpell("cost", 0);
      updateSpell("ttt", 0);

      const pot = new Potency();
      pot.minor();

      updateSpell("potency", pot);

      setTTT(0);
      setSelectedPotency("MINOR");

      return;
    }

    // Convert the selected radio button into a Potency object
    // that can be stored on the parent Spell.
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

    // Cost is derived from mastery rank and potency.
    // Recalculate whenever either changes.
    const cost = getCost(ParentMastery.getType(), pot.getType());

    // Push the current child state into the parent Spell.
    // The parent remains the source of truth for the final
    // spell data while this component owns the UI controls.
    updateSpell("potency", pot);
    updateSpell("cost", cost);
    updateSpell("ttt", ttt);
  }, [active, selectedPotency, ttt, ParentMastery, updateSpell]);

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
          value={ttt}
          onChange={(e) => setTTT(Number(e.target.value))}
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
          Convert up to 4 Manna into Endurance.
        </p>
      </div>
    </div>
  );
};

export default TransmuteArch;
