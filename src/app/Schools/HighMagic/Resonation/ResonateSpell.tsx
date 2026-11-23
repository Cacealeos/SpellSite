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

// ==================================================
// STATIC DATA
// ==================================================

const potencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: "35 / 20 / 5",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "100 / 75 / 50",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "200 / 160 / 120",
  },
];

const masteryCosts: Record<PotencyType, Record<MasteryType, number>> = {
  MINOR: {
    NOVICE: 35,
    INTERMEDIATE: 20,
    MASTERED: 5,
  },
  MAJOR: {
    NOVICE: 100,
    INTERMEDIATE: 75,
    MASTERED: 50,
  },
  EXTREME: {
    NOVICE: 200,
    INTERMEDIATE: 160,
    MASTERED: 120,
  },
};

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

export default function ResonateSpell({
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

  const [auraSurge, setAuraSurge] = useState(false);

  // ==================================================
  // DERIVED VALUES
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const cost = masteryCosts[selectedPotency][mastery];

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
      {/* SPELL DESCRIPTION */}
      {/* ================================================== */}

      <div className="mt-6 space-y-4 text-gray-300">
        <p>Sends transmissions as manna fluctuations across large distances.</p>

        <p>
          Sending a signal reveals the caster's position if receivers are
          present to intercept it.
        </p>

        <p>
          Potency scales with signal strength and resilience. Stronger signals
          are easier to detect, while resilient signals resist scrambling.
        </p>
      </div>
    </>
  );
}
