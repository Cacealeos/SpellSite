import { useEffect, useState } from "react";
import { UserGroupIcon } from "@heroicons/react/24/solid";

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
  NOVICE: 10,
  INTERMEDIATE: 5,
  MASTERED: 0,
};

// ==================================================
// AOE Data
// ==================================================

const sizes = ["Small AOE", "Moderate AOE", "Large AOE"];

// ==================================================
// Component
// ==================================================

const ManifestProxy = ({
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

  const [turns, setTurns] = useState(0);

  const [size, setSize] = useState("Small AOE");

  // ==================================================
  // Mastery
  // ==================================================

  const testMastery = new Mastery();

  const mastery =
    ParentMastery.getType() === testMastery.novice(true)
      ? "NOVICE"
      : ParentMastery.getType() === testMastery.intermediate(true)
        ? "INTERMEDIATE"
        : "MASTERED";

  const rate = masteryRates[mastery];

  // ==================================================
  // Derived Values
  // ==================================================

  const mannaCost = turns * rate;

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
      setTurns(0);
      setSize("Small AOE");
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const changeTurns = (value: number) => {
    setTurns(Math.max(0, Math.trunc(value || 0)));
  };

  const changeSize = (value: string) => {
    setSize(value);
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
        <UserGroupIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Manifest Proxy</h1>
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
        {/* Header */}
        {/* ================================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>
        </div>

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

          {/* Turns */}

          <div className="flex justify-between">
            <span>Turns</span>

            <span className="font-semibold text-cyan-400">{turns}</span>
          </div>

          {/* Manna per Turn */}

          <div className="flex justify-between">
            <span>Manna per Turn</span>

            <span className="font-semibold text-cyan-400">{rate}</span>
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
      {/* Turn Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Turns
        </h3>

        <p className="mb-4 text-sm text-gray-400">
          Manna per Turn:{" "}
          <span className="font-semibold text-cyan-400">{rate}</span> (Novice 10
          / Intermediate 5 / Mastered 0).
        </p>

        <label className="block">
          <span className="mb-2 block font-semibold text-gray-300">
            Number of Turns
          </span>

          <input
            type="number"
            min={0}
            step={1}
            value={turns}
            onChange={(e) => changeTurns(Number(e.target.value))}
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

export default ManifestProxy;
