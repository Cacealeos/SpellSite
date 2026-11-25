"use client";

import { useEffect, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";

import { Mastery, Spell } from "@/app/models";
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
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": true,
  "Aura Surge": true,
};

// ==================================================
// Mastery Data
// ==================================================

const masteryStats = {
  NOVICE: {
    spirit: 5,
    soul: 10,
    life: 6,
  },
  INTERMEDIATE: {
    spirit: 4,
    soul: 8,
    life: 4,
  },
  MASTERED: {
    spirit: 3,
    soul: 6,
    life: 2,
  },
};

type MasteryType = keyof typeof masteryStats;

// ==================================================
// Constants
// ==================================================

const SPELL_RECOVERY_MULTIPLIER = 0.5;

// ==================================================
// Component
// ==================================================

const DrainAvatar = ({
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

  const [spirit, setSpirit] = useState(0);

  const [soul, setSoul] = useState(0);

  const [life, setLife] = useState(0);

  // ==================================================
  // Technique State
  // ==================================================

  const [spellRecovery, setSpellRecovery] = useState(false);

  const [auraSurge, setAuraSurge] = useState(false);

  // ==================================================
  // Mastery
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const currentStats = masteryStats[mastery];

  // ==================================================
  // Derived Values
  // ==================================================

  const spiritCost = spirit * currentStats.spirit;

  const soulCost = soul * currentStats.soul;

  const lifeCost = life * currentStats.life;

  const totalCost = spiritCost + soulCost + lifeCost;

  const totalDamage = spirit + soul + life;

  // ==================================================
  // Spell Recovery
  // ==================================================

  // Allows compensation of lost spells at
  // 50% of their original Manna cost.

  const recoveryCost = Math.ceil(totalCost * SPELL_RECOVERY_MULTIPLIER);

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
    updateSpell("cost", active ? totalCost : 0);
  }, [active, totalCost, updateSpell]);

  // ==================================================
  // Reset
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSpirit(0);
      setSoul(0);
      setLife(0);

      setSpellRecovery(false);
      setAuraSurge(false);
    }
  }, [active]);

  // ==================================================
  // Handlers
  // ==================================================

  const clampDamage = (value: number) => {
    return Math.max(0, Math.trunc(value || 0));
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
        <HeartIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Drain Avatar</h1>
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

                <span className="font-semibold text-gray-200">{totalCost}</span>
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
                  {/* Caster Side */}

                  <div className="rounded-md border border-orange-800 bg-orange-950/30 p-3 text-center">
                    <div className="text-xs text-gray-400">Caster Side</div>

                    <div className="mt-1 font-bold text-orange-300">
                      Power + Dis
                    </div>
                  </div>

                  <span className="font-bold text-gray-500">VS</span>

                  {/* Target Side */}

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

          {/* Life Force Damage */}

          <div className="flex justify-between">
            <span>Life Force Damage</span>

            <span className="font-semibold text-cyan-400">{life}</span>
          </div>

          {/* Spirit Damage */}

          <div className="flex justify-between">
            <span>Spirit Damage</span>

            <span className="font-semibold text-cyan-400">{spirit}</span>
          </div>

          {/* Soul Damage */}

          <div className="flex justify-between">
            <span>Soul Damage</span>

            <span className="font-semibold text-cyan-400">{soul}</span>
          </div>

          {/* Total Damage */}

          <div className="flex justify-between">
            <span>Total Damage</span>

            <span className="font-semibold text-cyan-400">{totalDamage}</span>
          </div>

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
              {totalCost} Manna
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Damage Configuration */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Damage Configuration
        </h3>

        <div className="space-y-6">
          {/* ================================================== */}
          {/* Spirit Damage */}
          {/* ================================================== */}

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="drain-avatar-spirit"
                className="font-semibold text-gray-300"
              >
                Spirit Damage
              </label>

              <span className="text-sm text-gray-400">
                {currentStats.spirit} Manna per Damage
              </span>
            </div>

            <input
              id="drain-avatar-spirit"
              type="number"
              min={0}
              step={1}
              value={spirit}
              onChange={(e) => setSpirit(clampDamage(Number(e.target.value)))}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-500">
                Novice 5 / Intermediate 4 / Mastered 3
              </span>

              <span className="font-semibold text-cyan-400">
                {spiritCost} Manna
              </span>
            </div>
          </div>

          {/* ================================================== */}
          {/* Soul Damage */}
          {/* ================================================== */}

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="drain-avatar-soul"
                className="font-semibold text-gray-300"
              >
                Soul Damage
              </label>

              <span className="text-sm text-gray-400">
                {currentStats.soul} Manna per Damage
              </span>
            </div>

            <input
              id="drain-avatar-soul"
              type="number"
              min={0}
              step={1}
              value={soul}
              onChange={(e) => setSoul(clampDamage(Number(e.target.value)))}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-500">
                Novice 10 / Intermediate 8 / Mastered 6
              </span>

              <span className="font-semibold text-cyan-400">
                {soulCost} Manna
              </span>
            </div>
          </div>

          {/* ================================================== */}
          {/* Life Force Damage */}
          {/* ================================================== */}

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="drain-avatar-life"
                className="font-semibold text-gray-300"
              >
                Life Force Damage
              </label>

              <span className="text-sm text-gray-400">
                {currentStats.life} Manna per Damage
              </span>
            </div>

            <input
              id="drain-avatar-life"
              type="number"
              min={0}
              step={1}
              value={life}
              onChange={(e) => setLife(clampDamage(Number(e.target.value)))}
              className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
            />

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-500">
                Novice 6 / Intermediate 4 / Mastered 2
              </span>

              <span className="font-semibold text-cyan-400">
                {lifeCost} Manna
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DrainAvatar;
