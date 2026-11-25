"use client";

import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Soul Cast": false,
  "Full Cast ": false,
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

type RaysProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const inputClass =
  "w-24 rounded border border-gray-600 bg-gray-800 px-3 py-2 text-center text-lg text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50";

const Rays = ({ ParentMastery, active, updateSpell }: RaysProps) => {
  // ==================================================
  // State
  // ==================================================
  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);
  const [spellCharge, setSpellCharge] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);

  // ==================================================
  // Mastery / Rates
  // ==================================================
  const masteryType = ParentMastery.getType();
  const powerRate =
    masteryType === "NOVICE"
      ? 20
      : masteryType === "INTERMEDIATE"
        ? 15
        : masteryType === "MASTERED"
          ? 10
          : 0;
  const damageRate = 2;

  // ==================================================
  // Spell Statistics
  // ==================================================
  const powerValue = power * powerRate;
  const damageValue = damage * damageRate;
  const baseTTT = powerValue + damageValue;
  const baseCost = 0;
  const finalCost = auraSurge ? Math.ceil(baseCost * 1.5) : baseCost;
  const totalTTT = auraSurge ? Math.ceil(baseTTT * 1.5) : baseTTT;
  const areaOfEffect = auraSurge ? "Small" : "None";

  const chargedPower = spellCharge ? power + 1 : power;
  const hyperPower = hyperSpell ? Math.min(5, chargedPower + 1) : chargedPower;
  const baseDamage = hyperPower * 5 + damage / 2;
  const displayDamage = hyperSpell ? baseDamage * 1.3 : baseDamage;

  // ==================================================
  // Reset Local State
  // ==================================================
  useEffect(() => {
    if (active) return;
    setPower(0);
    setDamage(0);
    setSpellCharge(false);
    setHyperSpell(false);
    setAuraSurge(false);
  }, [active]);

  // ==================================================
  // Update Parent Spell
  // ==================================================
  useEffect(() => {
    if (!active) return;
    updateSpell("cost", finalCost);
    updateSpell("ttt", totalTTT);
  }, [active, finalCost, totalTTT, updateSpell]);

  // ==================================================
  // Render
  // ==================================================
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* Spell Title */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4 text-center">
        <h1 className="text-2xl font-bold text-cyan-400">Rays</h1>
      </div>

      {/* Spell Techniques Table */}
      <div className="mb-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* Power & Endurance & Damage */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">
          Power & Endurance & Damage
        </h2>
        <div className="mb-4 rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">KINETIC DAMAGE</p>
          <p className="text-sm text-gray-400">RANGE - MISSILE</p>
        </div>
        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-gray-300">
            Manna to Power & Endurance
          </label>
          <input
            type="number"
            min="0"
            max="3"
            step="1"
            value={power}
            onChange={(e) => setPower(Number(e.target.value) || 0)}
            className={inputClass}
          />
          <p className="mt-2 text-sm text-gray-400">
            {powerRate} TTT per Manna
          </p>
          <p className="text-xs text-gray-500">Varies with Mastery</p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-300">
            Manna to Damage
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={damage}
            onChange={(e) => setDamage(Number(e.target.value) || 0)}
            className={inputClass}
          />
          <p className="mt-2 text-sm text-gray-400">
            {damageRate} TTT per Manna
          </p>
        </div>
      </div>

      {/* Spell Statistics */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-orange-400">
            Spell Statistics
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={spellCharge}
              onClick={() => setSpellCharge((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${spellCharge ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]" : "border-gray-600 bg-gray-900 text-gray-400 hover:border-cyan-500 hover:text-cyan-300"}`}
            >
              Spell Charge
            </button>
            <button
              type="button"
              aria-pressed={hyperSpell}
              onClick={() => setHyperSpell((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${hyperSpell ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]" : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-500 hover:text-purple-300"}`}
            >
              Hyper Spell
            </button>
            <button
              type="button"
              aria-pressed={auraSurge}
              onClick={() => setAuraSurge((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${auraSurge ? "border-orange-400 bg-orange-500/10 text-orange-300 shadow-[0_0_12px_rgba(251,146,60,0.5)]" : "border-gray-600 bg-gray-900 text-gray-400 hover:border-orange-500 hover:text-orange-300"}`}
            >
              Aura Surge
            </button>
          </div>
        </div>

        {/* Technique Effects */}
        <div className="space-y-3">
          {spellCharge && (
            <p className="border-t border-gray-700 pt-3 text-sm text-cyan-300">
              Increases Power by <span className="font-semibold">+1</span> if
              charged for at least <span className="font-semibold">1 TURN</span>
              .
            </p>
          )}
          {hyperSpell && (
            <p className="border-t border-gray-700 pt-3 text-sm text-purple-300">
              When used with <span className="font-semibold">ETHER</span>,
              increases Ray damage by <span className="font-semibold">30%</span>{" "}
              and Power by <span className="font-semibold">+1</span>, to a
              maximum Power of <span className="font-semibold">5</span>.
            </p>
          )}
          {auraSurge && (
            <div className="rounded-lg border border-orange-700 bg-orange-500/10 p-3 text-sm text-orange-300">
              <h3 className="mb-2 font-semibold">Aura Surge — Body Energy</h3>
              <p>
                While channeling <strong>Body Energy</strong>, adds{" "}
                <strong>Small AOE</strong> to Rays at the cost of{" "}
                <strong>50% extra Manna and TTT</strong>.
              </p>
              <div className="mt-3 space-y-2 rounded border border-gray-700 bg-gray-900 p-3">
                <div className="flex justify-between">
                  <span>AOE</span>
                  <strong>Small</strong>
                </div>
                <div className="flex justify-between">
                  <span>Manna Cost</span>
                  <strong>
                    {baseCost} → {finalCost}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>TTT</span>
                  <strong>
                    {baseTTT} → {totalTTT}
                  </strong>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Body Energy is required during casting. The base Manna cost is
                zero.
              </p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Cost</p>
            <p className="text-xl font-bold text-white">{finalCost}</p>
          </div>
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">TTT</p>
            <p className="text-xl font-bold text-white">{totalTTT}</p>
          </div>
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Damage</p>
            <p className="text-xl font-bold text-white">{displayDamage}</p>
          </div>
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Power</p>
            <p className="text-xl font-bold text-white">{hyperPower}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rays;
