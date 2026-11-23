"use client";

import { useEffect } from "react";
import { BoltIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// TYPES
// ==================================================

type SupportedSchool =
  | "Deliverance"
  | "Conjuration"
  | "Elder Magic"
  | "Alchemy";

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
// SPELL CONSTANTS
// ==================================================

const SPELL_NAME = "Conduit";
const SPELL_TAG = "NBF";

const SUPPORTED_AOE = ["LARGE", "MASSIVE"] as const;

const SUPPORTED_SCHOOLS: SupportedSchool[] = [
  "Deliverance",
  "Conjuration",
  "Elder Magic",
  "Alchemy",
];

// ==================================================
// COMPONENT
// ==================================================

const Conduit = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ==================================================
  // SPELL CALCULATIONS
  // ==================================================

  // Placeholder values until the spell's
  // Mana Cost or TTT mechanics are defined.

  const finalCost = 0;
  const finalTTT = 0;

  // ==================================================
  // PARENT SPELL UPDATE
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalCost, finalTTT, updateSpell]);

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* SPELL TITLE */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <BoltIcon className="h-8 w-8 text-cyan-400" />

        <div>
          <h1 className="text-2xl font-bold text-cyan-400">{SPELL_NAME}</h1>

          <p className="text-xs font-semibold text-gray-400">{SPELL_TAG}</p>
        </div>
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
          {/* AREA OF EFFECT */}
          {/* ================================================== */}

          <div className="flex justify-between gap-3">
            <span>Supported AOE</span>

            <span className="font-semibold text-cyan-400">
              {SUPPORTED_AOE.join(" / ")}
            </span>
          </div>

          {/* ================================================== */}
          {/* TARGET REQUIREMENT */}
          {/* ================================================== */}

          <div className="flex justify-between gap-3">
            <span>Target Requirement</span>

            <span className="font-semibold text-cyan-400">Mentally Linked</span>
          </div>

          {/* ================================================== */}
          {/* EFFECT */}
          {/* ================================================== */}

          <div className="flex justify-between gap-3">
            <span>Effect</span>

            <span className="font-semibold text-cyan-400">
              AOE Spell Bolstering
            </span>
          </div>

          {/* ================================================== */}
          {/* ORIGIN */}
          {/* ================================================== */}

          <div className="flex justify-between gap-3">
            <span>Spell Origin</span>

            <span className="font-semibold text-cyan-400">Caster</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* SUPPORTED SCHOOLS */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-3 text-lg font-semibold text-orange-400">
          Supported Schools
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {SUPPORTED_SCHOOLS.map((school) => (
            <div
              key={school}
              className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center"
            >
              <span className="font-semibold text-cyan-400">{school}</span>
            </div>
          ))}
        </div>
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
            Conduit uses the total number of mentally linked targets to bolster
            specific Large or Massive AOE spells emanating from the caster.
          </p>

          <p>
            Conduit applies to supported spells from Deliverance, Conjuration,
            Elder Magic, and Alchemy.
          </p>

          <p>The caster must not be suppressed.</p>
        </div>
      </div>
    </>
  );
};

export default Conduit;
