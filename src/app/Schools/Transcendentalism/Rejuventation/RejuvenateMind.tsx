import { useEffect, useState } from "react";
import { LightBulbIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type RejuvenateMindProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type MindVariant = "Expel" | "Relent" | "Assemble" | "";

// ==================================================
// Spell Constants
// ==================================================

const SPELL_COST = 100;
const SPELL_TTT = 0;

const variants: Exclude<MindVariant, "">[] = ["Expel", "Relent", "Assemble"];

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
// Component
// ==================================================

export default function RejuvenateMind({
  ParentMastery,
  active,
  updateSpell,
}: RejuvenateMindProps) {
  // ==================================================
  // State
  // ==================================================

  const [variant, setVariant] = useState<MindVariant>("");

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType();

  // ==================================================
  // Cost Calculations
  // ==================================================

  const finalCost = SPELL_COST;

  // ==================================================
  // Parent Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
    updateSpell("ttt", SPELL_TTT);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // Reset When Inactive
  // ==================================================

  useEffect(() => {
    if (!active) {
      setVariant("");
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
        <LightBulbIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Rejuvenate Mind</h1>
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
          {/* Effect Type */}

          <div className="flex justify-between gap-3">
            <span>Effect Type</span>

            <span className="font-semibold text-cyan-400">MIND</span>
          </div>

          {/* Variant */}

          <div className="flex justify-between gap-3">
            <span>Variant</span>

            <span className="font-semibold text-cyan-400">
              {variant || "None"}
            </span>
          </div>

          {/* Mastery */}

          <div className="flex justify-between gap-3">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          {/* Potency */}

          <div className="flex justify-between gap-3">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">None</span>
          </div>

          {/* TTT */}

          <div className="flex justify-between gap-3">
            <span>TTT</span>

            <span className="font-semibold text-cyan-400">{SPELL_TTT}</span>
          </div>

          {/* Total Cost */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Total Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Mind Variant Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Mind Variant Configuration
        </h3>

        <p className="mb-4 text-sm text-gray-400">Select one mind variant.</p>

        <div className="space-y-3">
          {variants.map((item) => {
            const selected = variant === item;

            return (
              <label
                key={item}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition-colors ${
                  selected
                    ? "border-cyan-500 bg-cyan-950/30"
                    : "border-gray-700 bg-gray-900 hover:border-gray-500"
                }`}
              >
                <span
                  className={`font-semibold ${
                    selected ? "text-cyan-400" : "text-gray-200"
                  }`}
                >
                  {item}
                </span>

                <input
                  type="radio"
                  name="rejuvenate-mind-variant"
                  value={item}
                  checked={selected}
                  onChange={() => setVariant(item)}
                  className="h-5 w-5 accent-orange-500"
                />
              </label>
            );
          })}
        </div>

        {/* Selected Variant */}

        <div className="mt-4 flex justify-between gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
          <span>Selected Variant</span>

          <span className="font-semibold text-cyan-400">
            {variant || "None"}
          </span>
        </div>
      </div>

      {/* ================================================== */}
      {/* Cost Breakdown */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Cost Breakdown
        </h3>

        <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
          {/* Base Cost */}

          <div className="flex justify-between gap-3 text-gray-300">
            <span>Base Cost</span>

            <span className="font-semibold text-cyan-400">{SPELL_COST}</span>
          </div>

          {/* Mastery Modifier */}

          <div className="flex justify-between gap-3 text-gray-300">
            <span>Mastery Modifier</span>

            <span className="font-semibold text-cyan-400">None</span>
          </div>

          {/* Variant Modifier */}

          <div className="flex justify-between gap-3 text-gray-300">
            <span>Variant Modifier</span>

            <span className="font-semibold text-cyan-400">None</span>
          </div>

          {/* Final Cost */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3 text-gray-300">
            <span className="font-semibold text-gray-100">Total Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Data Flags */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Data Flags
        </h3>

        <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-300">
          {/* Effect Type */}

          <div className="flex justify-between gap-3">
            <span>Effect Type</span>

            <span className="font-semibold text-cyan-400">MIND</span>
          </div>

          {/* Variant */}

          <div className="flex justify-between gap-3">
            <span>Variant</span>

            <span className="font-semibold text-cyan-400">
              {variant ? variant.toUpperCase() : "NONE"}
            </span>
          </div>

          {/* Potency */}

          <div className="flex justify-between gap-3">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">NONE</span>
          </div>

          {/* TTT */}

          <div className="flex justify-between gap-3">
            <span>TTT</span>

            <span className="font-semibold text-cyan-400">{SPELL_TTT}</span>
          </div>
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
            Rejuvenate Mind allows the caster to select one of three mind
            variants: Expel, Relent, or Assemble.
          </p>

          <p>
            The spell has a fixed Manna cost of 100, regardless of Mastery or
            selected variant.
          </p>

          <p>Rejuvenate Mind does not use Potency or TTT.</p>
        </div>
      </div>
    </>
  );
}
