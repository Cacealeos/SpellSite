import { useEffect, useState } from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type RepairSealProps = {
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
    description: "150 / 100 / 50 Manna",
  },
  {
    value: "MAJOR",
    label: "Major",
    description: "250 / 175 / 100 Manna",
  },
  {
    value: "EXTREME",
    label: "Extreme",
    description: "350 / 225 / 150 Manna",
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
  "Auto Cast": true,
  "Rivet Cast": false,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Component
// ==================================================

export default function RepairSeal({
  ParentMastery,
  active,
  updateSpell,
}: RepairSealProps) {
  // ==================================================
  // State
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<string>("MINOR");

  const [autoCast, setAutoCast] = useState(false);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  // ==================================================
  // Potency Calculations
  // ==================================================

  const potency = selectedPotency as PotencyType;

  // ==================================================
  // Cost Calculations
  // ==================================================

  const finalCost = potencyCosts[potency]?.[mastery] ?? 0;

  const finalTTT = 0;

  // ==================================================
  // Casting Action
  // ==================================================

  const castingAction = autoCast ? "Interact Action" : "Main Action";

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
    updateSpell("ttt", active ? finalTTT : 0);
    updateSpell("action", active && autoCast ? "INTERACT" : "MAIN");
  }, [active, finalCost, finalTTT, autoCast, updateSpell]);

  // ==================================================
  // Reset When Inactive
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
      setAutoCast(false);
    }
  }, [active]);

  // ==================================================
  // Technique Button Styling
  // ==================================================

  const techniqueButtonClass = (enabled: boolean) =>
    `rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
      enabled
        ? "border-purple-400 bg-purple-700 text-white shadow-md shadow-purple-900/30"
        : "border-gray-600 bg-gray-900 text-gray-300 hover:border-purple-500 hover:text-purple-300"
    }`;

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
        <ShieldCheckIcon className="h-8 w-8 text-cyan-400" />

        <div>
          <h1 className="text-2xl font-bold text-cyan-400">Repair Seal</h1>

          <p className="mt-1 text-sm text-gray-400">
            Restores or repairs a seal.
          </p>
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
        {/* Header and Technique Button */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <button
            type="button"
            aria-pressed={autoCast}
            onClick={() => setAutoCast((prev) => !prev)}
            className={techniqueButtonClass(autoCast)}
          >
            Auto Cast
          </button>
        </div>

        {/* Auto Cast Description */}

        {autoCast && (
          <div className="mb-4 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <span className="font-semibold">Auto Cast:</span> Repair Seal can be
            used as an Interact Action instead of a Main Action.
          </div>
        )}

        {/* Properties */}

        <div className="space-y-3 text-gray-300">
          {/* Effect Type */}

          <div className="flex justify-between gap-3">
            <span>Effect Type</span>

            <span className="font-semibold text-cyan-400">SEAL REPAIR</span>
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

          {/* Casting Action */}

          <div className="flex justify-between gap-3">
            <span>Casting Action</span>

            <span className="font-semibold text-cyan-400">{castingAction}</span>
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

          {/* Auto Cast Modifier */}

          <div className="flex justify-between gap-3 text-gray-300">
            <span>Auto Cast Cost Modifier</span>

            <span className="font-semibold text-cyan-400">None</span>
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

            <span className="font-semibold text-cyan-400">SEAL REPAIR</span>
          </div>

          {/* Potency */}

          <div className="flex justify-between gap-3">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">{potency}</span>
          </div>

          {/* Action */}

          <div className="flex justify-between gap-3">
            <span>Action</span>

            <span className="font-semibold text-cyan-400">
              {autoCast ? "INTERACT" : "MAIN"}
            </span>
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
          <p>
            Repair Seal restores or repairs a seal. Its Manna cost depends on
            the selected Potency and the caster&apos;s Mastery.
          </p>

          <p>
            The Auto Cast technique allows Repair Seal to be performed as an
            Interact Action rather than a Main Action.
          </p>

          <p>Auto Cast does not modify the spell&apos;s Manna cost or TTT.</p>
        </div>
      </div>
    </>
  );
}
