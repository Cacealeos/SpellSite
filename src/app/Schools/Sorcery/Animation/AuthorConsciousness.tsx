import { useEffect, useState } from "react";
import { CpuChipIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type AuthorConsciousnessProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": false,
  "Spell Reflex": false,
  "Double Cast": false,
  "Double Pulse": false,
  "Carry Spell": false,
  "Spell Shift": false,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": false,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": false,
  "Auto Cast": false,
  "Rivet Cast": false,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Constants
// ==================================================

const PASSIVE_TTT = 10;
const TURNS_PER_CHARGE = 1;

// ==================================================
// Longevity Reference
// ==================================================

const longevityExamples = [
  { label: "Brief", turns: "~3 Turns" },
  { label: "Lengthy", turns: "~6 Turns" },
  { label: "Prolonged", turns: "~12 Turns" },
  { label: "Extended", turns: "~24+ Turns" },
];

// ==================================================
// Helpers
// ==================================================

const normalizeInteger = (value: number) =>
  Math.max(0, Math.trunc(Number.isFinite(value) ? value : 0));

// ==================================================
// Component
// ==================================================

export default function AuthorConsciousness({
  active,
  updateSpell,
}: AuthorConsciousnessProps) {
  // ==================================================
  // State
  // ==================================================

  const [charges, setCharges] = useState(0);

  // ==================================================
  // Longevity Calculations
  // ==================================================

  const longevity = charges * TURNS_PER_CHARGE;

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", 0);
    updateSpell("ttt", active ? PASSIVE_TTT : 0);
  }, [active, updateSpell]);

  // ==================================================
  // Reset When Inactive
  // ==================================================

  useEffect(() => {
    if (!active) {
      setCharges(0);
    }
  }, [active]);

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
        <CpuChipIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Author Consciousness
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
        <h3 className="mb-4 border-b border-gray-700 pb-3 text-lg font-semibold text-orange-400">
          Spell Properties
        </h3>

        <div className="space-y-3 text-gray-300">
          {/* Charges */}

          <div className="flex justify-between gap-3">
            <span>Charges</span>

            <span className="font-semibold text-cyan-400">{charges}</span>
          </div>

          {/* Longevity */}

          <div className="flex justify-between gap-3">
            <span>Longevity</span>

            <span className="font-semibold text-cyan-400">
              {longevity} Turns
            </span>
          </div>

          {/* Charge Ratio */}

          <div className="flex justify-between gap-3">
            <span>Charge to Longevity Ratio</span>

            <span className="font-semibold text-cyan-400">1 : 1</span>
          </div>

          {/* Passive TTT */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Passive TTT</span>

            <span className="text-lg font-bold text-orange-400">
              {PASSIVE_TTT}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Charges Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Charges Configuration
        </h3>

        {/* Charges Input */}

        <label className="block">
          <span className="mb-2 block font-semibold text-gray-300">
            Charges
          </span>

          <input
            type="number"
            min={0}
            step={1}
            value={charges}
            onChange={(e) =>
              setCharges(normalizeInteger(Number(e.target.value)))
            }
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <p className="mt-2 text-sm text-gray-500">
          Each charge provides one turn of longevity for the authored
          consciousness.
        </p>

        {/* Charges Summary */}

        <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <div className="flex justify-between text-gray-300">
            <span>Charges</span>

            <span className="font-semibold text-cyan-400">{charges}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Turns per Charge</span>

            <span className="font-semibold text-cyan-400">
              {TURNS_PER_CHARGE}
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3 text-gray-300">
            <span className="font-semibold text-gray-100">Total Longevity</span>

            <span className="text-lg font-bold text-orange-400">
              {longevity} Turns
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Longevity Reference */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Longevity Reference
        </h3>

        <div className="space-y-3">
          {longevityExamples.map((example) => (
            <div
              key={example.label}
              className="flex justify-between gap-3 text-sm text-gray-300"
            >
              <span>{example.label}</span>

              <span className="font-semibold text-cyan-400">
                {example.turns}
              </span>
            </div>
          ))}
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
            Author Consciousness allows the caster to author a consciousness
            with a specified longevity measured in turns.
          </p>

          <p>
            Each charge grants one turn of longevity. The total longevity is
            equal to the number of charges invested.
          </p>

          <p>
            The spell has a fixed passive TTT of 10, regardless of the number of
            charges invested or the caster&apos;s Mastery.
          </p>

          <p>
            Typical longevity durations include Brief (~3 turns), Lengthy (~6
            turns), Prolonged (~12 turns), and Extended (~24 or more turns).
          </p>
        </div>
      </div>
    </>
  );
}
