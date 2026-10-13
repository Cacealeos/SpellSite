import { useEffect, useState } from "react";
import { ShieldExclamationIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
import Select from "@/app/Select";
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
// Mastery Data
// ==================================================

const masteryRates = {
  NOVICE: 2,
  INTERMEDIATE: 3,
  MASTERED: 4,
};

// ==================================================
// AOE Data
// ==================================================

const sizes = ["Small AOE", "Moderate AOE", "Large AOE"];

// ==================================================
// Component
// ==================================================

const AlterIntegrity = ({
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

  const [disruption, setDisruption] = useState(0);

  const [size, setSize] = useState("Small AOE");

  const [counterSpell, setCounterSpell] = useState(false);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const rate = masteryRates[mastery];

  // ==================================================
  // Derived Values
  // ==================================================

  const mannaCost = rate > 0 ? Math.ceil(disruption / rate) : 0;

  // ==================================================
  // Spell Update
  // ==================================================

  useEffect(() => {
    updateSpell("cost", active ? mannaCost : 0);
  }, [active, mannaCost, updateSpell]);

  // ==================================================
  // Reset
  // ==================================================

  useEffect(() => {
    if (!active) {
      setDisruption(0);
      setSize("Small AOE");
      setCounterSpell(false);
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const changeDisruption = (value: number) => {
    setDisruption(Math.max(0, Math.trunc(value || 0)));
  };

  const changeSize = (value: string) => {
    setSize(value);

    updateSpell("range", value);
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
        <ShieldExclamationIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Alter Integrity</h1>
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

        {/* ================================================== */}
        {/* Technique Caption */}
        {/* ================================================== */}

        {counterSpell && (
          <div className="mb-5 rounded-lg border border-purple-800 bg-purple-950/30 p-3">
            <p className="text-sm leading-relaxed text-gray-300">
              <strong className="text-purple-400">Counter Spell:</strong> Allows
              Transmogrification to be used as a{" "}
              <strong className="text-purple-300">DEFENSIVE</strong> measure.
            </p>
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Statistics */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          {/* Damage Type */}

          <div className="flex justify-between">
            <span>Damage Type</span>

            <span className="font-semibold text-cyan-400">DIRECT</span>
          </div>

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

          {/* Disruption Rate */}

          <div className="flex justify-between">
            <span>Disruption per Manna</span>

            <span className="font-semibold text-cyan-400">{rate}</span>
          </div>

          {/* Disruption */}

          <div className="flex justify-between">
            <span>Disruption</span>

            <span className="font-semibold text-cyan-400">{disruption}</span>
          </div>

          {/* AOE */}

          <div className="flex justify-between">
            <span>AOE</span>

            <span className="font-semibold text-cyan-400">{size}</span>
          </div>

          {/* Final Cost */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {mannaCost}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Disruption Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Disruption
        </h3>

        <p className="mb-4 text-sm text-gray-400">
          1 Manna ={" "}
          <span className="font-semibold text-cyan-400">{rate} Disruption</span>
        </p>

        <label className="block">
          <span className="mb-2 block font-semibold text-gray-300">
            Disruption Amount
          </span>

          <input
            type="number"
            min={0}
            step={1}
            value={disruption}
            onChange={(e) => changeDisruption(Number(e.target.value))}
            className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
          />
        </label>
      </div>

      {/* ================================================== */}
      {/* Area of Effect */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Area of Effect
        </h3>

        <Select title="AOE" choices={sizes} changeChoice={changeSize} />
      </div>
    </>
  );
};

export default AlterIntegrity;
