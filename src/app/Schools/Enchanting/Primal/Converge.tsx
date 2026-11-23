import { useEffect } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";

// ==================================================
// TYPES
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

// ==================================================
// COST DATA
// ==================================================

const masteryCosts: Record<MasteryType, number> = {
  NOVICE: 40,
  INTERMEDIATE: 15,
  MASTERED: 0,
};

// ==================================================
// SPELL CONSTANTS
// ==================================================

const BASE_AOE = "MODERATE";

const REESTABLISH_DIFFICULTIES = [
  {
    difficulty: 9,
    label: "9",
  },
  {
    difficulty: 11,
    label: "11*",
  },
  {
    difficulty: 13,
    label: "13**",
  },
];

// ==================================================
// COMPONENT
// ==================================================

const Converge = ({
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
  // MANA COST CALCULATIONS
  // ==================================================

  const finalCost = masteryCosts[mastery];

  // ==================================================
  // PARENT SPELL UPDATE
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
    updateSpell("ttt", 0);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* SPELL TITLE */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <SparklesIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Converge</h1>
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
            <span>Area of Effect</span>

            <span className="font-semibold text-cyan-400">{BASE_AOE}</span>
          </div>

          {/* ================================================== */}
          {/* LINK TARGETS */}
          {/* ================================================== */}

          <div className="flex justify-between gap-3">
            <span>Target Requirement</span>

            <span className="font-semibold text-cyan-400">
              Similar Commands
            </span>
          </div>

          {/* ================================================== */}
          {/* RESULT */}
          {/* ================================================== */}

          <div className="flex justify-between gap-3">
            <span>Link Result</span>

            <span className="font-semibold text-cyan-400">
              Single Mental Link
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* MENTAL LINK RECOVERY */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-3 text-lg font-semibold text-orange-400">
          Mental Link Recovery
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-gray-300">
          Attempt to reestablish a lost mental link with previously connected
          targets using a Dis save.
        </p>

        {/* ================================================== */}
        {/* DIFFICULTY VALUES */}
        {/* ================================================== */}

        <div className="grid grid-cols-3 gap-3">
          {REESTABLISH_DIFFICULTIES.map((option) => (
            <div
              key={option.label}
              className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Dis Save
              </p>

              <p className="text-xl font-bold text-cyan-400">{option.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-400">
          * and ** indicate the original difficulty modifiers.
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
            Converge combines the mental links of similar targets capable of
            receiving similar commands within Moderate AOE of each other into a
            single mental link.
          </p>

          <p>
            Attempt to reestablish a lost mental link with previously connected
            targets using a Dis: 9, 11*, or 13** save.
          </p>
        </div>
      </div>
    </>
  );
};

export default Converge;
