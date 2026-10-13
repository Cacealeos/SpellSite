import { useEffect, useState } from "react";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import Select from "@/app/Select";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

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
  "Auto Cast": true,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Types
// ==================================================

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

// ==================================================
// Potency Data
// ==================================================

const potencyStats = {
  MINOR: {
    NOVICE: { cost: 60, base: 6 },
    INTERMEDIATE: { cost: 45, base: 6 },
    MASTERED: { cost: 30, base: 6 },
  },
  MAJOR: {
    NOVICE: { cost: 120, base: 8 },
    INTERMEDIATE: { cost: 100, base: 8 },
    MASTERED: { cost: 80, base: 8 },
  },
  EXTREME: {
    NOVICE: { cost: 200, base: 10 },
    INTERMEDIATE: { cost: 175, base: 10 },
    MASTERED: { cost: 150, base: 10 },
  },
};

// ==================================================
// Potency Options
// ==================================================

const potencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: "Cost: 60 / 45 / 30",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "Cost: 120 / 100 / 80",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "Cost: 200 / 175 / 150",
  },
];

// ==================================================
// AOE Options
// ==================================================

const sizes = ["Small AOE", "Moderate AOE", "Large AOE"];

// ==================================================
// Component
// ==================================================

const AlterSpatial = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ==================================================
  // State
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<PotencyType>("MINOR");

  const [size, setSize] = useState("Small AOE");

  const [counterSpell, setCounterSpell] = useState(false);

  // ==================================================
  // Mastery
  // ==================================================

  const testMastery = new Mastery();

  const mastery: MasteryType =
    ParentMastery.getType() === testMastery.novice(true)
      ? "NOVICE"
      : ParentMastery.getType() === testMastery.intermediate(true)
        ? "INTERMEDIATE"
        : "MASTERED";

  // ==================================================
  // Derived Values
  // ==================================================

  const currentStats = potencyStats[selectedPotency][mastery];

  const resistanceCheck = currentStats.base;

  const finalCost = currentStats.cost;

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
    updateSpell("base", active ? resistanceCheck : 0);
  }, [active, finalCost, resistanceCheck, updateSpell]);

  // ==================================================
  // Reset
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
      setSize("Small AOE");
      setCounterSpell(false);
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const handlePotencyChange = (potency: PotencyType) => {
    setSelectedPotency(potency);
  };

  const handleSizeChange = (value: string) => {
    setSize(value);
  };

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <ArrowsPointingOutIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Alter Spatial</h1>
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
        {/* ================================================== */}
        {/* Header & Technique Button */}
        {/* ================================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <button
            type="button"
            onClick={() => setCounterSpell(!counterSpell)}
            aria-pressed={counterSpell}
            className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
              counterSpell
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
            }`}
          >
            Counter Spell
          </button>
        </div>

        {/* ================================================== */}
        {/* Technique Caption */}
        {/* ================================================== */}

        {counterSpell && (
          <div className="mb-5 rounded-lg border border-purple-800 bg-purple-950/30 p-3">
            <p className="text-sm leading-relaxed text-gray-300">
              <strong className="text-purple-400">Counter Spell:</strong> Allows
              Transmogrification to be used as a{" "}
              <strong className="text-purple-300">DEFENSIVE</strong> measure.
            </p>
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Damage Type */}

          <div className="flex justify-between">
            <span>Damage Type</span>

            <span className="font-semibold text-cyan-400">DIRECT</span>
          </div>

          {/* Range */}

          <div className="flex justify-between">
            <span>Range</span>

            <span className="font-semibold text-cyan-400">DIRECT</span>
          </div>

          {/* Mastery */}

          <div className="flex justify-between">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          {/* Potency */}

          <div className="flex justify-between">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">
              {selectedPotency}
            </span>
          </div>

          {/* Resistance Check */}

          <div className="flex justify-between">
            <span>Resistance Check</span>

            <span className="font-semibold text-cyan-400">
              {resistanceCheck}
            </span>
          </div>

          {/* AOE */}

          <div className="flex justify-between">
            <span>AOE</span>

            <span className="font-semibold text-cyan-400">{size}</span>
          </div>

          {/* Final Cost */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Potency Selection */}
      {/* ================================================== */}

      <div className="mt-6">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={handlePotencyChange}
        />
      </div>

      {/* ================================================== */}
      {/* Area of Effect */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Area of Effect
        </h3>

        <Select title="AOE" choices={sizes} changeChoice={handleSizeChange} />
      </div>
    </>
  );
};

export default AlterSpatial;
