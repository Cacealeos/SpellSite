import { useEffect, useState } from "react";
import { ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";
type AOEType = "SMALL" | "MODERATE" | "LARGE";
type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type NegateProps = {
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
// Potency Options
// ==================================================

const potencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: "35 / 25 / 15",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "65 / 55 / 45",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "95 / 85 / 75",
  },
];

// ==================================================
// Area of Effect Options
// ==================================================

const aoeOptions = [
  {
    value: "SMALL" as const,
    label: "Small Area",
    description: "Cost ×1",
    multiplier: 1,
  },
  {
    value: "MODERATE" as const,
    label: "Moderate Area",
    description: "Cost ×1.5",
    multiplier: 1.5,
  },
  {
    value: "LARGE" as const,
    label: "Large Area",
    description: "Cost ×3",
    multiplier: 3,
  },
];

// ==================================================
// Mastery Costs
// ==================================================

const masteryCosts: Record<MasteryType, Record<PotencyType, number>> = {
  NOVICE: {
    MINOR: 35,
    MAJOR: 65,
    EXTREME: 95,
  },
  INTERMEDIATE: {
    MINOR: 25,
    MAJOR: 55,
    EXTREME: 85,
  },
  MASTERED: {
    MINOR: 15,
    MAJOR: 45,
    EXTREME: 75,
  },
};

// ==================================================
// Component
// ==================================================

const Negate = ({ ParentMastery, active, updateSpell }: NegateProps) => {
  // ==================================================
  // State
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<PotencyType>("MINOR");

  const [selectedAOE, setSelectedAOE] = useState<AOEType>("SMALL");

  const [counterSpell, setCounterSpell] = useState(false);

  // ==================================================
  // Spell Calculations
  // ==================================================

  const masteryType = ParentMastery.getType() as MasteryType;

  const baseCost = masteryCosts[masteryType]?.[selectedPotency] ?? 0;

  const selectedAOEOption = aoeOptions.find(
    (option) => option.value === selectedAOE,
  );

  const aoeMultiplier = selectedAOEOption?.multiplier ?? 1;

  const finalCost = baseCost * aoeMultiplier;

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
      setSelectedAOE("SMALL");
      setCounterSpell(false);
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

    updateSpell("cost", finalCost);
    updateSpell("potency", spellPotency);
  }, [active, selectedPotency, finalCost, updateSpell]);

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
        <ShieldExclamationIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Negate</h1>
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
        {/* Spell Properties Header */}
        {/* ================================================== */}

        <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-700 pb-3">
          <h2 className="text-lg font-semibold text-cyan-400">
            Spell Properties
          </h2>

          {/* ================================================== */}
          {/* Counter Spell Button */}
          {/* ================================================== */}

          <button
            type="button"
            onClick={() => setCounterSpell(!counterSpell)}
            className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
              counterSpell
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white"
            }`}
          >
            Counter Spell
          </button>
        </div>

        {/* ================================================== */}
        {/* Counter Spell Caption */}
        {/* ================================================== */}

        {counterSpell && (
          <p className="mb-4 text-sm text-red-400">
            Counter Spell allows Negate to be used defensively against an
            opposing spell.
          </p>
        )}

        {/* ================================================== */}
        {/* Potency Selection */}
        {/* ================================================== */}

        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />

        {/* ================================================== */}
        {/* Area of Effect */}
        {/* ================================================== */}

        <div className="mt-6 border-t border-gray-700 pt-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-300">
            Area of Effect
          </h3>

          <div className="space-y-3">
            {aoeOptions.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-md border bg-gray-900 px-4 py-3 transition hover:border-orange-500 ${
                  selectedAOE === option.value
                    ? "border-orange-500"
                    : "border-gray-700"
                }`}
              >
                <div>
                  <p className="font-medium text-gray-100">{option.label}</p>

                  <p className="text-sm text-gray-400">{option.description}</p>
                </div>

                <input
                  type="radio"
                  name="negate-aoe"
                  checked={selectedAOE === option.value}
                  onChange={() => setSelectedAOE(option.value)}
                  className="h-5 w-5 accent-orange-500"
                />
              </label>
            ))}
          </div>
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
          {/* Area of Effect */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>AOE</span>

            <span className="font-semibold text-orange-400">
              {selectedAOEOption?.label ?? "Small Area"}
            </span>
          </div>

          {/* ================================================== */}
          {/* Range */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Range</span>

            <span className="font-semibold text-orange-400">Radial</span>
          </div>

          {/* ================================================== */}
          {/* Base Manna */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Base Manna</span>

            <span className="font-semibold text-orange-400">{baseCost}</span>
          </div>

          {/* ================================================== */}
          {/* AOE Multiplier */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>AOE Multiplier</span>

            <span className="font-semibold text-orange-400">
              ×{aoeMultiplier}
            </span>
          </div>

          {/* ================================================== */}
          {/* Counter Spell */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Counter Spell</span>

            <span
              className={`font-semibold ${
                counterSpell ? "text-red-400" : "text-orange-400"
              }`}
            >
              {counterSpell ? "Enabled" : "Disabled"}
            </span>
          </div>

          {/* ================================================== */}
          {/* Final Manna */}
          {/* ================================================== */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Manna</span>

            <span className="font-semibold text-orange-400">{finalCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Negate;
