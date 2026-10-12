import { useEffect, useState } from "react";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type SageBringerProps = {
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
    MINOR: { cost: 90, bonus: 1 },
    MAJOR: { cost: 180, bonus: 2 },
    EXTREME: { cost: 270, bonus: 3 },
  },
  INTERMEDIATE: {
    MINOR: { cost: 60, bonus: 1 },
    MAJOR: { cost: 150, bonus: 2 },
    EXTREME: { cost: 240, bonus: 3 },
  },
  MASTERED: {
    MINOR: { cost: 30, bonus: 1 },
    MAJOR: { cost: 120, bonus: 2 },
    EXTREME: { cost: 210, bonus: 3 },
  },
};

// ==================================================
// Potency Options
// ==================================================

const potencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: "+1 | 90 / 60 / 30",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "+2 | 180 / 150 / 120",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "+3 | 270 / 240 / 210",
  },
];

// ==================================================
// Constants
// ==================================================

const DURATION = 3;

// ==================================================
// Component
// ==================================================

const SageBringer = ({
  ParentMastery,
  active,
  updateSpell,
}: SageBringerProps) => {
  // ==================================================
  // State
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<PotencyType>("MINOR");

  // ==================================================
  // Spell Calculations
  // ==================================================

  const masteryType = ParentMastery.getType() as MasteryType;

  const selectedStats = spellTable[masteryType]?.[selectedPotency];

  const cost = selectedStats?.cost ?? 0;
  const bonus = selectedStats?.bonus ?? 0;

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

    const spellPotency = new Potency();

    switch (selectedPotency) {
      case "MINOR":
        spellPotency.minor();
        break;

      case "MAJOR":
        spellPotency.major();
        break;

      case "EXTREME":
        spellPotency.extreme();
        break;
    }

    updateSpell("cost", cost);
    updateSpell("potency", spellPotency);
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
        <AcademicCapIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Sage Bringer</h1>
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

        {/* ================================================== */}
        {/* Spell Description */}
        {/* ================================================== */}

        <div className="mt-5 border-t border-gray-700 pt-4 text-sm text-gray-400">
          <p>
            Sage Bringer enhances the caster's capabilities based on the
            selected Potency.
          </p>

          <p className="mt-3">
            The effect remains active for three turns after casting.
          </p>
        </div>
      </div>

      {/* ================================================== */}
      {/* Final Spell Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-3 text-gray-300">
          {/* ================================================== */}
          {/* Potency */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Potency</span>

            <span className="font-semibold text-orange-400">
              {selectedPotency}
            </span>
          </div>

          {/* ================================================== */}
          {/* Bonus */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Bonus</span>

            <span className="font-semibold text-orange-400">+{bonus}</span>
          </div>

          {/* ================================================== */}
          {/* Duration */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Duration</span>

            <span className="font-semibold text-orange-400">
              {DURATION} Turns
            </span>
          </div>

          {/* ================================================== */}
          {/* Manna */}
          {/* ================================================== */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Manna</span>

            <span className="font-semibold text-orange-400">{cost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SageBringer;
