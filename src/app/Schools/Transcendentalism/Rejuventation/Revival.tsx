import { useEffect, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type RevivalProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

// ==================================================
// Potency Configuration
// ==================================================

const potencyOptions = [
  {
    value: "MINOR",
    label: "Minor",
    description: "5% Vitality | 150 / 100 / 50 Manna",
  },
  {
    value: "MAJOR",
    label: "Major",
    description: "15% Vitality | 250 / 175 / 100 Manna",
  },
  {
    value: "EXTREME",
    label: "Extreme",
    description: "45% Vitality | 350 / 225 / 150 Manna",
  },
];

// ==================================================
// Potency Costs
// ==================================================

const potencyCosts: Record<PotencyType, Record<MasteryType, number>> = {
  MINOR: {
    NOVICE: 150,
    INTERMEDIATE: 100,
    MASTERED: 50,
  },
  MAJOR: {
    NOVICE: 250,
    INTERMEDIATE: 175,
    MASTERED: 100,
  },
  EXTREME: {
    NOVICE: 350,
    INTERMEDIATE: 225,
    MASTERED: 150,
  },
};

// ==================================================
// Revival Vitality
// ==================================================

const vitalityPercentages: Record<PotencyType, number> = {
  MINOR: 5,
  MAJOR: 15,
  EXTREME: 45,
};

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": false,
  "Spell Reflex": false,
  "Double Cast": false,
  "Double Pulse": false,
  "Carry Spell": false,
  "Spell Shift": false,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": false,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": false,
  "Auto Cast": false,
  "Rivet Cast": false,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Component
// ==================================================

export default function Revival({
  ParentMastery,
  active,
  updateSpell,
}: RevivalProps) {
  // ==================================================
  // State
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<string>("MINOR");

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  // ==================================================
  // Potency Calculations
  // ==================================================

  const potency = selectedPotency as PotencyType;

  const vitality = vitalityPercentages[potency] ?? 0;

  // ==================================================
  // Cost Calculations
  // ==================================================

  const finalCost = potencyCosts[potency]?.[mastery] ?? 0;

  const finalTTT = 0;

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
    updateSpell("ttt", finalTTT);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // Reset When Inactive
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
    }
  }, [active]);

  // ==================================================
  // Render
  // ==================================================

  if (!active) return null;

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <HeartIcon className="h-8 w-8 text-cyan-400" />

        <div>
          <h1 className="text-2xl font-bold text-cyan-400">Revival</h1>

          <p className="mt-1 text-sm text-gray-400">Revives Deceased Spirit</p>
        </div>
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
        <h3 className="mb-4 border-b border-gray-700 pb-3 text-lg font-semibold text-orange-400">
          Spell Properties
        </h3>

        <div className="space-y-3 text-gray-300">
          {/* Effect Type */}

          <div className="flex justify-between gap-3">
            <span>Effect Type</span>

            <span className="font-semibold text-cyan-400">REVIVAL</span>
          </div>

          {/* Target */}

          <div className="flex justify-between gap-3">
            <span>Target</span>

            <span className="font-semibold text-cyan-400">Deceased Spirit</span>
          </div>

          {/* Mastery */}

          <div className="flex justify-between gap-3">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          {/* Potency */}

          <div className="flex justify-between gap-3">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">{potency}</span>
          </div>

          {/* Starting Vitality */}

          <div className="flex justify-between gap-3">
            <span>Starting Vitality</span>

            <span className="font-semibold text-cyan-400">{vitality}%</span>
          </div>

          {/* TTT */}

          <div className="flex justify-between gap-3">
            <span>TTT</span>

            <span className="font-semibold text-cyan-400">{finalTTT}</span>
          </div>

          {/* Total Cost */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Total Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Potency Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Potency Configuration
        </h3>

        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* ================================================== */}
      {/* Revival Effect */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Revival Effect
        </h3>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-5 text-center">
          <p className="mb-2 text-sm text-gray-400">Spirit is revived at</p>

          <p className="text-4xl font-bold text-cyan-400">{vitality}%</p>

          <p className="mt-2 text-sm font-semibold text-gray-300">
            Starting Vitality
          </p>
        </div>

        {/* Vitality by Potency */}

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(
            [
              ["MINOR", 5],
              ["MAJOR", 15],
              ["EXTREME", 45],
            ] as const
          ).map(([level, percentage]) => {
            const selected = potency === level;

            return (
              <div
                key={level}
                className={`rounded-lg border p-4 text-center ${
                  selected
                    ? "border-cyan-500 bg-cyan-950/30"
                    : "border-gray-700 bg-gray-900"
                }`}
              >
                <p className="mb-2 text-xs font-semibold text-gray-400">
                  {level}
                </p>

                <p
                  className={`text-xl font-bold ${
                    selected ? "text-cyan-400" : "text-gray-300"
                  }`}
                >
                  {percentage}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================== */}
      {/* Cost Breakdown */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Cost Breakdown
        </h3>

        <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          {/* Selected Potency */}

          <div className="flex justify-between gap-3 text-gray-300">
            <span>Selected Potency</span>

            <span className="font-semibold text-cyan-400">{potency}</span>
          </div>

          {/* Mastery */}

          <div className="flex justify-between gap-3 text-gray-300">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          {/* Starting Vitality */}

          <div className="flex justify-between gap-3 text-gray-300">
            <span>Starting Vitality</span>

            <span className="font-semibold text-cyan-400">{vitality}%</span>
          </div>

          {/* Final Cost */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3 text-gray-300">
            <span className="font-semibold text-gray-100">Total Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Data Flags */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Data Flags
        </h3>

        <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
          {/* Effect Type */}

          <div className="flex justify-between gap-3">
            <span>Effect Type</span>

            <span className="font-semibold text-cyan-400">REVIVAL</span>
          </div>

          {/* Target */}

          <div className="flex justify-between gap-3">
            <span>Target</span>

            <span className="font-semibold text-cyan-400">DECEASED SPIRIT</span>
          </div>

          {/* Potency */}

          <div className="flex justify-between gap-3">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">{potency}</span>
          </div>

          {/* Starting Vitality */}

          <div className="flex justify-between gap-3">
            <span>Starting Vitality</span>

            <span className="font-semibold text-cyan-400">{vitality}%</span>
          </div>

          {/* TTT */}

          <div className="flex justify-between gap-3">
            <span>TTT</span>

            <span className="font-semibold text-cyan-400">{finalTTT}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Spell Description */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Description
        </h3>

        <div className="space-y-3 text-sm leading-relaxed text-gray-300">
          <p>Revival restores a deceased Spirit to life.</p>

          <p>
            The selected Potency determines the Spirit&apos;s starting Vitality:
            Minor restores 5%, Major restores 15%, and Extreme restores 45%.
          </p>

          <p>
            Manna cost scales with both Potency and Mastery. Higher Mastery
            reduces the cost of Revival.
          </p>
        </div>
      </div>
    </>
  );
}
