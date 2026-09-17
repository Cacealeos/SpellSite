import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";
import { force } from "./ConjurationData";

const ConjureForce = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ========================================================================
  // State
  // ========================================================================

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [selectedMedium, setSelectedMedium] =
    useState<keyof typeof force>("Gas");

  const [spellCharge, setSpellCharge] = useState(false);
  const [spellSurge, setSpellSurge] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);

  const medium = force[selectedMedium];

  // ========================================================================
  // Spell Techniques
  // ========================================================================

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

  // ========================================================================
  // Potency Options
  // ========================================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "20 / 10 / 1",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "30 / 20 / 10",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "40 / 30 / 20",
    },
  ];

  // ========================================================================
  // Potency Cost
  // ========================================================================

  let cost = 0;

  switch (ParentMastery.getType()) {
    case "NOVICE":
      switch (selectedPotency) {
        case "MINOR":
          cost = 20;
          break;
        case "MAJOR":
          cost = 30;
          break;
        case "EXTREME":
          cost = 40;
          break;
      }
      break;

    case "INTERMEDIATE":
      switch (selectedPotency) {
        case "MINOR":
          cost = 10;
          break;
        case "MAJOR":
          cost = 20;
          break;
        case "EXTREME":
          cost = 30;
          break;
      }
      break;

    case "MASTERED":
      switch (selectedPotency) {
        case "MINOR":
          cost = 1;
          break;
        case "MAJOR":
          cost = 10;
          break;
        case "EXTREME":
          cost = 20;
          break;
      }
      break;
  }

  // ========================================================================
  // Medium Colors
  // ========================================================================

  const colorStyles = {
    green: {
      border: "border-green-400",
      text: "text-green-400",
      glow: "shadow-[0_0_12px_rgba(74,222,128,0.5)]",
    },
    red: {
      border: "border-red-400",
      text: "text-red-400",
      glow: "shadow-[0_0_12px_rgba(248,113,113,0.5)]",
    },
    blue: {
      border: "border-blue-400",
      text: "text-blue-400",
      glow: "shadow-[0_0_12px_rgba(96,165,250,0.5)]",
    },
    purple: {
      border: "border-purple-400",
      text: "text-purple-400",
      glow: "shadow-[0_0_12px_rgba(192,132,252,0.5)]",
    },
  };

  // ========================================================================
  // Parent Spell Updates
  // ========================================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
    }
  }, [active, updateSpell]);

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  // ========================================================================
  // Power & Cost
  // ========================================================================

  const basePower =
    selectedPotency === "MINOR" ? 1 : selectedPotency === "MAJOR" ? 2 : 3;

  const power = basePower + (spellCharge ? 1 : 0) + (hyperSpell ? 1 : 0);

  const baseCost = cost;

  const surgeReduction = spellSurge ? 0.15 : 0;

  const adjustedCost = Math.trunc(
    baseCost * (1 - Math.min(surgeReduction, 0.75)),
  );

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <div>
      {/* ==================================================================== */}
      {/* Spell Techniques */}
      {/* ==================================================================== */}

      <SpellTechniquesTable techniques={Techniques} />

      <div>
        {/* ================================================================== */}
        {/* Spell Title */}
        {/* ================================================================== */}

        <h2 className="text-xl font-bold text-orange-400">Conjure Force</h2>

        <div className="mt-1 mb-4 h-px bg-gray-600" />

        {/* ================================================================== */}
        {/* Medium Selection */}
        {/* ================================================================== */}

        <h3 className="text-lg font-semibold text-orange-400">Medium</h3>

        <div className="grid grid-cols-4 gap-3">
          {Object.entries(force).map(([name, data]) => {
            const Icon = data.Icon;
            const selected = selectedMedium === name;

            const styles = colorStyles[data.color];

            return (
              <button
                key={name}
                onClick={() => setSelectedMedium(name as keyof typeof force)}
                className={`
                  flex flex-col items-center justify-center
                  rounded-lg border p-3
                  transition-all
                  ${
                    selected
                      ? `${styles.border} ${styles.glow}`
                      : "border-gray-600"
                  }
                `}
              >
                <Icon
                  className={`
                    h-8 w-8
                    ${selected ? styles.text : "text-gray-400"}
                  `}
                />

                <span
                  className={`
                    mt-2 text-sm
                    ${selected ? styles.text : "text-gray-300"}
                  `}
                >
                  {name}
                </span>
              </button>
            );
          })}
        </div>

        <br />

        {/* ================================================================== */}
        {/* Potency */}
        {/* ================================================================== */}

        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />

        <br />

        {/* ================================================================== */}
        {/* Potency Information */}
        {/* ================================================================== */}

        <p className="text-sm text-gray-400">
          Potency scales with Power, Cost, and Area of Effect.
        </p>

        {/* ================================================================== */}
        {/* Medium Statistics */}
        {/* ================================================================== */}

        <div className="mt-5 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-orange-400">
              {selectedMedium}
            </h3>

            {/* ================================================================ */}
            {/* Technique Controls */}
            {/* ================================================================ */}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSpellCharge((prev) => !prev)}
                className={`
                  rounded-lg border px-3 py-1.5 text-sm font-semibold
                  transition-all
                  ${
                    spellCharge
                      ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                      : "border-gray-700 bg-gray-900 text-gray-300 hover:border-cyan-400 hover:text-cyan-300"
                  }
                `}
              >
                Spell Charge
              </button>

              <button
                type="button"
                onClick={() => setSpellSurge((prev) => !prev)}
                className={`
                  rounded-lg border px-3 py-1.5 text-sm font-semibold
                  transition-all
                  ${
                    spellSurge
                      ? "border-red-400 bg-red-500/10 text-red-300 shadow-[0_0_12px_rgba(248,113,113,0.5)]"
                      : "border-gray-700 bg-gray-900 text-gray-300 hover:border-red-400 hover:text-red-300"
                  }
                `}
              >
                Spell Surge
              </button>

              <button
                type="button"
                onClick={() => setHyperSpell((prev) => !prev)}
                className={`
                  rounded-lg border px-3 py-1.5 text-sm font-semibold
                  transition-all
                  ${
                    hyperSpell
                      ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
                      : "border-gray-700 bg-gray-900 text-gray-300 hover:border-purple-400 hover:text-purple-300"
                  }
                `}
              >
                Hyper Spell
              </button>
            </div>
          </div>

          <div className="mt-2 h-px bg-gray-700" />

          {/* ================================================================ */}
          {/* Medium Statistics */}
          {/* ================================================================ */}

          <div className="mt-3 space-y-2 text-sm text-gray-300">
            <p>
              <span className="font-semibold text-gray-400">Damage:</span>{" "}
              {medium.Damage}
            </p>

            <p>
              <span className="font-semibold text-gray-400">Power:</span>{" "}
              {power}
            </p>

            <p>
              <span className="font-semibold text-gray-400">Range:</span>{" "}
              {medium.Range}
            </p>

            <p>
              <span className="font-semibold text-gray-400">Cost:</span>{" "}
              {spellSurge ? (
                <>
                  {adjustedCost}{" "}
                  <span className="text-red-300 drop-shadow-[0_0_6px_rgba(248,113,113,0.8)]">
                    ({baseCost})
                  </span>
                </>
              ) : (
                baseCost
              )}
            </p>

            <p>
              <span className="font-semibold text-gray-400">
                Emanates: ENVIRONMENT
              </span>
            </p>

            {spellCharge && (
              <p className="text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
                Spell Charge: +1 Power (1 turn of charge)
              </p>
            )}

            {hyperSpell && (
              <p className="text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]">
                Hyper Spell: +1 Power
              </p>
            )}

            {spellSurge && (
              <p className="text-red-300 drop-shadow-[0_0_6px_rgba(248,113,113,0.8)]">
                Spell Surge: 15% cost reduction
              </p>
            )}
          </div>
        </div>

        <br />

        {/* ================================================================== */}
        {/* Spell Description */}
        {/* ================================================================== */}

        <p className="text-sm text-gray-400">
          Targets the environment to either push, pull, shape, or shake matter.
          Environmental damage can be inflicted indirectly in this way.
        </p>
      </div>
    </div>
  );
};

export default ConjureForce;
