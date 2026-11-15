import { useEffect, useState } from "react";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type ReconstructionProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Soul Cast": true,
  "Full Cast": true,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": true,
  "Aura Surge": false,
};

// ==================================================
// Cost Table
// ==================================================

const costTable: Record<MasteryType, Record<PotencyType, number>> = {
  NOVICE: {
    MINOR: 45,
    MAJOR: 95,
    EXTREME: 165,
  },
  INTERMEDIATE: {
    MINOR: 35,
    MAJOR: 75,
    EXTREME: 135,
  },
  MASTERED: {
    MINOR: 25,
    MAJOR: 55,
    EXTREME: 105,
  },
};

// ==================================================
// Potency Options
// ==================================================

const potencyOptions = [
  {
    value: "MINOR",
    label: "Minor",
    description: "45 / 35 / 25",
  },
  {
    value: "MAJOR",
    label: "Major",
    description: "95 / 75 / 55",
  },
  {
    value: "EXTREME",
    label: "Extreme",
    description: "165 / 135 / 105",
  },
];

// ==================================================
// Spell Recovery
// ==================================================

const RECOVERY_MULTIPLIER = 0.75;

// ==================================================
// Component
// ==================================================

export default function Reconstruction({
  ParentMastery,
  active,
  updateSpell,
}: ReconstructionProps) {
  // ==================================================
  // State
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<string>("MINOR");

  const [spellRecovery, setSpellRecovery] = useState(false);

  // ==================================================
  // Spell Calculations
  // ==================================================

  const masteryType = ParentMastery.getType() as MasteryType;

  const potency = selectedPotency as PotencyType;

  const baseCost = costTable[masteryType]?.[potency] ?? 0;

  // ==================================================
  // Spell Recovery Calculations
  // ==================================================

  // Recovery applies only when re-casting an
  // interrupted Immemorial spell.

  const recoveryCost = Math.ceil(baseCost * RECOVERY_MULTIPLIER);

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
      setSpellRecovery(false);
    }
  }, [active]);

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      updateSpell("ttt", 0);
      updateSpell("potency", new Potency());
      return;
    }

    const spellPotency = new Potency();

    switch (potency) {
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

    updateSpell("cost", baseCost);
    updateSpell("ttt", 0);
    updateSpell("potency", spellPotency);
  }, [active, baseCost, potency, updateSpell]);

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
        <WrenchScrewdriverIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Reconstruction</h1>
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

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h2>

          <button
            type="button"
            aria-pressed={spellRecovery}
            onClick={() => setSpellRecovery((prev) => !prev)}
            className={techniqueButtonClass(spellRecovery)}
          >
            Spell Recovery
          </button>
        </div>

        {/* ================================================== */}
        {/* Spell Recovery Description */}
        {/* ================================================== */}

        {spellRecovery && (
          <div className="mb-5 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <p>
              <span className="font-semibold">Spell Recovery:</span> Interrupted
              Immemorial spells may be re-cast for 75% of their normal Manna
              cost.
            </p>

            <p className="mt-2 text-xs text-purple-300">
              Recovery Cost:{" "}
              <span className="font-semibold text-purple-200">
                {recoveryCost} Manna
              </span>
            </p>
          </div>
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
        {/* Range */}
        {/* ================================================== */}

        <div className="mt-5 flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 p-4">
          <span className="font-semibold text-orange-400">Range</span>

          <span className="font-semibold text-cyan-400">RADIAL</span>
        </div>
      </div>
    </>
  );
}
