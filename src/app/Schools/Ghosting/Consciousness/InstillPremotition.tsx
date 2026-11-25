"use client";

import { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Soul Cast": true,
  "Full Cast ": false,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": true,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Aura Surge": false,
};

// ==================================================
// Constants
// ==================================================

const SOUL_CAST_COST = 30;
const SOUL_CAST_BONUS = 2;

// ==================================================
// Potency Data
// ==================================================

const potencyStats = {
  MINOR: {
    NOVICE: { cost: 20, base: 1 },
    INTERMEDIATE: { cost: 15, base: 1 },
    MASTERED: { cost: 10, base: 1 },
  },
  MAJOR: {
    NOVICE: { cost: 35, base: 3 },
    INTERMEDIATE: { cost: 30, base: 3 },
    MASTERED: { cost: 25, base: 3 },
  },
  EXTREME: {
    NOVICE: { cost: 50, base: 5 },
    INTERMEDIATE: { cost: 45, base: 5 },
    MASTERED: { cost: 40, base: 5 },
  },
};

type PotencyType = keyof typeof potencyStats;

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

// ==================================================
// Component
// ==================================================

const InstillPremonition = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ==================================================
  // State
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<PotencyType>("MINOR");

  // ==================================================
  // Technique State
  // ==================================================

  const [counterSpell, setCounterSpell] = useState(false);
  const [soulCast, setSoulCast] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const currentStats = potencyStats[selectedPotency][mastery];

  // ==================================================
  // Counter Spell
  // ==================================================

  // Allows the spell to be used as a DEFENSIVE ACTION.
  // Does not modify the Manna cost or roll bonus.

  // ==================================================
  // Soul Cast
  // ==================================================

  const soulCost = soulCast ? SOUL_CAST_COST : 0;

  const soulCastBonus = soulCast ? SOUL_CAST_BONUS : 0;

  const baseBonus = currentStats.base;

  const finalBonus = baseBonus + soulCastBonus;

  // ==================================================
  // Hyper Spell
  // ==================================================

  // Injects a copy of the caster's monitoring
  // consciousness within the target.
  //
  // Highly susceptible to Disruption.

  // ==================================================
  // Final Cost
  // ==================================================

  const finalCost = currentStats.cost;

  // ==================================================
  // Potency Selector Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: `Cost: ${potencyStats.MINOR.NOVICE.cost} / ${potencyStats.MINOR.INTERMEDIATE.cost} / ${potencyStats.MINOR.MASTERED.cost}`,
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: `Cost: ${potencyStats.MAJOR.NOVICE.cost} / ${potencyStats.MAJOR.INTERMEDIATE.cost} / ${potencyStats.MAJOR.MASTERED.cost}`,
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: `Cost: ${potencyStats.EXTREME.NOVICE.cost} / ${potencyStats.EXTREME.INTERMEDIATE.cost} / ${potencyStats.EXTREME.MASTERED.cost}`,
    },
  ];

  // ==================================================
  // Reset Techniques
  // ==================================================

  useEffect(() => {
    if (!active) {
      setCounterSpell(false);
      setSoulCast(false);
      setHyperSpell(false);
    }
  }, [active]);

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <EyeIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Instill Premonition
        </h1>
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
        {/* Header / Technique Buttons */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <div className="flex flex-wrap gap-2">
            {/* Counter Spell */}

            <button
              type="button"
              aria-pressed={counterSpell}
              onClick={() => setCounterSpell((prev) => !prev)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                counterSpell
                  ? "bg-cyan-700 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-cyan-700 hover:text-white"
              }`}
            >
              Counter Spell
            </button>

            {/* Soul Cast */}

            <button
              type="button"
              aria-pressed={soulCast}
              onClick={() => setSoulCast((prev) => !prev)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                soulCast
                  ? "bg-purple-700 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-700 hover:text-white"
              }`}
            >
              Soul Cast
            </button>

            {/* Hyper Spell */}

            <button
              type="button"
              aria-pressed={hyperSpell}
              onClick={() => setHyperSpell((prev) => !prev)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                hyperSpell
                  ? "bg-indigo-700 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-indigo-700 hover:text-white"
              }`}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Counter Spell */}
        {/* ================================================== */}

        {counterSpell && (
          <div className="mb-5 rounded-lg border border-cyan-700 bg-cyan-950/30 p-4 text-sm text-cyan-200">
            <h4 className="mb-3 font-semibold text-cyan-300">Counter Spell</h4>

            <p className="leading-relaxed">
              Allows Instill Premonition and Instill Sensory to be used as a{" "}
              <strong>DEFENSIVE ACTION</strong>.
            </p>

            <div className="mt-4 flex justify-between gap-4 rounded-md border border-cyan-800 bg-gray-900 p-4">
              <span>Action Type</span>

              <span className="text-right font-bold text-cyan-300">
                DEFENSIVE
              </span>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* Soul Cast */}
        {/* ================================================== */}

        {soulCast && (
          <div className="mb-5 rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
            <h4 className="mb-3 font-semibold text-purple-300">Soul Cast</h4>

            <p className="leading-relaxed">
              At the cost of <strong>30 Soul</strong>, Instill Premonition and
              Instill Sensory receive <strong>+2 to rolls</strong>.
            </p>

            <div className="mt-4 space-y-3 rounded-md border border-purple-800 bg-gray-900 p-4">
              <div className="flex justify-between">
                <span>Base Roll Bonus</span>

                <span className="font-semibold text-gray-200">
                  +{baseBonus}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Soul Cast Bonus</span>

                <span className="font-semibold text-purple-300">
                  +{soulCastBonus}
                </span>
              </div>

              <div className="flex justify-between border-t border-purple-800 pt-3">
                <span className="font-semibold">Final Roll Bonus</span>

                <span className="font-bold text-purple-300">+{finalBonus}</span>
              </div>

              <div className="flex justify-between border-t border-purple-800 pt-3">
                <span>Additional Soul Cost</span>

                <span className="font-bold text-purple-300">
                  {soulCost} Soul
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* Hyper Spell */}
        {/* ================================================== */}

        {hyperSpell && (
          <div className="mb-5 rounded-lg border border-indigo-700 bg-indigo-950/30 p-4 text-sm text-indigo-200">
            <h4 className="mb-3 font-semibold text-indigo-300">Hyper Spell</h4>

            <p className="leading-relaxed">
              Allows the caster to inject a copy of their own{" "}
              <strong>monitoring consciousness</strong> within the target.
            </p>

            <p className="mt-3 leading-relaxed">
              The injected consciousness is highly susceptible to{" "}
              <strong className="text-red-400">Disruption</strong>.
            </p>

            <div className="mt-4 space-y-3 rounded-md border border-indigo-800 bg-gray-900 p-4">
              <div className="flex justify-between gap-4">
                <span>Monitoring Consciousness</span>

                <span className="text-right font-semibold text-indigo-300">
                  ENABLED
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Consciousness Source</span>

                <span className="text-right font-semibold text-indigo-300">
                  CASTER COPY
                </span>
              </div>

              <div className="flex justify-between gap-4 border-t border-indigo-800 pt-3">
                <span>Disruption Susceptibility</span>

                <span className="text-right font-bold text-red-400">HIGH</span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* Final Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Range */}

          <div className="flex justify-between">
            <span>Range</span>

            <span className="font-semibold text-cyan-400">DIRECT</span>
          </div>

          {/* Potency */}

          <div className="flex justify-between">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">
              {selectedPotency}
            </span>
          </div>

          {/* Bonus */}

          <div className="flex justify-between">
            <span>Bonus</span>

            <span className="font-semibold text-cyan-400">
              +{baseBonus}
              {soulCast && (
                <span className="text-purple-400">
                  {" → "}+{finalBonus}
                </span>
              )}
            </span>
          </div>

          {/* Counter Spell */}

          {counterSpell && (
            <div className="flex justify-between">
              <span>Additional Action</span>

              <span className="font-semibold text-cyan-400">DEFENSIVE</span>
            </div>
          )}

          {/* Soul Cast Cost */}

          {soulCast && (
            <div className="flex justify-between">
              <span>Soul Cast Cost</span>

              <span className="font-semibold text-purple-400">
                {soulCost} Soul
              </span>
            </div>
          )}

          {/* Hyper Spell Properties */}

          {hyperSpell && (
            <>
              <div className="flex justify-between gap-4">
                <span>Monitoring Consciousness</span>

                <span className="text-right font-semibold text-indigo-400">
                  ENABLED
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Disruption Susceptibility</span>

                <span className="text-right font-semibold text-red-400">
                  HIGH
                </span>
              </div>
            </>
          )}

          {/* Final Cost */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Potency */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Potency
        </h3>

        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>
    </>
  );
};

export default InstillPremonition;
