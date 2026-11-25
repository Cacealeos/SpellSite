"use client";

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
  "Soul Cast": false,
  "Full Cast ": false,
  "Counter Spell": true,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": false,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": true,
  "Aura Surge": true,
};

// ==================================================
// Mastery Data
// ==================================================

const masteryRates = {
  NOVICE: 2,
  INTERMEDIATE: 3,
  MASTERED: 4,
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

  // ==================================================
  // Technique State
  // ==================================================

  const [counterSpell, setCounterSpell] = useState(false);
  const [spellRecovery, setSpellRecovery] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const rate = masteryRates[mastery];

  // ==================================================
  // Derived Values
  // ==================================================

  const mannaCost = rate > 0 ? Math.ceil(disruption / rate) : 0;

  // ==================================================
  // Counter Spell
  // ==================================================

  // Allows Transmogrification to be used as
  // a DEFENSIVE measure.
  //
  // Does not modify Manna cost or Disruption.

  // ==================================================
  // Spell Recovery
  // ==================================================

  // Allows the recovery of lost spells at
  // 50% of their original Manna cost.

  const recoveryCost = Math.ceil(mannaCost * SPELL_RECOVERY_MULTIPLIER);

  // ==================================================
  // Aura Surge
  // ==================================================

  // While channeling MENTAL ENERGY:
  //
  // Drain Avatar, Manifest Death, and Alter Integrity
  // can Constrict targets through a contested check:
  //
  // Power + Dis vs Power + Dis
  //
  // The check is resolved dynamically during casting.
  // No caster or target statistics are required
  // during spell creation.

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
      setSpellRecovery(false);
      setAuraSurge(false);
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

            {/* Aura Surge */}

            <button
              type="button"
              aria-pressed={auraSurge}
              onClick={() => setAuraSurge((prev) => !prev)}
              className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                auraSurge
                  ? "bg-orange-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-orange-600 hover:text-white"
              }`}
            >
              Aura Surge
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
        {/* Aura Surge */}
        {/* ================================================== */}

        {auraSurge && (
          <div className="mb-5 rounded-lg border border-orange-700 bg-orange-950/30 p-4 text-sm text-orange-200">
            <h4 className="mb-3 font-semibold text-orange-300">
              Aura Surge — Mental Energy
            </h4>

            <p className="leading-relaxed">
              While channeling <strong>Mental Energy</strong>, Drain Avatar,
              Manifest Death, and Alter Integrity spells can{" "}
              <strong>Constrict</strong> targets through a{" "}
              <strong>Power + Dis vs Power + Dis</strong> check.
            </p>

            <div className="mt-4 space-y-3 rounded-md border border-orange-800 bg-gray-900 p-4">
              {/* Required Energy */}

              <div className="flex justify-between gap-4">
                <span>Required Energy</span>

                <span className="text-right font-semibold text-orange-300">
                  MENTAL ENERGY
                </span>
              </div>

              {/* Additional Effect */}

              <div className="flex justify-between gap-4">
                <span>Additional Effect</span>

                <span className="text-right font-semibold text-orange-300">
                  CONSTRICT
                </span>
              </div>

              {/* Contested Check */}

              <div className="border-t border-orange-800 pt-3">
                <div className="mb-3 text-center font-semibold text-orange-300">
                  Contested Check
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  {/* Power + Dis */}

                  <div className="rounded-md border border-orange-800 bg-orange-950/30 p-3 text-center">
                    <div className="text-xs text-gray-400">Caster Side</div>

                    <div className="mt-1 font-bold text-orange-300">
                      Power + Dis
                    </div>
                  </div>

                  <span className="font-bold text-gray-500">VS</span>

                  {/* Target Power + Dis */}

                  <div className="rounded-md border border-orange-800 bg-orange-950/30 p-3 text-center">
                    <div className="text-xs text-gray-400">Target</div>

                    <div className="mt-1 font-bold text-orange-300">
                      Power + Dis
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs italic text-orange-200/80">
              Requires channeling Mental Energy. The contested check and
              Constrict effect are resolved during casting.
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
          {/* Aura Surge Properties */}
          {/* ================================================== */}

          {auraSurge && (
            <>
              <div className="flex justify-between gap-4">
                <span>Aura Surge</span>

                <span className="text-right font-semibold text-orange-400">
                  MENTAL ENERGY
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Additional Effect</span>

                <span className="text-right font-semibold text-orange-400">
                  CONSTRICT
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Constrict Check</span>

                <span className="text-right font-semibold text-orange-400">
                  Power + Dis vs Power + Dis
                </span>
              </div>
            </>
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

          <span className="mt-1 block text-sm text-gray-400">
            Disruption per Manna varies with Mastery.
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

export default AlterIntegrity;
