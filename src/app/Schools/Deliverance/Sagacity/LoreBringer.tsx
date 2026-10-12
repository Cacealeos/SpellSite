import { useEffect, useState } from "react";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type LoreType = "CRAFT" | "RACE" | "THEOLOGY";

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type LoreBringerProps = {
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
// Lore Options
// ==================================================

const loreOptions = [
  {
    value: "CRAFT" as const,
    label: "Craft",
    description: "×1 Cost",
    multiplier: 1,
  },
  {
    value: "RACE" as const,
    label: "Race",
    description: "×2 Cost",
    multiplier: 2,
  },
  {
    value: "THEOLOGY" as const,
    label: "Theology",
    description: "×5 Cost",
    multiplier: 5,
  },
];

// ==================================================
// Mastery Costs
// ==================================================

const masteryCosts: Record<MasteryType, number> = {
  NOVICE: 300,
  INTERMEDIATE: 200,
  MASTERED: 100,
};

// ==================================================
// Component
// ==================================================

const LoreBringer = ({
  ParentMastery,
  active,
  updateSpell,
}: LoreBringerProps) => {
  // ==================================================
  // State
  // ==================================================

  const [selectedLore, setSelectedLore] = useState<LoreType>("CRAFT");

  // ==================================================
  // Spell Calculations
  // ==================================================

  const masteryType = ParentMastery.getType() as MasteryType;

  const baseCost = masteryCosts[masteryType] ?? 0;

  const selectedOption = loreOptions.find(
    (option) => option.value === selectedLore,
  );

  const multiplier = selectedOption?.multiplier ?? 1;

  const finalCost = baseCost * multiplier;

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedLore("CRAFT");
    }
  }, [active]);

  // ==================================================
  // Update Parent Spell
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

  if (!active) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <BookOpenIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Lore Bringer</h1>
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
        {/* Lore Type Selection */}
        {/* ================================================== */}

        <h3 className="mb-3 text-sm font-semibold text-gray-300">Lore Type</h3>

        <div className="space-y-3">
          {loreOptions.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-md border bg-gray-900 px-4 py-3 transition hover:border-orange-500 ${
                selectedLore === option.value
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
                name="lore-bringer-type"
                checked={selectedLore === option.value}
                onChange={() => setSelectedLore(option.value)}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          ))}
        </div>

        {/* ================================================== */}
        {/* Spell Description */}
        {/* ================================================== */}

        <div className="mt-5 border-t border-gray-700 pt-4 text-sm text-gray-400">
          <p>
            Lore Bringer draws upon a chosen field of knowledge to determine the
            breadth of information recalled.
          </p>

          <p className="mt-3">
            Craft represents practical knowledge, Race represents cultural and
            historical knowledge, and Theology represents divine or spiritual
            knowledge.
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
          {/* Lore Type */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Lore Type</span>

            <span className="font-semibold text-orange-400">
              {selectedOption?.label ?? "Craft"}
            </span>
          </div>

          {/* ================================================== */}
          {/* Base Manna */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Base Manna</span>

            <span className="font-semibold text-orange-400">{baseCost}</span>
          </div>

          {/* ================================================== */}
          {/* Lore Multiplier */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Lore Multiplier</span>

            <span className="font-semibold text-orange-400">×{multiplier}</span>
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

export default LoreBringer;
