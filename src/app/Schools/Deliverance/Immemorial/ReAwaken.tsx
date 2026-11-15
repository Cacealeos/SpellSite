import { useEffect, useState } from "react";
import { ArrowUturnUpIcon } from "@heroicons/react/24/solid";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type ReAwakenProps = {
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
    MINOR: 90,
    MAJOR: 190,
    EXTREME: 330,
  },
  INTERMEDIATE: {
    MINOR: 70,
    MAJOR: 150,
    EXTREME: 270,
  },
  MASTERED: {
    MINOR: 50,
    MAJOR: 110,
    EXTREME: 210,
  },
};

// ==================================================
// Potency Effects
// ==================================================

const potencyEffects: Record<
  PotencyType,
  {
    percentage: number;
    turns: number;
  }
> = {
  MINOR: {
    percentage: 33,
    turns: 1,
  },
  MAJOR: {
    percentage: 67,
    turns: 2,
  },
  EXTREME: {
    percentage: 100,
    turns: 3,
  },
};

// ==================================================
// Potency Options
// ==================================================

const potencyOptions = [
  {
    value: "MINOR",
    label: "Minor",
    description: "33% • 1 Turn • 90 / 70 / 50",
  },
  {
    value: "MAJOR",
    label: "Major",
    description: "67% • 2 Turns • 190 / 150 / 110",
  },
  {
    value: "EXTREME",
    label: "Extreme",
    description: "100% • 3 Turns • 330 / 270 / 210",
  },
];

// ==================================================
// Soul Cast Constants
// ==================================================

const SOUL_CAST_COST = 150;
const SOUL_CAST_BONUS_TURNS = 1;

// ==================================================
// Component
// ==================================================

export default function ReAwaken({
  ParentMastery,
  active,
  updateSpell,
}: ReAwakenProps) {
  // ==================================================
  // State
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<string>("MINOR");

  const [soulCast, setSoulCast] = useState(false);
  const [spellRecovery, setSpellRecovery] = useState(false);

  // ==================================================
  // Mastery
  // ==================================================

  const masteryType = ParentMastery.getType() as MasteryType;

  // ==================================================
  // Potency Calculations
  // ==================================================

  const potency = selectedPotency as PotencyType;

  const selectedEffect = potencyEffects[potency];

  // ==================================================
  // Soul Cast Calculations
  // ==================================================

  const soulCost = soulCast ? SOUL_CAST_COST : 0;

  const bonusTurns = soulCast ? SOUL_CAST_BONUS_TURNS : 0;

  const baseTurns = selectedEffect.turns;

  const finalTurns = baseTurns + bonusTurns;

  const finalTTT = 0;

  // ==================================================
  // Spell Recovery Calculations
  // ==================================================

  const RECOVERY_COST_MULTIPLIER = 0.75;

  // Normal casting cost remains unchanged.
  const finalCost = costTable[masteryType]?.[potency] ?? 0;

  // Recovery applies only when re-casting
  // an interrupted Immemorial spell.
  const recoveryCost = Math.ceil(finalCost * RECOVERY_COST_MULTIPLIER);

  const displayedRecoveryCost = spellRecovery ? recoveryCost : null;

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
      setSoulCast(false);
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

    updateSpell("cost", finalCost);
    updateSpell("ttt", finalTTT);
    updateSpell("potency", spellPotency);
  }, [active, finalCost, finalTTT, potency, updateSpell]);

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
        <ArrowUturnUpIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">ReAwaken</h1>
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
        {/* Header and Spell Technique Buttons */}
        {/* ================================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h2 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Soul Cast */}

            <button
              type="button"
              aria-pressed={soulCast}
              onClick={() => setSoulCast((prev) => !prev)}
              className={techniqueButtonClass(soulCast)}
            >
              Soul Cast
            </button>

            {/* Spell Recovery */}

            <button
              type="button"
              aria-pressed={spellRecovery}
              onClick={() => setSpellRecovery((prev) => !prev)}
              className={techniqueButtonClass(spellRecovery)}
            >
              Spell Recovery
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Active Spell Technique Descriptions */}
        {/* ================================================== */}

        {(soulCast || spellRecovery) && (
          <div className="mb-5 space-y-3">
            {/* Soul Cast Description */}

            {soulCast && (
              <div className="rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
                <p>
                  <span className="font-semibold">Soul Cast:</span> Consumes 150
                  Soul from the target to grant one additional turn of Soul
                  Energy.
                </p>

                <p className="mt-2 text-xs text-purple-300">
                  Soul is removed from the target&apos;s current supply, not
                  their maximum Soul.
                </p>
              </div>
            )}

            {/* Spell Recovery Description */}

            {spellRecovery && (
              <div className="rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
                <p>
                  <span className="font-semibold">Spell Recovery:</span>{" "}
                  Interrupted Immemorial spells may be re-cast for 75% of their
                  normal Manna cost.
                </p>

                <p className="mt-2 text-xs text-purple-300">
                  This discount applies only when re-casting an interrupted
                  spell.
                </p>
              </div>
            )}
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
      </div>

      {/* ================================================== */}
      {/* Soul Cast Configuration */}
      {/* ================================================== */}

      {soulCast && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Soul Cast Configuration
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Soul Cost */}

            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center">
              <p className="mb-2 text-sm text-gray-400">Soul Consumed</p>

              <p className="text-2xl font-bold text-purple-400">{soulCost}</p>

              <p className="mt-2 text-xs text-gray-400">From Target Supply</p>
            </div>

            {/* Bonus Turns */}

            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center">
              <p className="mb-2 text-sm text-gray-400">Bonus Soul Energy</p>

              <p className="text-2xl font-bold text-cyan-400">
                +{bonusTurns} Turn
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Added to Base Duration
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-purple-700 bg-purple-950/20 p-4 text-sm text-purple-200">
            Soul Cast consumes Soul from the target's current supply only. The
            target's maximum Soul remains unchanged.
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* Soul Energy Duration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Soul Energy Duration
        </h3>

        <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between gap-3 text-gray-300">
            <span>Base Duration</span>

            <span className="font-semibold text-cyan-400">
              {baseTurns} {baseTurns === 1 ? "Turn" : "Turns"}
            </span>
          </div>

          <div className="flex justify-between gap-3 text-gray-300">
            <span>Soul Cast Bonus</span>

            <span className="font-semibold text-purple-400">
              +{bonusTurns} {bonusTurns === 1 ? "Turn" : "Turns"}
            </span>
          </div>

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Total Duration</span>

            <span className="text-xl font-bold text-cyan-400">
              {finalTurns} {finalTurns === 1 ? "Turn" : "Turns"}
            </span>
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
            ReAwaken grants Soul Energy to the target. The strength and duration
            depend on the selected Potency.
          </p>

          <p>
            Minor grants 33% Soul Energy for 1 turn, Major grants 67% for 2
            turns, and Extreme grants 100% for 3 turns.
          </p>

          <p>
            Soul Cast consumes 150 Soul from the target's current supply to
            extend the duration by one turn. This does not reduce the target's
            maximum Soul.
          </p>
        </div>
      </div>
    </>
  );
}
