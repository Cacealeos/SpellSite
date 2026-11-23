import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

import { Mastery, Potency, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// TYPES
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

// ==================================================
// SPELL TECHNIQUES
// ==================================================

const Techniques = {
  "Quick Spell": false,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": false,
  "Soul Cast": true,
  "Full Cast": false,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Aura Surge": false,
};

// ==================================================
// POTENCY DATA
// ==================================================

const potencyData: Record<
  PotencyType,
  {
    label: string;
    size: string;
    cost: Record<MasteryType, number>;
  }
> = {
  MINOR: {
    label: "Minor",
    size: "Tiny to Sizeable",
    cost: {
      NOVICE: 40,
      INTERMEDIATE: 30,
      MASTERED: 20,
    },
  },

  MAJOR: {
    label: "Major",
    size: "Size to Enormous",
    cost: {
      NOVICE: 100,
      INTERMEDIATE: 80,
      MASTERED: 60,
    },
  },

  EXTREME: {
    label: "Extreme",
    size: "Enormous to Gargantuan",
    cost: {
      NOVICE: 200,
      INTERMEDIATE: 160,
      MASTERED: 120,
    },
  },
};

// ==================================================
// CONSTANTS
// ==================================================

const SOUL_CAST_COST = 50;

const potencyOptions: PotencyType[] = ["MINOR", "MAJOR", "EXTREME"];

const potencyColors: Record<PotencyType, string> = {
  MINOR: "border-green-500 text-green-400",
  MAJOR: "border-cyan-500 text-cyan-400",
  EXTREME: "border-purple-500 text-purple-400",
};

// ==================================================
// COMPONENT
// ==================================================

const Bewitch = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ==================================================
  // STATE
  // ==================================================

  const [potency, setPotency] = useState<Potency>(() => new Potency(undefined));

  const [soulCast, setSoulCast] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // MASTERY
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  // ==================================================
  // POTENCY
  // ==================================================

  const potencyType = potency.getType() as PotencyType;

  const selectedPotency = potencyData[potencyType];

  const changePotency = (type: PotencyType) => {
    const nextPotency = new Potency(undefined);

    switch (type) {
      case "MINOR":
        nextPotency.minor();
        break;

      case "MAJOR":
        nextPotency.major();
        break;

      case "EXTREME":
        nextPotency.extreme();
        break;
    }

    setPotency(nextPotency);
  };

  // ==================================================
  // MANA COST CALCULATIONS
  // ==================================================

  const finalCost = selectedPotency.cost[mastery];

  // ==================================================
  // AOE CALCULATIONS
  // ==================================================

  const baseAOE = "SMALL";

  const hyperAOEIncrease = hyperSpell ? 1 : 0;

  const totalAOEIncrease = hyperAOEIncrease;

  // ==================================================
  // SOUL CAST
  // ==================================================

  const soulCost = soulCast ? SOUL_CAST_COST : 0;

  // ==================================================
  // PARENT SPELL UPDATE
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
    updateSpell("ttt", 0);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // RESET
  // ==================================================

  useEffect(() => {
    if (!active) {
      setPotency(new Potency(undefined));
      setSoulCast(false);
      setHyperSpell(false);
    }
  }, [active]);

  // ==================================================
  // HANDLERS
  // ==================================================

  const techniqueButtonClass = (enabled: boolean) =>
    `rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
      enabled
        ? "bg-purple-600 text-white"
        : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
    }`;

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* SPELL TITLE */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <SparklesIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Bewitch</h1>
      </div>

      {/* ================================================== */}
      {/* SPELL TECHNIQUES TABLE */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* POTENCY */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Potency
        </h3>

        <div className="grid gap-3 sm:grid-cols-3">
          {potencyOptions.map((option) => {
            const selected = potencyType === option;
            const data = potencyData[option];

            return (
              <button
                key={option}
                type="button"
                onClick={() => changePotency(option)}
                aria-pressed={selected}
                className={`rounded-lg border-2 p-4 text-left transition-colors ${
                  selected
                    ? `${potencyColors[option]} bg-gray-900`
                    : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500"
                }`}
              >
                <div className="font-bold">{data.label}</div>

                <p className="mt-2 text-xs text-gray-400">{data.size}</p>

                <p className="mt-3 text-sm font-semibold">
                  {data.cost[mastery]} Mana
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================== */}
      {/* SPELL PROPERTIES */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        {/* ================================================== */}
        {/* HEADER & TECHNIQUE BUTTONS */}
        {/* ================================================== */}

        <div className="mb-4 flex items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="shrink-0 text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <div className="flex flex-wrap justify-end gap-1">
            <button
              type="button"
              onClick={() => setSoulCast((prev) => !prev)}
              aria-pressed={soulCast}
              className={techniqueButtonClass(soulCast)}
            >
              Soul Cast
            </button>

            <button
              type="button"
              onClick={() => setHyperSpell((prev) => !prev)}
              aria-pressed={hyperSpell}
              className={techniqueButtonClass(hyperSpell)}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* TECHNIQUE DESCRIPTIONS */}
        {/* ================================================== */}

        {(soulCast || hyperSpell) && (
          <div className="mb-5 space-y-3">
            {soulCast && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Soul Cast:</strong> Spend
                  50 Soul to insert a consciousness inside a Primordial and
                  attempt to comprehend its thoughts using an Int check (GMD).
                </p>
              </div>
            )}

            {hyperSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Hyper Spell:</strong>{" "}
                  Increases the AOE level of all AOE effects for Primal Spells.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* SPELL STATISTICS */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Primordial Size */}

          <div className="flex justify-between gap-3">
            <span>Primordial Size</span>

            <span className="font-semibold text-cyan-400">
              {selectedPotency.size}
            </span>
          </div>

          {/* Base AOE */}

          <div className="flex justify-between gap-3">
            <span>Base AOE</span>

            <span className="font-semibold text-cyan-400">{baseAOE}</span>
          </div>

          {/* Hyper Spell AOE */}

          <div className="flex justify-between gap-3">
            <span>Hyper Spell AOE Increase</span>

            <span className="font-semibold text-purple-400">
              +{hyperAOEIncrease}
            </span>
          </div>

          {/* Total AOE */}

          <div className="flex justify-between gap-3">
            <span>Total AOE Level Increase</span>

            <span className="font-semibold text-purple-400">
              +{totalAOEIncrease}
            </span>
          </div>

          {/* Soul Cast */}

          {soulCast && (
            <div className="flex justify-between gap-3">
              <span>Soul Cast Cost</span>

              <span className="font-semibold text-purple-400">
                {soulCost} Soul
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ================================================== */}
      {/* SOUL CAST CONFIGURATION */}
      {/* ================================================== */}

      {soulCast && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Soul Cast Configuration
          </h3>

          <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
            <div className="flex justify-between gap-3">
              <span>Soul Cost</span>

              <span className="font-semibold text-purple-400">
                {SOUL_CAST_COST} Soul
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>Check</span>

              <span className="font-semibold text-cyan-400">INT (GMD)</span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Insert a consciousness inside a Primordial to attempt to comprehend
            its thoughts. The Soul cost is separate from Mana Cost.
          </p>
        </div>
      )}

      {/* ================================================== */}
      {/* SPELL DESCRIPTION */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Description
        </h3>

        <div className="space-y-3 text-sm leading-relaxed text-gray-300">
          <p>
            Bewitch commands befriended or incapacitated Primordials within
            Small AOE through intense suggestion.
          </p>

          <p>Potency scales with the size of the target Primordial.</p>

          <p>Minor: Tiny to Sizeable. Mana Cost 40 / 30 / 20.</p>

          <p>Major: Size to Enormous. Mana Cost 100 / 80 / 60.</p>

          <p>Extreme: Enormous to Gargantuan. Mana Cost 200 / 160 / 120.</p>

          <p>The caster must not be suppressed.</p>
        </div>
      </div>
    </>
  );
};

export default Bewitch;
