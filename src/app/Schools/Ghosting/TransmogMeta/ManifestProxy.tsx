"use client";

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
  "Soul Cast": true,
  "Full Cast ": true,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": true,
  "Rivet Cast": true,
  "Spell Recovery": true,
  "Aura Surge": false,
};

// ==================================================
// Mastery Data
// ==================================================

const masteryRates = {
  NOVICE: 10,
  INTERMEDIATE: 5,
  MASTERED: 0,
};

type MasteryType = keyof typeof masteryRates;

// ==================================================
// AOE Data
// ==================================================

const sizes = ["Small AOE", "Moderate AOE", "Large AOE"];

// ==================================================
// Constants
// ==================================================

const SPELL_RECOVERY_MULTIPLIER = 0.5;

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
  // Technique State
  // ==================================================

  const [counterSpell, setCounterSpell] = useState(false);

  const [spellRecovery, setSpellRecovery] = useState(false);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const rate = masteryRates[mastery];

  // ==================================================
  // Derived Values
  // ==================================================

  const mannaCost = turns * rate;

  // ==================================================
  // Counter Spell
  // ==================================================

  // Allows Transmogrification to be used as
  // a DEFENSIVE measure.
  //
  // Does not modify the normal Manna cost.

  // ==================================================
  // Spell Recovery
  // ==================================================

  // Allows compensation of lost spells at
  // 50% of their original Manna cost.

  const recoveryCost = Math.ceil(mannaCost * SPELL_RECOVERY_MULTIPLIER);

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

      setCounterSpell(false);
      setSpellRecovery(false);
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
        {/* Header & Technique Buttons */}
        {/* ================================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h3 className="text-lg font-semibold text-orange-400">
            Spell Properties
          </h3>

          <div className="flex flex-wrap gap-2">
            {/* Counter Spell */}

            <button
              type="button"
              aria-pressed={counterSpell}
              onClick={() => setCounterSpell((prev) => !prev)}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                counterSpell
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Counter Spell
            </button>

            {/* Spell Recovery */}

            <button
              type="button"
              aria-pressed={spellRecovery}
              onClick={() => setSpellRecovery((prev) => !prev)}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                spellRecovery
                  ? "bg-fuchsia-700 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-fuchsia-700 hover:text-white"
              }`}
            >
              Spell Recovery
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Counter Spell */}
        {/* ================================================== */}

        {counterSpell && (
          <div className="mb-5 rounded-lg border border-purple-800 bg-purple-950/30 p-4 text-sm text-purple-200">
            <h4 className="mb-3 font-semibold text-purple-300">
              Counter Spell
            </h4>

            <p className="leading-relaxed">
              Allows Transmogrification to be used as a{" "}
              <strong>DEFENSIVE</strong> measure.
            </p>

            <div className="mt-4 flex justify-between gap-4 rounded-md border border-purple-800 bg-gray-900 p-3">
              <span>Additional Action</span>

              <span className="font-bold text-purple-300">DEFENSIVE</span>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* Spell Recovery */}
        {/* ================================================== */}

        {spellRecovery && (
          <div className="mb-5 rounded-lg border border-fuchsia-700 bg-fuchsia-950/30 p-4 text-sm text-fuchsia-200">
            <h4 className="mb-3 font-semibold text-fuchsia-300">
              Spell Recovery
            </h4>

            <p className="leading-relaxed">
              Allows for the compensation of lost spells at{" "}
              <strong>50% Manna cost</strong>.
            </p>

            <div className="mt-4 space-y-3 rounded-md border border-fuchsia-800 bg-gray-900 p-4">
              {/* Normal Manna Cost */}

              <div className="flex justify-between">
                <span>Normal Manna Cost</span>

                <span className="font-semibold text-gray-200">{mannaCost}</span>
              </div>

              {/* Recovery Discount */}

              <div className="flex justify-between">
                <span>Recovery Discount</span>

                <span className="font-semibold text-fuchsia-300">50%</span>
              </div>

              {/* Recovery Cost */}

              <div className="flex justify-between border-t border-fuchsia-800 pt-3">
                <span className="font-semibold">Recovery Cost</span>

                <span className="font-bold text-fuchsia-300">
                  {recoveryCost} Manna
                </span>
              </div>
            </div>
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

          {/* ================================================== */}
          {/* Counter Spell Properties */}
          {/* ================================================== */}

          {counterSpell && (
            <div className="flex justify-between gap-4">
              <span>Additional Action</span>

              <span className="text-right font-semibold text-purple-400">
                DEFENSIVE
              </span>
            </div>
          )}

          {/* ================================================== */}
          {/* Spell Recovery Cost */}
          {/* ================================================== */}

          {spellRecovery && (
            <div className="flex justify-between">
              <span>Spell Recovery Cost</span>

              <span className="font-semibold text-fuchsia-400">
                {recoveryCost} Manna
              </span>
            </div>
          )}

          {/* ================================================== */}
          {/* Final Cost */}
          {/* ================================================== */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {mannaCost} Manna
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

          <span className="mt-1 block text-sm text-gray-400">
            Manna per Turn varies with Mastery.
          </span>
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
