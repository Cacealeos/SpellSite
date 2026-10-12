import { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type TransmuteArchProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

// ==================================================
// Potency Options
// ==================================================

const potencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: "150 / 100 / 75",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "450 / 300 / 225",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "1350 / 900 / 675",
  },
];

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Carry Spell": true,
  "Spell Shift": true,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Father Spell": false,
};

const TransmuteArch = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmuteArchProps) => {
  // ==================================================
  // State
  // ==================================================

  const [endurance, setEndurance] = useState(0);

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [counterSpell, setCounterSpell] = useState(false);

  // ==================================================
  // Mastery / Potency Costs
  // ==================================================

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

  // ==================================================
  // Endurance Modifiers
  // ==================================================

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

  // ==================================================
  // Spell Statistics
  // ==================================================

  const masteryType = ParentMastery.getType();

  const baseCost = getCost(masteryType, selectedPotency);

  const enduranceModifier = getEnduranceModifier(masteryType);

  const enduranceCost = Math.round(baseCost * enduranceModifier * endurance);

  const finalCost = Math.round(
    baseCost + baseCost * enduranceModifier * endurance,
  );

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (active) return;

    setEndurance(0);
    setSelectedPotency("MINOR");
    setCounterSpell(false);
  }, [active]);

  // ==================================================
  // Update Parent Spell
  // ==================================================

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
    updateSpell("cost", finalCost);
    updateSpell("ttt", 0);
  }, [active, selectedPotency, finalCost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Spell Techniques Table */}
      {/* ================================================== */}

      <div className="mb-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* Potency Selection */}
      {/* ================================================== */}

      <PotencySelector
        options={potencyOptions}
        selectedPotency={selectedPotency}
        setSelectedPotency={setSelectedPotency}
      />

      {/* ================================================== */}
      {/* Manna to Endurance */}
      {/* ================================================== */}

      <div className="mt-6 border-t border-gray-700 pt-6">
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
            setEndurance(
              Math.max(0, Math.min(4, Math.floor(Number(e.target.value) || 0))),
            )
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
        </p>

        <p className="mt-1 text-sm text-gray-500">
          NOVICE +20%, INTERMEDIATE +15%, MASTERED +10% of base cost per
          increment. Max of 4. Starts at 0.
        </p>
      </div>

      {/* ================================================== */}
      {/* Spell Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-orange-400">
            Spell Statistics
          </h2>

          {/* Counter Spell Toggle */}

          <button
            type="button"
            onClick={() => setCounterSpell((prev) => !prev)}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
              counterSpell
                ? "border-red-400 bg-red-500/10 text-red-300 shadow-[0_0_12px_rgba(248,113,113,0.5)]"
                : "border-gray-600 bg-gray-900 text-gray-400 hover:border-red-500 hover:text-red-300"
            }`}
          >
            Counter Spell
          </button>
        </div>

        {/* ================================================== */}
        {/* Technique Effects */}
        {/* ================================================== */}

        {counterSpell && (
          <p className="mb-4 border-t border-gray-700 pt-3 text-sm text-red-300">
            Allows Transmutation Arch activation to be used as a{" "}
            <span className="font-semibold">DEFENSIVE MEASURE</span>.
          </p>
        )}

        {/* ================================================== */}
        {/* Statistics */}
        {/* ================================================== */}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Potency</p>
            <p className="text-xl font-bold text-white">{selectedPotency}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Endurance</p>
            <p className="text-xl font-bold text-white">{endurance}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Base Cost</p>
            <p className="text-xl font-bold text-white">{baseCost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Endurance Cost</p>
            <p className="text-xl font-bold text-white">{enduranceCost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3 sm:col-span-2">
            <p className="text-sm text-gray-400">Total Manna Cost</p>
            <p className="text-xl font-bold text-white">{finalCost}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransmuteArch;
