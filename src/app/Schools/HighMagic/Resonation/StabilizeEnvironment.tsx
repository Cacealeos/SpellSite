"use client";

import { useEffect, useState } from "react";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// TYPES
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";
type PotencyType = "MINOR" | "MAJOR" | "EXTREME";
type AOEType = "MODERATE" | "LARGE" | "MASSIVE";

// ==================================================
// STATIC DATA
// ==================================================

const potencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: "150 / 120 / 100",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "300 / 240 / 180",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "600 / 480 / 360",
  },
];

const masteryCosts: Record<PotencyType, Record<MasteryType, number>> = {
  MINOR: {
    NOVICE: 150,
    INTERMEDIATE: 120,
    MASTERED: 100,
  },
  MAJOR: {
    NOVICE: 300,
    INTERMEDIATE: 240,
    MASTERED: 180,
  },
  EXTREME: {
    NOVICE: 600,
    INTERMEDIATE: 480,
    MASTERED: 360,
  },
};

// ==================================================
// AREA OF EFFECT
// ==================================================

const aoeOptions: {
  value: AOEType;
  label: string;
  description: string;
  multiplier: number;
}[] = [
  {
    value: "MODERATE",
    label: "Moderate AOE",
    description: "Cost -50%",
    multiplier: 0.5,
  },
  {
    value: "LARGE",
    label: "Large AOE",
    description: "No cost modifier",
    multiplier: 1,
  },
  {
    value: "MASSIVE",
    label: "Massive AOE",
    description: "Cost +200%",
    multiplier: 3,
  },
];

// ==================================================
// SPELL TECHNIQUES
// ==================================================

const Techniques = {
  "Quick Spell": false,
  "Spell Reflex": false,
  "Double Cast": false,
  "Double Pulse": false,
  "Soul Cast": false,
  "Full Cast": false,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": false,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": false,
  "Auto Cast": false,
  "Rivet Cast": false,
  "Spell Recovery": false,
  "Aura Surge": true,
};

// ==================================================
// COMPONENT
// ==================================================

export default function StabilizeEnvironment({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) {
  // ==================================================
  // STATE
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<PotencyType>("MINOR");

  const [selectedAOE, setSelectedAOE] = useState<AOEType>("LARGE");

  const [auraSurge, setAuraSurge] = useState(false);

  // ==================================================
  // DERIVED VALUES
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const baseCost = masteryCosts[selectedPotency][mastery];

  const selectedAOEOption = aoeOptions.find(
    (option) => option.value === selectedAOE,
  );

  const aoeMultiplier = selectedAOEOption?.multiplier ?? 1;

  const cost = Math.round(baseCost * aoeMultiplier);

  // ==================================================
  // SPELL UPDATES
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);

    const potency = new Potency();

    switch (selectedPotency) {
      case "MINOR":
        potency.minor();
        break;

      case "MAJOR":
        potency.major();
        break;

      case "EXTREME":
        potency.extreme();
        break;
    }

    updateSpell("potency", potency);
  }, [active, cost, selectedPotency, updateSpell]);

  // ==================================================
  // RESET
  // ==================================================

  useEffect(() => {
    if (!active) {
      setAuraSurge(false);
    }
  }, [active]);

  // ==================================================
  // RENDER
  // ==================================================

  if (!active) return null;

  return (
    <>
      {/* ================================================== */}
      {/* SPELL TECHNIQUES */}
      {/* ================================================== */}

      <SpellTechniquesTable techniques={Techniques} />

      {/* ================================================== */}
      {/* TECHNIQUE BUTTONS */}
      {/* ================================================== */}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setAuraSurge((prev) => !prev)}
          aria-pressed={auraSurge}
          className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
            auraSurge
              ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
              : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-400 hover:text-purple-300"
          }`}
        >
          Aura Surge
        </button>
      </div>

      {/* ================================================== */}
      {/* AURA SURGE EFFECT */}
      {/* ================================================== */}

      {auraSurge && (
        <div className="mt-3 rounded-lg border border-purple-800 bg-purple-950/30 p-3">
          <p className="text-sm leading-relaxed text-gray-300">
            <strong className="text-purple-300">Aura Surge:</strong> While
            channeling{" "}
            <span className="font-semibold text-purple-300">
              SPIRITUAL ENERGY
            </span>
            , signals become more resistant to scrambling.
          </p>
        </div>
      )}

      {/* ================================================== */}
      {/* POTENCY */}
      {/* ================================================== */}

      <div className="mt-6">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* ================================================== */}
      {/* AREA OF EFFECT */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Area of Effect
        </h3>

        <div className="space-y-3">
          {aoeOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-gray-700 bg-gray-900 px-4 py-3 transition hover:border-orange-500"
            >
              <div>
                <p className="font-medium text-gray-100">{option.label}</p>

                <p className="text-sm text-gray-400">{option.description}</p>
              </div>

              <input
                type="radio"
                name="stabilize-environment-aoe"
                value={option.value}
                checked={selectedAOE === option.value}
                onChange={() => setSelectedAOE(option.value)}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* SPELL STATISTICS */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Stabilization Statistics
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Base Cost</span>

            <span className="font-semibold text-cyan-400">{baseCost}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Area of Effect</span>

            <span className="font-semibold text-cyan-400">{selectedAOE}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">AOE Multiplier</span>

            <span className="font-semibold text-cyan-400">
              ×{aoeMultiplier}
            </span>
          </div>

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-200">Total Cost</span>

            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* SPELL DESCRIPTION */}
      {/* ================================================== */}

      <div className="mt-6 space-y-4 text-gray-300">
        <p>
          Organizes scrambled transmissions within the area. Stabilization
          strength is measured against the level of instability created by
          effects such as Scramble Signature.
        </p>

        <p>
          Potency scales with the degree of remediation required to restore
          damaged or jammed signals.
        </p>
      </div>
    </>
  );
}
