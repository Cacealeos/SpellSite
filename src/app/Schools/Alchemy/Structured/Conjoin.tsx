import { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import { types, Costs } from "./costsData";
import { LinkIcon } from "@heroicons/react/24/solid";
import Select from "@/app/Select";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type ConjoinProps = {
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

const Conjoin = ({ ParentMastery, active, updateSpell }: ConjoinProps) => {
  // ==================================================
  // State
  // ==================================================

  const [type, setType] = useState("Organic");

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  // ==================================================
  // Mastery and Potency Calculations
  // ==================================================

  const typeCosts = Costs[type as keyof typeof Costs];

  const masteryType = ParentMastery.getType();

  const masteryIndex =
    masteryType === "NOVICE"
      ? 0
      : masteryType === "INTERMEDIATE"
        ? 1
        : masteryType === "MASTERED"
          ? 2
          : -1;

  const potencyIndex =
    selectedPotency === "MINOR" ? 0 : selectedPotency === "MAJOR" ? 1 : 2;

  // Preserve the existing cost calculation.
  const cost = typeCosts && masteryIndex >= 0 ? typeCosts[potencyIndex] : 0;

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = typeCosts
    ? [
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
      ]
    : [];

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (active) return;

    setType("Organic");
    setSelectedPotency("MINOR");
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

    updateSpell("cost", cost);
    updateSpell("potency", pot);

    // Conjoin does not intrinsically generate TTT.
    updateSpell("ttt", 0);
  }, [active, type, selectedPotency, cost, updateSpell]);

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
        <LinkIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Conjoin</h1>
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

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Spell Properties
        </h2>

        {/* ================================================== */}
        {/* Conjoin Type */}
        {/* ================================================== */}

        <div>
          <h3 className="mb-3 text-lg font-bold text-orange-400">
            Conjoin Type
          </h3>

          <Select title={type} choices={types} changeChoice={setType} />
        </div>

        {/* ================================================== */}
        {/* Potency Selection */}
        {/* ================================================== */}

        <div className="mt-6 border-t border-gray-700 pt-6">
          <PotencySelector
            options={potencyOptions}
            selectedPotency={selectedPotency}
            setSelectedPotency={setSelectedPotency}
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* Final Spell Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-3 text-gray-300">
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
            <span>Range</span>
            <span className="font-semibold text-orange-400">Direct</span>
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

export default Conjoin;
