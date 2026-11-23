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
    description: "30 / 20 / 10",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "75 / 60 / 45",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "150 / 120 / 90",
  },
];

const masteryCosts: Record<PotencyType, Record<MasteryType, number>> = {
  MINOR: {
    NOVICE: 30,
    INTERMEDIATE: 20,
    MASTERED: 10,
  },
  MAJOR: {
    NOVICE: 75,
    INTERMEDIATE: 60,
    MASTERED: 45,
  },
  EXTREME: {
    NOVICE: 150,
    INTERMEDIATE: 120,
    MASTERED: 90,
  },
};

const masteryTTT: Record<MasteryType, number> = {
  NOVICE: 8,
  INTERMEDIATE: 5,
  MASTERED: 3,
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

export default function InterpolateWave({
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

  const ttt = masteryTTT[mastery];

  // ==================================================
  // SPELL UPDATES
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("cost", cost);
    updateSpell("ttt", ttt);

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
  }, [active, cost, ttt, selectedPotency, updateSpell]);

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
      {/* AURA SURGE */}
      {/* ================================================== */}

      <section className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Techniques
          </h3>

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
          <div className="mt-4 rounded-lg border border-purple-800 bg-purple-950/30 p-3">
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
      </section>

      {/* ================================================== */}
      {/* SUSTAINED TTT */}
      {/* ================================================== */}

      <section className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Sustained TTT Cost
        </h3>

        <p className="text-center text-3xl font-bold text-cyan-400">
          {ttt} TTT
        </p>

        <p className="mt-2 text-center text-sm text-gray-400">
          Sustain cost varies based on Mastery.
        </p>
      </section>

      {/* ================================================== */}
      {/* SPELL DESCRIPTION */}
      {/* ================================================== */}

      <section className="mt-6 space-y-4 text-gray-300">
        <p>
          Detects light waves outside the visible spectrum but cannot interpret
          them without some form of key.
        </p>

        <p>
          Allows the insertion of noise into detected signals at the risk of
          projecting the caster's manna signature.
        </p>

        <p>Uses a TTT cost to sustain the broadcast.</p>

        <p>
          Potency scales with parsing ability and the strength of both detected
          signals and injected noise.
        </p>
      </section>
    </>
  );
}
