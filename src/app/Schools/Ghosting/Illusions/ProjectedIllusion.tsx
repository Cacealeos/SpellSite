import { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": true,
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

const MASTERY_TTT = {
  NOVICE: 15,
  INTERMEDIATE: 10,
  MASTERED: 5,
};

const AOE_TTT = {
  SMALL: {
    NOVICE: 5,
    INTERMEDIATE: 3,
    MASTERED: 1,
  },
  MODERATE: {
    NOVICE: 9,
    INTERMEDIATE: 6,
    MASTERED: 3,
  },
  LARGE: {
    NOVICE: 15,
    INTERMEDIATE: 11,
    MASTERED: 7,
  },
};

type Sense = "Sight" | "Smell" | "Touch" | "Taste" | "Sound" | "Manna";

type AOE = "SMALL" | "MODERATE" | "LARGE";

const SENSES: Sense[] = ["Sight", "Smell", "Touch", "Taste", "Sound", "Manna"];

const AOE_OPTIONS: {
  value: AOE;
  label: string;
  description: string;
}[] = [
  {
    value: "SMALL",
    label: "Small AOE",
    description: "+5 / 3 / 1 TTT",
  },
  {
    value: "MODERATE",
    label: "Moderate AOE",
    description: "+9 / 6 / 3 TTT",
  },
  {
    value: "LARGE",
    label: "Large AOE",
    description: "+15 / 11 / 7 TTT",
  },
];

// ==================================================
// Component
// ==================================================

const ProjectedIllusion = ({
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

  const [selectedSenses, setSelectedSenses] = useState<Sense[]>([]);

  const [size, setSize] = useState<AOE>("SMALL");

  const [desc, setDesc] = useState("");

  const [spellReflex, setSpellReflex] = useState(false);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const senseCost = MASTERY_TTT[mastery];

  // ==================================================
  // Derived Values
  // ==================================================

  const impairedSenseCount = selectedSenses.length;

  const senseTTT = impairedSenseCount * senseCost;

  const aoeCost = AOE_TTT[size][mastery];

  const totalTTT = senseTTT + aoeCost;

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("ttt", active ? totalTTT : 0);
  }, [active, totalTTT, updateSpell]);

  // ==================================================
  // Reset
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedSenses([]);
      setSize("SMALL");
      setDesc("");
      setSpellReflex(false);
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const toggleSense = (sense: Sense) => {
    setSelectedSenses((previous) =>
      previous.includes(sense)
        ? previous.filter((item) => item !== sense)
        : [...previous, sense],
    );
  };

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

        <h1 className="text-2xl font-bold text-cyan-400">Projected Illusion</h1>
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
        {/* ================================================== */}
        {/* Header & Technique Button */}
        {/* ================================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <button
            type="button"
            onClick={() => setSpellReflex(!spellReflex)}
            aria-pressed={spellReflex}
            className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
              spellReflex
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
            }`}
          >
            Spell Reflex
          </button>
        </div>

        {/* ================================================== */}
        {/* Technique Caption */}
        {/* ================================================== */}

        {spellReflex && (
          <div className="mb-5 rounded-lg border border-purple-800 bg-purple-950/30 p-3">
            <p className="text-sm leading-relaxed text-gray-300">
              <strong className="text-purple-400">Spell Reflex:</strong> Grants
              an{" "}
              <strong className="text-purple-300">
                extra roll upon failure
              </strong>{" "}
              to induce illusions.
            </p>
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Range */}

          <div className="flex justify-between">
            <span>Range</span>

            <span className="font-semibold text-cyan-400">DIRECT</span>
          </div>

          {/* Mastery */}

          <div className="flex justify-between">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">{mastery}</span>
          </div>

          {/* Impaired Senses */}

          <div className="flex justify-between">
            <span>Impaired Senses</span>

            <span className="font-semibold text-cyan-400">
              {impairedSenseCount}
            </span>
          </div>

          {/* TTT per Sense */}

          <div className="flex justify-between">
            <span>TTT per Sense</span>

            <span className="font-semibold text-cyan-400">{senseCost}</span>
          </div>

          {/* Sense TTT */}

          <div className="flex justify-between">
            <span>Sense TTT</span>

            <span className="font-semibold text-cyan-400">{senseTTT}</span>
          </div>

          {/* AOE */}

          <div className="flex justify-between">
            <span>AOE</span>

            <span className="font-semibold text-cyan-400">{size}</span>
          </div>

          {/* AOE TTT */}

          <div className="flex justify-between">
            <span>AOE TTT</span>

            <span className="font-semibold text-cyan-400">{aoeCost}</span>
          </div>

          {/* Final TTT */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final TTT</span>

            <span className="text-lg font-bold text-orange-400">
              {totalTTT}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Impair Senses */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Impair Senses
        </h3>

        <p className="mb-4 text-sm text-gray-400">
          Each selected sense adds{" "}
          <span className="font-semibold text-cyan-400">{senseCost} TTT</span>.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SENSES.map((sense) => {
            const selected = selectedSenses.includes(sense);

            return (
              <button
                key={sense}
                type="button"
                onClick={() => toggleSense(sense)}
                aria-pressed={selected}
                className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                  selected
                    ? "border-cyan-400 bg-cyan-950 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                    : "border-gray-600 bg-gray-900 text-gray-400 hover:border-gray-400 hover:text-gray-200"
                }`}
              >
                {sense}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================== */}
      {/* Area of Effect */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Area of Effect
        </h3>

        <div className="space-y-3">
          {AOE_OPTIONS.map((option) => {
            const selected = size === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSize(option.value)}
                aria-pressed={selected}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  selected
                    ? "border-cyan-400 bg-cyan-950 text-cyan-300"
                    : "border-gray-600 bg-gray-900 text-gray-400 hover:border-gray-400"
                }`}
              >
                <div className="font-semibold">{option.label}</div>

                <div className="text-sm">{option.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================== */}
      {/* Illusion Description */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Illusion Description
        </h3>

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="min-h-24 w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-gray-200 outline-none transition focus:border-cyan-400"
          placeholder="Describe the projected illusion..."
        />
      </div>
    </>
  );
};

export default ProjectedIllusion;
