"use client";

import { useEffect, useState } from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// SPELL TECHNIQUES
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
// CONSTANTS
// ==================================================

const POTENCY_STATS = {
  MINOR: {
    aoe: "SMALL",
    NOVICE: 75,
    INTERMEDIATE: 50,
    MASTERED: 25,
  },

  MAJOR: {
    aoe: "MODERATE",
    NOVICE: 150,
    INTERMEDIATE: 125,
    MASTERED: 100,
  },

  EXTREME: {
    aoe: "LARGE",
    NOVICE: 300,
    INTERMEDIATE: 250,
    MASTERED: 200,
  },
};

type PotencyType = keyof typeof POTENCY_STATS;

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

const MAX_STACKS = 3;
const SOUL_CAST_COST = 50;

// ==================================================
// COMPONENT
// ==================================================

export default function ManifestBarricade({
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

  // ==================================================
  // TECHNIQUE STATE
  // ==================================================

  const [soulCast, setSoulCast] = useState(false);

  // ==================================================
  // MASTERY
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  // ==================================================
  // POTENCY STATISTICS
  // ==================================================

  const selectedStats = POTENCY_STATS[selectedPotency];

  const cost = Math.ceil(selectedStats[mastery]);

  const aoe = selectedStats.aoe;

  // ==================================================
  // SOUL CAST
  // ==================================================

  const soulCost = soulCast ? SOUL_CAST_COST : 0;

  // Soul Cast costs Soul, not Manna.
  // The spell's normal Manna cost remains unchanged.

  // ==================================================
  // SPELL UPDATE
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  // ==================================================
  // RESET TECHNIQUES
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSoulCast(false);
    }
  }, [active]);

  // ==================================================
  // POTENCY OPTIONS
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description:
        `Small AOE | Cost: ` +
        `${POTENCY_STATS.MINOR.NOVICE} / ` +
        `${POTENCY_STATS.MINOR.INTERMEDIATE} / ` +
        `${POTENCY_STATS.MINOR.MASTERED}`,
    },

    {
      value: "MAJOR" as const,
      label: "Major",
      description:
        `Moderate AOE | Cost: ` +
        `${POTENCY_STATS.MAJOR.NOVICE} / ` +
        `${POTENCY_STATS.MAJOR.INTERMEDIATE} / ` +
        `${POTENCY_STATS.MAJOR.MASTERED}`,
    },

    {
      value: "EXTREME" as const,
      label: "Extreme",
      description:
        `Large AOE | Cost: ` +
        `${POTENCY_STATS.EXTREME.NOVICE} / ` +
        `${POTENCY_STATS.EXTREME.INTERMEDIATE} / ` +
        `${POTENCY_STATS.EXTREME.MASTERED}`,
    },
  ];

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* SPELL TITLE */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Dimensional Barricade
        </h1>
      </div>

      {/* ================================================== */}
      {/* SPELL TECHNIQUES TABLE */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />

        {/* ================================================== */}
        {/* TECHNIQUE BUTTONS */}
        {/* ================================================== */}

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={soulCast}
            onClick={() => setSoulCast((prev) => !prev)}
            className={`rounded-md border px-3 py-1.5 text-sm font-semibold transition ${
              soulCast
                ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
                : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-500 hover:text-purple-300"
            }`}
          >
            Soul Cast
          </button>
        </div>

        {/* ================================================== */}
        {/* SOUL CAST EFFECT */}
        {/* ================================================== */}

        {soulCast && (
          <div className="mt-3 rounded-lg border border-purple-800 bg-purple-950/30 p-4">
            <h3 className="mb-3 font-semibold text-purple-300">Soul Cast</h3>

            <p className="text-sm leading-relaxed text-gray-300">
              At the cost of{" "}
              <span className="font-semibold text-purple-300">50 Soul</span>,
              the caster leaves behind a{" "}
              <span className="font-semibold text-purple-300">
                temporary sentient consciousness
              </span>{" "}
              inside of a construct.
            </p>

            <div className="mt-4 flex justify-between rounded-md border border-purple-800 bg-gray-900 px-4 py-3">
              <span className="text-sm text-gray-300">
                Additional Soul Cost
              </span>

              <span className="font-semibold text-purple-300">
                +{soulCost} Soul
              </span>
            </div>
          </div>
        )}
      </div>

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
      {/* BARRIER EFFECTS */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Barrier Effects
        </h3>

        <div className="space-y-4 text-gray-300">
          {/* ================================================== */}
          {/* DAMAGE RESISTANCE */}
          {/* ================================================== */}

          <div className="rounded-lg border border-cyan-900 bg-cyan-950/30 p-4">
            <h4 className="mb-2 font-semibold text-cyan-400">
              Dimensional Damage Resistance
            </h4>

            <p className="text-sm leading-relaxed">
              Reduces damage from Dimensional attacks within the target area by
              granting all targets{" "}
              <strong className="text-cyan-300">
                Slight Dimensional Damage Resistance
              </strong>
              .
            </p>
          </div>

          {/* ================================================== */}
          {/* ACTIVATION */}
          {/* ================================================== */}

          <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-4">
            <h4 className="mb-2 font-semibold text-gray-200">Activation</h4>

            <p className="text-sm leading-relaxed">
              The barrier is{" "}
              <strong className="text-orange-400">single use</strong> once
              activated. It can only be activated by{" "}
              <strong className="text-cyan-300">Ethereal</strong> and{" "}
              <strong className="text-cyan-300">Dimensional</strong> attacks.
            </p>
          </div>

          {/* ================================================== */}
          {/* DISRUPTION IMMUNITY */}
          {/* ================================================== */}

          <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-4">
            <h4 className="mb-2 font-semibold text-gray-200">
              Disruption Immunity
            </h4>

            <p className="text-sm leading-relaxed">
              The barrier is{" "}
              <strong className="text-green-400">immune to disruption</strong>.
            </p>
          </div>

          {/* ================================================== */}
          {/* STACKING */}
          {/* ================================================== */}

          <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-4">
            <h4 className="mb-2 font-semibold text-gray-200">Stacking</h4>

            <p className="text-sm leading-relaxed">
              Barrier effects can stack up to{" "}
              <strong className="text-cyan-300">{MAX_STACKS} times</strong>.
            </p>
          </div>

          {/* ================================================== */}
          {/* SATURATION */}
          {/* ================================================== */}

          <div className="rounded-lg border border-orange-900 bg-orange-950/30 p-4">
            <h4 className="mb-2 font-semibold text-orange-400">
              Saturation Impact
            </h4>

            <p className="text-sm leading-relaxed">
              This spell has a{" "}
              <strong className="text-orange-300">
                Heavy Cost to Saturation
              </strong>
              .
            </p>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* SPELL PROPERTIES */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Properties
        </h3>

        <div className="space-y-3 text-gray-300">
          {/* POTENCY */}

          <div className="flex justify-between">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">
              {selectedPotency}
            </span>
          </div>

          {/* AOE */}

          <div className="flex justify-between">
            <span>Area of Effect</span>

            <span className="font-semibold text-cyan-400">{aoe}</span>
          </div>

          {/* RESISTANCE */}

          <div className="flex justify-between gap-4">
            <span>Resistance</span>

            <span className="text-right font-semibold text-cyan-400">
              SLIGHT DIMENSIONAL
            </span>
          </div>

          {/* ACTIVATION */}

          <div className="flex justify-between gap-4">
            <span>Activation</span>

            <span className="text-right font-semibold text-cyan-400">
              ETHEREAL / DIMENSIONAL
            </span>
          </div>

          {/* USES */}

          <div className="flex justify-between">
            <span>Uses</span>

            <span className="font-semibold text-cyan-400">SINGLE USE</span>
          </div>

          {/* DISRUPTION */}

          <div className="flex justify-between">
            <span>Disruption</span>

            <span className="font-semibold text-green-400">IMMUNE</span>
          </div>

          {/* MAXIMUM STACKS */}

          <div className="flex justify-between">
            <span>Maximum Stacks</span>

            <span className="font-semibold text-cyan-400">{MAX_STACKS}</span>
          </div>

          {/* SATURATION */}

          <div className="flex justify-between">
            <span>Saturation Cost</span>

            <span className="font-semibold text-orange-400">HEAVY</span>
          </div>

          {/* SOUL CAST */}

          {soulCast && (
            <div className="flex justify-between gap-4 border-t border-gray-700 pt-3">
              <span className="text-gray-300">Soul Cast</span>

              <span className="text-right font-semibold text-purple-300">
                +{soulCost} Soul
              </span>
            </div>
          )}

          {/* FINAL COST */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {cost} Manna
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
