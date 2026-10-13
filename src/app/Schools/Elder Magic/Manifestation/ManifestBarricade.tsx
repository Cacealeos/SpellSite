import { useEffect, useState } from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

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
  "Carry Spell": true,
  "Spell Shift": true,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": true,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Constants
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

const MAX_STACKS = 3;

// ==================================================
// Component
// ==================================================

const ManifestBarricade = ({
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
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  // ==================================================
  // Potency Statistics
  // ==================================================

  const selectedStats = POTENCY_STATS[selectedPotency];

  const cost = Math.ceil(selectedStats[mastery]);

  const aoe = selectedStats.aoe;

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  // ==================================================
  // Potency Options
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
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Dimensional Barricade
        </h1>
      </div>

      {/* ================================================== */}
      {/* Spell Techniques Table */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* Potency */}
      {/* ================================================== */}

      <div className="mt-6">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* ================================================== */}
      {/* Barrier Effects */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Barrier Effects
        </h3>

        <div className="space-y-4 text-gray-300">
          {/* ================================================== */}
          {/* Damage Resistance */}
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
          {/* Activation */}
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
          {/* Disruption Immunity */}
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
          {/* Stacking */}
          {/* ================================================== */}

          <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-4">
            <h4 className="mb-2 font-semibold text-gray-200">Stacking</h4>

            <p className="text-sm leading-relaxed">
              Barrier effects can stack up to{" "}
              <strong className="text-cyan-300">{MAX_STACKS} times</strong>.
            </p>
          </div>

          {/* ================================================== */}
          {/* Saturation */}
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
      {/* Spell Properties */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Spell Properties
        </h3>

        <div className="space-y-3 text-gray-300">
          {/* ================================================== */}
          {/* Potency */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">
              {selectedPotency}
            </span>
          </div>

          {/* ================================================== */}
          {/* AOE */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Area of Effect</span>

            <span className="font-semibold text-cyan-400">{aoe}</span>
          </div>

          {/* ================================================== */}
          {/* Resistance */}
          {/* ================================================== */}

          <div className="flex justify-between gap-4">
            <span>Resistance</span>

            <span className="text-right font-semibold text-cyan-400">
              SLIGHT DIMENSIONAL
            </span>
          </div>

          {/* ================================================== */}
          {/* Activation */}
          {/* ================================================== */}

          <div className="flex justify-between gap-4">
            <span>Activation</span>

            <span className="text-right font-semibold text-cyan-400">
              ETHEREAL / DIMENSIONAL
            </span>
          </div>

          {/* ================================================== */}
          {/* Uses */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Uses</span>

            <span className="font-semibold text-cyan-400">SINGLE USE</span>
          </div>

          {/* ================================================== */}
          {/* Disruption */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Disruption</span>

            <span className="font-semibold text-green-400">IMMUNE</span>
          </div>

          {/* ================================================== */}
          {/* Maximum Stacks */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Maximum Stacks</span>

            <span className="font-semibold text-cyan-400">{MAX_STACKS}</span>
          </div>

          {/* ================================================== */}
          {/* Saturation */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Saturation Cost</span>

            <span className="font-semibold text-orange-400">HEAVY</span>
          </div>

          {/* ================================================== */}
          {/* Final Cost */}
          {/* ================================================== */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">{cost}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManifestBarricade;
