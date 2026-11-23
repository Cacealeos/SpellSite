"use client";

import { useEffect, useState } from "react";

import { Mastery, Spell, Potency } from "@/app/models";
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
    description: "20 / 10 / 0",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "50 / 40 / 30",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "100 / 80 / 60",
  },
];

const masteryCosts: Record<PotencyType, Record<MasteryType, number>> = {
  MINOR: {
    NOVICE: 20,
    INTERMEDIATE: 10,
    MASTERED: 0,
  },
  MAJOR: {
    NOVICE: 50,
    INTERMEDIATE: 40,
    MASTERED: 30,
  },
  EXTREME: {
    NOVICE: 100,
    INTERMEDIATE: 80,
    MASTERED: 60,
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

export default function GatherResonance({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) {
  // ==================================================
  // POTENCY
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<PotencyType>("MINOR");

  // ==================================================
  // DETECTION OPTIONS
  // ==================================================

  const [detectLifeForce, setDetectLifeForce] = useState(false);

  const [detectNecroForce, setDetectNecroForce] = useState(false);

  const [detectChaos, setDetectChaos] = useState(false);

  // ==================================================
  // SPELL TECHNIQUES
  // ==================================================

  const [auraSurge, setAuraSurge] = useState(false);

  // ==================================================
  // DERIVED VALUES
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const baseCost = masteryCosts[selectedPotency][mastery];

  // Detection multipliers are additive.
  let multiplier = 1;

  if (detectLifeForce) multiplier += 0.5;
  if (detectNecroForce) multiplier += 0.5;
  if (detectChaos) multiplier += 1;

  const cost = Math.round(baseCost * multiplier);

  // ==================================================
  // UPDATE PARENT SPELL
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
      {/* DETECTION OPTIONS */}
      {/* ================================================== */}

      <section className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Detection Options
        </h3>

        <div className="space-y-3">
          {/* ================================================== */}
          {/* DETECT LIFE-FORCE */}
          {/* ================================================== */}

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-gray-700 bg-gray-900 px-4 py-3 transition hover:border-orange-500">
            <div>
              <p className="font-medium text-gray-100">Detect Life-Force</p>

              <p className="text-sm text-gray-400">Increases Cost by 50%</p>
            </div>

            <input
              type="checkbox"
              checked={detectLifeForce}
              onChange={(e) => setDetectLifeForce(e.target.checked)}
              className="h-5 w-5 accent-orange-500"
            />
          </label>

          {/* ================================================== */}
          {/* DETECT NECRO-FORCE */}
          {/* ================================================== */}

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-gray-700 bg-gray-900 px-4 py-3 transition hover:border-orange-500">
            <div>
              <p className="font-medium text-gray-100">Detect Necro-Force</p>

              <p className="text-sm text-gray-400">Increases Cost by 50%</p>
            </div>

            <input
              type="checkbox"
              checked={detectNecroForce}
              onChange={(e) => setDetectNecroForce(e.target.checked)}
              className="h-5 w-5 accent-orange-500"
            />
          </label>

          {/* ================================================== */}
          {/* DETECT CHAOTIC ENERGY */}
          {/* ================================================== */}

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-gray-700 bg-gray-900 px-4 py-3 transition hover:border-orange-500">
            <div>
              <p className="font-medium text-gray-100">Detect Chaotic Energy</p>

              <p className="text-sm text-gray-400">Increases Cost by 100%</p>
            </div>

            <input
              type="checkbox"
              checked={detectChaos}
              onChange={(e) => setDetectChaos(e.target.checked)}
              className="h-5 w-5 accent-orange-500"
            />
          </label>
        </div>
      </section>

      {/* ================================================== */}
      {/* SPELL DESCRIPTION */}
      {/* ================================================== */}

      <section className="mt-8 space-y-4 text-gray-300">
        <p>
          Parse out any latent manna signature in the area being broadcast as
          High Magic or transmitted through Magi-Tech.
        </p>

        <p>
          Can be used pre-emptively or after sensing a manna signature.
          Isolating the source depends on signal strength, integrity, and an
          Intelligence Check.
        </p>

        <p>
          Higher potency improves parsing ability, precision in locating the
          source, and distinguishing multiple signatures through interference.
          Intelligence Checks are used to decipher scrambled signatures.
        </p>
      </section>
    </>
  );
}
