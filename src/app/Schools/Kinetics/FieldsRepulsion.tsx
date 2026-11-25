"use client";

import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

const Techniques = {
  "Quick Spell": false,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": false,
  "Soul Cast": false,
  "Full Cast ": false,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Aura Surge": true,
};

const FieldsRepulse = ({
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

  const [damage, setDamage] = useState(0);
  const [power, setPower] = useState(0);
  const [size, setSize] = useState(1);

  const [counterSpell, setCounterSpell] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);

  // ==================================================
  // Mastery / Rates
  // ==================================================

  const testMastery = new Mastery();

  let powerRate = 0;
  let damageRate = 0;
  let aoeCost = 0;

  if (ParentMastery.getType() === testMastery.novice(true)) {
    powerRate = 15;
    damageRate = 4;

    if (size === 1) aoeCost = 0;
    else if (size === 2) aoeCost = 45;
    else if (size === 3) aoeCost = 180;
  } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
    powerRate = 12;
    damageRate = 3;

    if (size === 1) aoeCost = 0;
    else if (size === 2) aoeCost = 35;
    else if (size === 3) aoeCost = 140;
  } else if (ParentMastery.getType() === testMastery.mastered(true)) {
    powerRate = 10;
    damageRate = 2;

    if (size === 1) aoeCost = 0;
    else if (size === 2) aoeCost = 25;
    else if (size === 3) aoeCost = 100;
  }

  // ==================================================
  // Base Spell Statistics
  // ==================================================

  const baseCost = aoeCost + power * powerRate + damage * damageRate;
  const totalCost = auraSurge ? Math.ceil(baseCost * 1.5) : baseCost;

  // Preserve the original displayed damage calculation.
  const baseDamage = damage * damageRate;
  const auraDamageBonus = auraSurge ? Math.ceil(baseDamage * 0.3) : 0;
  const finalDamage = baseDamage + auraDamageBonus;

  // ==================================================
  // Effective Range
  // ==================================================

  // Counter Spell and Hyper Spell each increase the
  // selected range by one level, up to Large AOE.
  const effectiveSize = Math.min(
    3,
    size + (counterSpell ? 1 : 0) + (hyperSpell ? 1 : 0),
  );

  const effectiveAOE =
    effectiveSize === 1 ? "Small" : effectiveSize === 2 ? "Moderate" : "Large";

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) {
      setPower(0);
      setDamage(0);
      setSize(1);
      setCounterSpell(false);
      setHyperSpell(false);
      setAuraSurge(false);

      updateSpell("cost", 0);

      return;
    }

    updateSpell("cost", totalCost);
  }, [active, totalCost, updateSpell]);

  // ==================================================
  // Power / Damage Handlers
  // ==================================================

  const handlePowerChange = (value: number) => {
    const newPower = Math.max(0, Math.min(3, value));

    setPower(newPower);

    const maxDamage = newPower * 25 + 5;

    setDamage((currentDamage) => Math.min(currentDamage, maxDamage));
  };

  const handleDamageChange = (value: number) => {
    const maxDamage = power * 25 + 5;

    setDamage(Math.max(0, Math.min(maxDamage, value)));
  };

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Title */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4 text-center">
        <h1 className="text-2xl font-bold text-cyan-400">Fields Repulsion</h1>
      </div>

      <div className="mb-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        {/* ================================================== */}
        {/* Power */}
        {/* ================================================== */}

        <div className="mb-4 rounded-md border border-gray-700 bg-gray-900/70 p-4">
          <h2 className="mb-1 text-lg font-semibold text-gray-200">Power</h2>

          <p className="mb-3 text-sm text-gray-400">Manna to Power</p>

          <input
            type="number"
            min="0"
            max="3"
            step="1"
            value={power}
            onChange={(e) => handlePowerChange(Number(e.target.value))}
            className="w-24 rounded border border-gray-600 bg-gray-800 px-3 py-2 text-center text-lg text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
          />

          <p className="mt-2 text-xs text-gray-500">
            Power cost: {powerRate} per Manna.
          </p>
        </div>

        {/* ================================================== */}
        {/* Damage */}
        {/* ================================================== */}

        <div className="rounded-md border border-gray-700 bg-gray-900/70 p-4">
          <h2 className="mb-1 text-lg font-semibold text-gray-200">Damage</h2>

          <p className="mb-3 text-sm text-gray-400">Manna to Damage</p>

          <input
            type="number"
            min="0"
            max={power * 25 + 5}
            step="1"
            value={damage}
            onChange={(e) => handleDamageChange(Number(e.target.value))}
            className="w-24 rounded border border-gray-600 bg-gray-800 px-3 py-2 text-center text-lg text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
          />

          <p className="mt-2 text-xs text-gray-500">
            Maximum Manna to Damage: {power * 25 + 5}
          </p>
        </div>
      </div>

      {/* ================================================== */}
      {/* Range */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-xl font-bold text-orange-400">Range</h2>

        <div className="space-y-3">
          {/* Small AOE */}

          <label className="flex items-center gap-3 rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <input
              type="radio"
              name="fields-repulse-size"
              checked={size === 1}
              onChange={() => setSize(1)}
              className="h-4 w-4 accent-cyan-500"
            />

            <span>Small AOE</span>

            <span className="ml-auto text-sm text-gray-400">0</span>
          </label>

          {/* Moderate AOE */}

          <label className="flex items-center gap-3 rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <input
              type="radio"
              name="fields-repulse-size"
              checked={size === 2}
              onChange={() => setSize(2)}
              className="h-4 w-4 accent-cyan-500"
            />

            <span>Moderate AOE</span>

            <span className="ml-auto text-sm text-gray-400">
              {ParentMastery.getType() === testMastery.novice(true)
                ? 45
                : ParentMastery.getType() === testMastery.intermediate(true)
                  ? 35
                  : 25}
            </span>
          </label>

          {/* Large AOE */}

          <label className="flex items-center gap-3 rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <input
              type="radio"
              name="fields-repulse-size"
              checked={size === 3}
              onChange={() => setSize(3)}
              className="h-4 w-4 accent-cyan-500"
            />

            <span>Large AOE</span>

            <span className="ml-auto text-sm text-gray-400">
              {ParentMastery.getType() === testMastery.novice(true)
                ? 180
                : ParentMastery.getType() === testMastery.intermediate(true)
                  ? 140
                  : 100}
            </span>
          </label>
        </div>

        {/* ================================================== */}
        {/* Effective Range */}
        {/* ================================================== */}

        {(counterSpell || hyperSpell) && (
          <p className="mt-4 border-t border-gray-700 pt-3 text-sm text-cyan-300">
            Effective Range:{" "}
            <span className="font-semibold">{effectiveAOE} AOE</span>
          </p>
        )}
      </div>

      {/* ================================================== */}
      {/* Effects */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-xl font-bold text-orange-400">Effects</h2>

        <div className="space-y-2 text-sm text-gray-400">
          <p>KINETIC DAMAGE</p>
          <p>RANGE - RADIAL</p>
          <p>AOE - {effectiveAOE}</p>
        </div>
      </div>

      {/* ================================================== */}
      {/* Final Stats */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-orange-400">Final Stats</h2>

          {/* ================================================== */}
          {/* Spell Techniques */}
          {/* ================================================== */}

          <div className="flex flex-wrap gap-2">
            {/* Counter Spell */}

            <button
              type="button"
              onClick={() => setCounterSpell((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                counterSpell
                  ? "border-red-400 bg-red-500/10 text-red-300 shadow-[0_0_12px_rgba(248,113,113,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-red-500 hover:text-red-300"
              }`}
            >
              Counter Spell
            </button>

            {/* Hyper Spell */}

            <button
              type="button"
              onClick={() => setHyperSpell((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                hyperSpell
                  ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-500 hover:text-purple-300"
              }`}
            >
              Hyper Spell
            </button>

            {/* Aura Surge */}
            <button
              type="button"
              aria-pressed={auraSurge}
              onClick={() => setAuraSurge((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                auraSurge
                  ? "border-orange-400 bg-orange-500/10 text-orange-300 shadow-[0_0_12px_rgba(251,146,60,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-orange-500 hover:text-orange-300"
              }`}
            >
              Aura Surge
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Effects */}
        {/* ================================================== */}

        <div className="mb-4 space-y-2">
          {counterSpell && (
            <p className="border-t border-gray-700 pt-3 text-sm text-red-300">
              Allows the spell to be used as a{" "}
              <span className="font-semibold">DEFENSIVE MEASURE</span>.
            </p>
          )}

          {auraSurge && (
            <div className="rounded-lg border border-orange-700 bg-orange-950/30 p-4 text-sm text-orange-200">
              <h3 className="mb-2 font-semibold text-orange-300">
                Aura Surge — Body Energy
              </h3>
              <p>
                While channeling <strong>Body Energy</strong>, Repulsion
                receives <strong>+30% Damage</strong> at the cost of{" "}
                <strong>50% extra Manna</strong>.
              </p>
              <div className="mt-3 space-y-2 rounded-md border border-orange-800 bg-gray-900 p-3">
                <div className="flex justify-between">
                  <span>Base Damage</span>
                  <strong>{baseDamage}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Damage Bonus</span>
                  <strong>+{auraDamageBonus}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Final Damage</span>
                  <strong>{finalDamage}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Base Manna Cost</span>
                  <strong>{baseCost}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Additional Manna</span>
                  <strong>+{totalCost - baseCost}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Final Manna Cost</span>
                  <strong>{totalCost}</strong>
                </div>
              </div>
              <p className="mt-2 text-xs text-orange-300">
                Requires channeling Body Energy during casting.
              </p>
            </div>
          )}

          {hyperSpell && (
            <p className="border-t border-gray-700 pt-3 text-sm text-purple-300">
              Increases Range by{" "}
              <span className="font-semibold">ONE LEVEL</span>.
            </p>
          )}
        </div>

        {/* ================================================== */}
        {/* Statistics */}
        {/* ================================================== */}

        <div className="grid grid-cols-2 gap-3">
          {/* Cost */}

          <div className="rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Cost
            </p>

            <p className="text-xl font-bold text-orange-400">{totalCost}</p>
          </div>

          {/* Power */}

          <div className="rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Power
            </p>

            <p className="text-xl font-bold text-cyan-400">{power}</p>
          </div>
        </div>

        {/* Damage */}

        <div className="mt-3 rounded-md border border-gray-700 bg-gray-900/70 p-3">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Damage
          </p>

          <p className="text-xl font-bold text-red-400">{finalDamage}</p>
        </div>

        {/* Effective Range */}

        <div className="mt-3 rounded-md border border-gray-700 bg-gray-900/70 p-3">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Effective Range
          </p>

          <p className="text-xl font-bold text-cyan-400">{effectiveAOE}</p>
        </div>
      </div>
    </div>
  );
};

export default FieldsRepulse;
