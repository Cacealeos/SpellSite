import { useEffect, useState } from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
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
// Constants
// ==================================================

const BASE_VITALITY = 30;
const MAX_VITALITY = 1000;
const MAX_ENDURANCE = 8;

const MASTERY_COSTS = {
  NOVICE: {
    endurance: 90,
    vitality: 20,
  },
  INTERMEDIATE: {
    endurance: 60,
    vitality: 15,
  },
  MASTERED: {
    endurance: 30,
    vitality: 10,
  },
};

const FIELD_SIZES = {
  TINY: {
    label: "Tiny",
    multiplier: 0.5,
  },
  SIZEABLE: {
    label: "Sizeable",
    multiplier: 1,
  },
  ENORMOUS: {
    label: "Enormous",
    multiplier: 2,
  },
  GARGANTUAN: {
    label: "Gargantuan",
    multiplier: 4,
  },
};

type FieldSize = keyof typeof FIELD_SIZES;

const RESISTANT_DAMAGE = [
  "THERMAL",
  "VORPAL",
  "CONCUSSIVE",
  "KINETIC",
  "EXPLOSIVE",
];

const VULNERABLE_DAMAGE = ["PRESSURE", "GRAVITY", "ELECTRIC", "DIMENSIONAL"];

// ==================================================
// Component
// ==================================================

const ManifestForceField = ({
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

  const [endurance, setEndurance] = useState(0);

  const [vitality, setVitality] = useState(BASE_VITALITY);

  const [fieldSize, setFieldSize] = useState<FieldSize>("SIZEABLE");

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const masteryStats = MASTERY_COSTS[mastery];

  // ==================================================
  // Field Size
  // ==================================================

  const selectedSize = FIELD_SIZES[fieldSize];

  // ==================================================
  // Cost Calculations
  // ==================================================

  const enduranceCost = endurance * masteryStats.endurance;

  const additionalVitality = vitality - BASE_VITALITY;

  const vitalityCost = additionalVitality * masteryStats.vitality;

  const subtotal = enduranceCost + vitalityCost;

  const finalCost = Math.ceil(subtotal * selectedSize.multiplier);

  // ==================================================
  // Resistance Thresholds
  // ==================================================

  const resistanceThreshold = endurance + 2;

  const vulnerabilityThreshold = endurance - 2;

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", finalCost);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Manifest Force Field
        </h1>
      </div>

      {/* ================================================== */}
      {/* Spell Techniques Table */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* Field Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Field Configuration
        </h3>

        <div className="space-y-5">
          {/* ================================================== */}
          {/* Endurance */}
          {/* ================================================== */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Endurance (Max {MAX_ENDURANCE})
            </span>

            <input
              type="number"
              min={0}
              max={MAX_ENDURANCE}
              step={1}
              value={endurance}
              onChange={(e) =>
                setEndurance(
                  Math.min(
                    MAX_ENDURANCE,
                    Math.max(0, Math.trunc(Number(e.target.value) || 0)),
                  ),
                )
              }
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />

            <span className="mt-1 block text-sm text-gray-400">
              {masteryStats.endurance} mana per Endurance point.
            </span>
          </label>

          {/* ================================================== */}
          {/* Vitality */}
          {/* ================================================== */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Vitality (Max {MAX_VITALITY})
            </span>

            <input
              type="number"
              min={BASE_VITALITY}
              max={MAX_VITALITY}
              step={1}
              value={vitality}
              onChange={(e) =>
                setVitality(
                  Math.min(
                    MAX_VITALITY,
                    Math.max(
                      BASE_VITALITY,
                      Math.trunc(Number(e.target.value) || BASE_VITALITY),
                    ),
                  ),
                )
              }
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />

            <span className="mt-1 block text-sm text-gray-400">
              Base Vitality: {BASE_VITALITY}. Additional Vitality costs{" "}
              {masteryStats.vitality} mana per point.
            </span>
          </label>

          {/* ================================================== */}
          {/* Field Size */}
          {/* ================================================== */}

          <div>
            <span className="mb-3 block font-semibold text-gray-300">
              Field Size
            </span>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(Object.keys(FIELD_SIZES) as FieldSize[]).map((size) => {
                const option = FIELD_SIZES[size];
                const selected = fieldSize === size;

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFieldSize(size)}
                    className={`rounded-lg border p-3 text-center transition-colors ${
                      selected
                        ? "border-cyan-400 bg-cyan-950 text-cyan-300"
                        : "border-gray-600 bg-gray-900 text-gray-300 hover:border-cyan-600"
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>

                    <div className="mt-1 text-sm opacity-80">
                      ×{option.multiplier}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Damage Interactions */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Damage Interactions
        </h3>

        {/* ================================================== */}
        {/* Significantly Resistant */}
        {/* ================================================== */}

        <div className="rounded-lg border border-green-900 bg-green-950/30 p-4">
          <h4 className="mb-2 font-semibold text-green-400">
            Significantly Resistant
          </h4>

          <p className="mb-3 text-sm text-gray-300">
            The field is significantly resistant to damage with Power equal to
            or less than its Endurance + 2.
          </p>

          <div className="mb-3 flex justify-between border-b border-green-900 pb-2">
            <span className="text-gray-300">Power Threshold</span>

            <span className="font-bold text-green-400">
              ≤ {resistanceThreshold}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {RESISTANT_DAMAGE.map((type) => (
              <span
                key={type}
                className="rounded-md border border-green-800 bg-green-950 px-3 py-1 text-sm font-semibold text-green-300"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* ================================================== */}
        {/* Vulnerable */}
        {/* ================================================== */}

        <div className="mt-4 rounded-lg border border-red-900 bg-red-950/30 p-4">
          <h4 className="mb-2 font-semibold text-red-400">Vulnerable</h4>

          <p className="mb-3 text-sm text-gray-300">
            The field is vulnerable to damage with Power equal to or greater
            than its Endurance - 2.
          </p>

          <div className="mb-3 flex justify-between border-b border-red-900 pb-2">
            <span className="text-gray-300">Power Threshold</span>

            <span className="font-bold text-red-400">
              ≥ {vulnerabilityThreshold}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {VULNERABLE_DAMAGE.map((type) => (
              <span
                key={type}
                className="rounded-md border border-red-800 bg-red-950 px-3 py-1 text-sm font-semibold text-red-300"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Spell Properties */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Spell Properties
        </h3>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          <div className="flex justify-between">
            <span>Endurance</span>

            <span className="font-semibold text-cyan-400">{endurance}</span>
          </div>

          <div className="flex justify-between">
            <span>Vitality</span>

            <span className="font-semibold text-cyan-400">{vitality}</span>
          </div>

          <div className="flex justify-between">
            <span>Field Size</span>

            <span className="font-semibold text-cyan-400">
              {selectedSize.label}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Size Multiplier</span>

            <span className="font-semibold text-cyan-400">
              ×{selectedSize.multiplier}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Endurance Cost</span>

            <span className="font-semibold text-cyan-400">{enduranceCost}</span>
          </div>

          <div className="flex justify-between">
            <span>Vitality Cost</span>

            <span className="font-semibold text-cyan-400">{vitalityCost}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Subtotal</span>

            <span className="font-semibold text-cyan-400">{subtotal}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManifestForceField;
