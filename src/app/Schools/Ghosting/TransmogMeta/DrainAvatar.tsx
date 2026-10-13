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
  // Mastery
  // ==================================================

  const testMastery = new Mastery();

  const mastery =
    ParentMastery.getType() === testMastery.novice(true)
      ? "NOVICE"
      : ParentMastery.getType() === testMastery.intermediate(true)
        ? "INTERMEDIATE"
        : "MASTERED";

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

          {/* Final Cost */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-100">Final Cost</span>

            <span className="text-lg font-bold text-orange-400">
              {totalCost}
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
