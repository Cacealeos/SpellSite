"use client";

import { useEffect } from "react";
import { Squares2X2Icon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// TYPES
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

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
  "Aura Surge": false,
};

// ==================================================
// TTT DATA
// ==================================================

const masteryTTT: Record<MasteryType, number> = {
  NOVICE: 8,
  INTERMEDIATE: 4,
  MASTERED: 2,
};

// ==================================================
// COMPONENT
// ==================================================

const Array = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ==================================================
  // MASTERY
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  // ==================================================
  // TTT CALCULATIONS
  // ==================================================

  const finalTTT = masteryTTT[mastery];

  // ==================================================
  // PARENT SPELL UPDATE
  // ==================================================

  useEffect(() => {
    updateSpell("cost", 0);
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalTTT, updateSpell]);

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* SPELL TITLE */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <Squares2X2Icon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Array</h1>
      </div>

      {/* ================================================== */}
      {/* SPELL TECHNIQUES TABLE */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* SPELL PROPERTIES */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-3 text-lg font-semibold text-orange-400">
          Spell Properties
        </h3>

        <div className="space-y-3 text-gray-300">
          {/* ================================================== */}
          {/* TARGET REQUIREMENT */}
          {/* ================================================== */}

          <div className="flex justify-between gap-3">
            <span>Target Requirement</span>

            <span className="font-semibold text-cyan-400">
              Mentally Linked Targets
            </span>
          </div>

          {/* ================================================== */}
          {/* BODY SEAL */}
          {/* ================================================== */}

          <div className="flex justify-between gap-3">
            <span>Affected Seal</span>

            <span className="font-semibold text-cyan-400">BODY SEAL</span>
          </div>

          {/* ================================================== */}
          {/* EFFECT */}
          {/* ================================================== */}

          <div className="flex justify-between gap-3">
            <span>Effect</span>

            <span className="font-semibold text-cyan-400">
              Threshold Adjustment
            </span>
          </div>

          {/* ================================================== */}
          {/* COLLECTION ACTION */}
          {/* ================================================== */}

          <div className="flex justify-between gap-3">
            <span>Element Collection</span>

            <span className="font-semibold text-cyan-400">
              INTERACT / Spells
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* ARRAY CONFIGURATION */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-3 text-lg font-semibold text-orange-400">
          Array Configuration
        </h3>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <p className="text-sm font-semibold text-cyan-400">
            Mental Link Array
          </p>

          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            Connect a set of mentally linked targets to form an Array capable of
            adjusting the caster&apos;s BODY SEAL thresholds.
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
          <p className="text-sm font-semibold text-cyan-400">
            Array Element Collection
          </p>

          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            Array elements are collected using INTERACT ACTIONs or spells.
          </p>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Threshold adjustments are determined by the Body Seals rules.
        </p>
      </div>

      {/* ================================================== */}
      {/* SPELL DESCRIPTION */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-3 text-lg font-semibold text-orange-400">
          Spell Description
        </h3>

        <div className="space-y-3 text-sm leading-relaxed text-gray-300">
          <p>
            Upon connecting a set of mentally linked targets, the caster&apos;s
            BODY SEAL can have its thresholds adjusted.
          </p>

          <p>See: Body Seals.</p>

          <p>Array elements are collected using INTERACT ACTIONs or spells.</p>

          <p>The caster must not be suppressed.</p>
        </div>
      </div>
    </>
  );
};

export default Array;
