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
  NOVICE: 9,
  INTERMEDIATE: 6,
  MASTERED: 3,
};

const HYPER_PAIN = 1000;

type Sense = "Sight" | "Smell" | "Touch" | "Taste" | "Sound" | "Manna";

const SENSES: Sense[] = ["Sight", "Smell", "Touch", "Taste", "Sound", "Manna"];

// ==================================================
// Component
// ==================================================

const InducedIllusion = ({
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

  const [desc, setDesc] = useState("");

  const [spellReflex, setSpellReflex] = useState(false);

  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const tttRate = MASTERY_TTT[mastery];

  // ==================================================
  // Derived Values
  // ==================================================

  const selectedSenseCount = selectedSenses.length;

  const hasDescription = desc.trim().length > 0;

  const selectedTargets = selectedSenseCount + (hasDescription ? 1 : 0);

  const totalTTT = selectedTargets * tttRate;

  const touchSelected = selectedSenses.includes("Touch");

  const hyperPainActive = hyperSpell && touchSelected;

  const painPerTurn = hyperPainActive ? HYPER_PAIN : 0;

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
      setDesc("");
      setSpellReflex(false);
      setHyperSpell(false);
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

        <h1 className="text-2xl font-bold text-cyan-400">Induced Illusion</h1>
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
        {/* Header & Technique Buttons */}
        {/* ================================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <div className="flex flex-wrap gap-2">
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

            <button
              type="button"
              onClick={() => setHyperSpell(!hyperSpell)}
              aria-pressed={hyperSpell}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                hyperSpell
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Captions */}
        {/* ================================================== */}

        {(spellReflex || hyperSpell) && (
          <div className="mb-5 space-y-3">
            {spellReflex && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Reflex:</strong>{" "}
                  Grants an{" "}
                  <strong className="text-purple-300">
                    extra roll upon failure
                  </strong>{" "}
                  to induce illusions.
                </p>
              </div>
            )}

            {hyperSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Hyper Spell:</strong>{" "}
                  Induced illusions that target the sense of touch can inflict{" "}
                  <strong className="text-red-400">1000 Pain per turn</strong>.
                </p>

                {!touchSelected && (
                  <p className="mt-2 text-sm italic text-amber-400">
                    Select Touch to activate this effect.
                  </p>
                )}
              </div>
            )}
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

          {/* Selected Senses */}

          <div className="flex justify-between">
            <span>Selected Senses</span>

            <span className="font-semibold text-cyan-400">
              {selectedSenseCount}
            </span>
          </div>

          {/* Additional Description */}

          <div className="flex justify-between">
            <span>Additional Illusion</span>

            <span className="font-semibold text-cyan-400">
              {hasDescription ? "YES" : "NO"}
            </span>
          </div>

          {/* TTT per Sense */}

          <div className="flex justify-between">
            <span>TTT per Sense / Description</span>

            <span className="font-semibold text-cyan-400">{tttRate}</span>
          </div>

          {/* Pain per Turn */}

          {hyperSpell && (
            <div className="flex justify-between">
              <span>Pain per Turn</span>

              <span
                className={`font-semibold ${
                  hyperPainActive ? "text-red-400" : "text-gray-500"
                }`}
              >
                {painPerTurn}
              </span>
            </div>
          )}

          {/* Final TTT */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Total TTT</span>

            <span className="text-lg font-bold text-orange-400">
              {totalTTT}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Illusion Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Illusion Configuration
        </h3>

        <div className="space-y-5">
          {/* ================================================== */}
          {/* Impair Senses */}
          {/* ================================================== */}

          <div>
            <p className="mb-3 font-semibold text-gray-300">
              Impair Senses
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({tttRate} TTT per sense)
              </span>
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
                    className={`rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                      selected
                        ? "border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                        : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{sense}</span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-all ${
                          selected
                            ? "border-cyan-400 bg-cyan-400 text-gray-900"
                            : "border-gray-600 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================== */}
          {/* Additional Illusion Description */}
          {/* ================================================== */}

          <div>
            <label
              htmlFor="illusion-description"
              className="mb-2 block font-semibold text-gray-300"
            >
              Additional Illusion Description
            </label>

            <textarea
              id="illusion-description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Optional"
              rows={3}
              className="w-full rounded-md border border-gray-600 bg-gray-900 p-3 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />

            <p className="mt-2 text-sm italic text-gray-400">
              Adding a description contributes one additional TTT unit at the
              current mastery rate.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InducedIllusion;
