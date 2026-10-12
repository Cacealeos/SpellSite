import { useEffect, useState } from "react";
import { ClockIcon } from "@heroicons/react/24/solid";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type RemembranceProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

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

// ==================================================
// Spell Table
// ==================================================

const spellTable = {
  NOVICE: {
    MINOR: { cost: 100, turns: 1 },
    MAJOR: { cost: 250, turns: 2 },
    EXTREME: { cost: 500, turns: 3 },
  },
  INTERMEDIATE: {
    MINOR: { cost: 75, turns: 1 },
    MAJOR: { cost: 150, turns: 2 },
    EXTREME: { cost: 350, turns: 3 },
  },
  MASTERED: {
    MINOR: { cost: 40, turns: 1 },
    MAJOR: { cost: 100, turns: 2 },
    EXTREME: { cost: 200, turns: 3 },
  },
};

// ==================================================
// Potency Options
// ==================================================

const potencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: "1 Turn • 100 / 75 / 40",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "2 Turns • 250 / 150 / 100",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "3 Turns • 500 / 350 / 200",
  },
];

const Remembrance = ({
  ParentMastery,
  active,
  updateSpell,
}: RemembranceProps) => {
  // ==================================================
  // State
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  // ==================================================
  // Spell Calculations
  // ==================================================

  const masteryType = ParentMastery.getType() as keyof typeof spellTable;

  const selectedStats = spellTable[masteryType]?.[selectedPotency];

  const cost = selectedStats?.cost ?? 0;
  const turns = selectedStats?.turns ?? 1;

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
    }
  }, [active]);

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      updateSpell("potency", new Potency());
      return;
    }

    const potency = new Potency();

    switch (selectedPotency) {
      case "MINOR":
        potency.minor();
        break;

      case "MAJOR":
        potency.major();
        break;

      case "EXTREME":
        potency.extreme();
        break;
    }

    updateSpell("cost", cost);
    updateSpell("potency", potency);
  }, [active, cost, selectedPotency, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  if (!active) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <ClockIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Remembrance</h1>
      </div>

      {/* ================================================== */}
      {/* Spell Techniques Table */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* Spell Properties */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h2 className="mb-4 border-b border-gray-700 pb-3 text-lg font-semibold text-cyan-400">
          Spell Properties
        </h2>

        {/* ================================================== */}
        {/* Potency Selection */}
        {/* ================================================== */}

        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* ================================================== */}
      {/* Final Spell Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Potency</span>
            <span className="font-semibold text-orange-400">
              {selectedPotency}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Range</span>
            <span className="font-semibold text-orange-400">Radial</span>
          </div>

          <div className="flex justify-between">
            <span>Duration</span>
            <span className="font-semibold text-orange-400">
              {turns} {turns === 1 ? "Turn" : "Turns"}
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Manna</span>
            <span className="font-semibold text-orange-400">{cost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Remembrance;
