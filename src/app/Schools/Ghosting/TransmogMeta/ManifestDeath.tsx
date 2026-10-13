import { useEffect, useState } from "react";
import { NoSymbolIcon } from "@heroicons/react/24/solid";

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
// Types
// ==================================================

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

// ==================================================
// Potency Data
// ==================================================

const potencyStats = {
  MINOR: {
    NOVICE: { cost: 60, resistance: 6 },
    INTERMEDIATE: { cost: 45, resistance: 6 },
    MASTERED: { cost: 30, resistance: 6 },
  },
  MAJOR: {
    NOVICE: { cost: 120, resistance: 7 },
    INTERMEDIATE: { cost: 100, resistance: 7 },
    MASTERED: { cost: 80, resistance: 7 },
  },
  EXTREME: {
    NOVICE: { cost: 200, resistance: 8 },
    INTERMEDIATE: { cost: 175, resistance: 8 },
    MASTERED: { cost: 150, resistance: 8 },
  },
};

// ==================================================
// Potency Options
// ==================================================

const potencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: "Cost: 60 / 45 / 30",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "Cost: 120 / 100 / 80",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "Cost: 200 / 175 / 150",
  },
];

// ==================================================
// Component
// ==================================================

const ManifestDeath = ({
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

  const [spellCharge, setSpellCharge] = useState(false);

  const [hyperSpell, setHyperSpell] = useState(false);

  const [counterSpell, setCounterSpell] = useState(false);

  const [chargeTurns, setChargeTurns] = useState(0);

  // ==================================================
  // Mastery
  // ==================================================

  const testMastery = new Mastery();

  let mastery: MasteryType = "NOVICE";

  if (ParentMastery.getType() === testMastery.intermediate(true)) {
    mastery = "INTERMEDIATE";
  } else if (ParentMastery.getType() === testMastery.mastered(true)) {
    mastery = "MASTERED";
  }

  // ==================================================
  // Derived Values
  // ==================================================

  const currentStats = potencyStats[selectedPotency][mastery];

  const baseResistance = currentStats.resistance;

  const finalCost = currentStats.cost;

  // Each turn of Spell Charge adds +1 resistance.
  const resistanceBonus = spellCharge ? chargeTurns : 0;

  const finalResistance = baseResistance + resistanceBonus;

  // Hyper Spell grants AOE based on charge turns.
  const areaOfEffect =
    hyperSpell && spellCharge
      ? chargeTurns >= 4
        ? "MODERATE"
        : chargeTurns >= 2
          ? "SMALL"
          : "NONE"
      : "NONE";

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // Reset
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSelectedPotency("MINOR");
      setSpellCharge(false);
      setHyperSpell(false);
      setCounterSpell(false);
      setChargeTurns(0);
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const toggleSpellCharge = () => {
    if (spellCharge) {
      setSpellCharge(false);
      setHyperSpell(false);
      setChargeTurns(0);
    } else {
      setSpellCharge(true);
    }
  };

  const toggleHyperSpell = () => {
    setHyperSpell((previous) => !previous);
  };

  const changeChargeTurns = (value: number) => {
    setChargeTurns(Math.max(0, Math.trunc(value || 0)));
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
        <NoSymbolIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Manifest Death</h1>
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
            {/* Spell Charge */}

            <button
              type="button"
              onClick={toggleSpellCharge}
              aria-pressed={spellCharge}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                spellCharge
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Spell Charge
            </button>

            {/* Hyper Spell */}

            <button
              type="button"
              onClick={toggleHyperSpell}
              disabled={!spellCharge}
              aria-pressed={hyperSpell}
              title={!spellCharge ? "Enable Spell Charge first" : undefined}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                !spellCharge
                  ? "cursor-not-allowed bg-gray-900 text-gray-600"
                  : hyperSpell
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Hyper Spell
            </button>

            {/* Counter Spell */}

            <button
              type="button"
              onClick={() => setCounterSpell(!counterSpell)}
              aria-pressed={counterSpell}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                counterSpell
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Counter Spell
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Captions */}
        {/* ================================================== */}

        {(spellCharge || hyperSpell || counterSpell) && (
          <div className="mb-5 space-y-3">
            {/* Spell Charge Caption */}

            {spellCharge && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Spell Charge:</strong>{" "}
                  Increases Manifest Death's Resistance Check by{" "}
                  <strong className="text-purple-300">
                    +1 per turn of charge
                  </strong>
                  .
                </p>
              </div>
            )}

            {/* Hyper Spell Caption */}

            {hyperSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Hyper Spell:</strong>{" "}
                  Applies <strong className="text-purple-300">Small AOE</strong>{" "}
                  at 2 turns of charge and{" "}
                  <strong className="text-purple-300">Moderate AOE</strong> at 4
                  turns of charge.
                </p>
              </div>
            )}

            {/* Counter Spell Caption */}

            {counterSpell && (
              <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-purple-400">Counter Spell:</strong>{" "}
                  Allows Manifest Death to be used as a{" "}
                  <strong className="text-purple-300">DEFENSIVE</strong>{" "}
                  measure.
                </p>
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

          {/* Potency */}

          <div className="flex justify-between">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">
              {selectedPotency}
            </span>
          </div>

          {/* Base Resistance */}

          <div className="flex justify-between">
            <span>Base Resistance Check</span>

            <span className="font-semibold text-cyan-400">
              {baseResistance}
            </span>
          </div>

          {/* Charge Turns */}

          {spellCharge && (
            <>
              <div className="flex justify-between">
                <span>Charge Turns</span>

                <span className="font-semibold text-cyan-400">
                  {chargeTurns}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Charge Bonus</span>

                <span className="font-semibold text-purple-400">
                  +{resistanceBonus}
                </span>
              </div>
            </>
          )}

          {/* Area of Effect */}

          {hyperSpell && (
            <div className="flex justify-between">
              <span>AOE</span>

              <span className="font-semibold text-cyan-400">
                {areaOfEffect}
              </span>
            </div>
          )}

          {/* Final Resistance */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">
              Final Resistance Check
            </span>

            <span className="text-lg font-bold text-orange-400">
              {finalResistance}
            </span>
          </div>

          {/* Final Cost */}

          <div className="flex justify-between">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Potency Selection */}
      {/* ================================================== */}

      <div className="mt-6">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* ================================================== */}
      {/* Spell Charge Configuration */}
      {/* ================================================== */}

      {spellCharge && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Spell Charge Configuration
          </h3>

          {/* Charge Turns Input */}

          <label className="block">
            <span className="mb-2 block font-semibold text-gray-300">
              Turns of Charge
            </span>

            <input
              type="number"
              min={0}
              step={1}
              value={chargeTurns}
              onChange={(e) => changeChargeTurns(Number(e.target.value))}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />
          </label>

          {/* Charge Statistics */}

          <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="flex justify-between text-gray-300">
              <span>Resistance Bonus</span>

              <span className="font-semibold text-purple-400">
                +{resistanceBonus}
              </span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>Final Resistance</span>

              <span className="font-semibold text-cyan-400">
                {finalResistance}
              </span>
            </div>

            {hyperSpell && (
              <div className="flex justify-between text-gray-300">
                <span>Hyper Spell AOE</span>

                <span className="font-semibold text-cyan-400">
                  {areaOfEffect}
                </span>
              </div>
            )}
          </div>

          {/* Hyper Spell Thresholds */}

          {hyperSpell && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div
                className={`rounded-lg border p-3 ${
                  chargeTurns >= 2
                    ? "border-purple-500 bg-purple-950/40"
                    : "border-gray-700 bg-gray-900"
                }`}
              >
                <p className="font-semibold text-gray-200">Small AOE</p>

                <p className="mt-1 text-sm text-gray-400">2 Turns of Charge</p>
              </div>

              <div
                className={`rounded-lg border p-3 ${
                  chargeTurns >= 4
                    ? "border-purple-500 bg-purple-950/40"
                    : "border-gray-700 bg-gray-900"
                }`}
              >
                <p className="font-semibold text-gray-200">Moderate AOE</p>

                <p className="mt-1 text-sm text-gray-400">4 Turns of Charge</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ManifestDeath;
