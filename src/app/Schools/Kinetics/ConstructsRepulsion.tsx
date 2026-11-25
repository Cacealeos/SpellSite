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
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Aura Surge": true,
};

type ConstructsRepulsionProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const ConstructsRepulsion = ({
  ParentMastery,
  active,
  updateSpell,
}: ConstructsRepulsionProps) => {
  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);
  const [aoe, setAoe] = useState(1);
  const [auraSurge, setAuraSurge] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Area of Effect Cost
  // ==================================================

  const getAOECost = (masteryType: string, aoeSize: number): number => {
    switch (masteryType) {
      case "NOVICE":
        if (aoeSize === 1) return 0;
        if (aoeSize === 2) return 45;
        if (aoeSize === 3) return 180;
        return 0;

      case "INTERMEDIATE":
        if (aoeSize === 1) return 0;
        if (aoeSize === 2) return 35;
        if (aoeSize === 3) return 140;
        return 0;

      case "MASTERED":
        if (aoeSize === 1) return 0;
        if (aoeSize === 2) return 25;
        if (aoeSize === 3) return 100;
        return 0;

      default:
        return 0;
    }
  };

  // ==================================================
  // AOE Name
  // ==================================================

  const getAOEName = () => {
    switch (aoe) {
      case 1:
        return "Small";

      case 2:
        return "Moderate";

      case 3:
        return "Large";

      default:
        return "Small";
    }
  };

  // ==================================================
  // Spell Cost
  // ==================================================

  const masteryType = ParentMastery.getType();
  const aoeCost = getAOECost(masteryType, aoe);
  const baseCost = aoeCost + damage;
  const auraAdjustedCost = baseCost * (auraSurge ? 1.5 : 1);
  const finalCost = Math.ceil(auraAdjustedCost * (hyperSpell ? 0.33 : 1));

  useEffect(() => {
    if (!active) {
      setPower(0);
      setDamage(0);
      setAoe(1);
      setHyperSpell(false);
      setAuraSurge(false);
    }
  }, [active]);

  useEffect(() => {
    updateSpell("cost", active ? finalCost : 0);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // Damage Limit
  // ==================================================

  useEffect(() => {
    const maxDamage = power * 15 + 5;

    if (damage > maxDamage) {
      setDamage(maxDamage);
    }
  }, [power, damage]);

  // ==================================================
  // Hyper Spell Damage
  // ==================================================

  const damageBonus = Math.ceil(
    (damage * ((auraSurge ? 30 : 0) + (hyperSpell ? 50 : 0))) / 100,
  );
  const finalDamage = damage + damageBonus;

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="space-y-6 rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Title */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-center shadow-md">
        <h1 className="text-2xl font-bold text-cyan-400">Repulsion</h1>
      </div>

      <SpellTechniquesTable techniques={Techniques} />

      {/* ================================================== */}
      {/* Spell Information */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md">
        <div className="space-y-2 text-center">
          <h3 className="text-sm font-semibold tracking-wide text-cyan-400">
            KINETIC DAMAGE
          </h3>

          <h3 className="text-sm font-semibold tracking-wide text-cyan-400">
            RANGE - RADIAL
          </h3>
        </div>
      </div>

      {/* ================================================== */}
      {/* Power */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Manna to Power
        </h2>

        <input
          type="number"
          min="0"
          max="3"
          step="1"
          value={power}
          onChange={(e) => setPower(Number(e.target.value) || 0)}
          className="
            w-24
            rounded
            border
            border-gray-600
            bg-gray-900
            px-3
            py-2
            text-center
            text-lg
            text-white
            outline-none
            transition
            focus:border-cyan-500
            focus:ring-2
            focus:ring-cyan-500/50
          "
        />

        <p className="mt-2 text-sm text-gray-400">
          Power determines the maximum available damage.
        </p>
      </div>

      {/* ================================================== */}
      {/* Damage */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Manna to Damage
        </h2>

        <input
          type="number"
          min="0"
          max={power * 15 + 5}
          step="1"
          value={damage}
          onChange={(e) => setDamage(Number(e.target.value) || 0)}
          className="
            w-24
            rounded
            border
            border-gray-600
            bg-gray-900
            px-3
            py-2
            text-center
            text-lg
            text-white
            outline-none
            transition
            focus:border-cyan-500
            focus:ring-2
            focus:ring-cyan-500/50
          "
        />

        <p className="mt-2 text-sm text-gray-400">
          Maximum Damage: {power * 15 + 5}
        </p>

        <p className="text-sm text-gray-400">
          Each point of damage adds 1 Manna to the final cost.
        </p>
      </div>

      {/* ================================================== */}
      {/* AOE */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Area of Effect
        </h2>

        <div className="space-y-3">
          <label className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-3 py-2">
            <span className="text-gray-300">Small — 0 / 0 / 0</span>

            <input
              type="radio"
              name="repulsion-aoe"
              checked={aoe === 1}
              onChange={() => setAoe(1)}
              className="h-4 w-4 cursor-pointer accent-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-3 py-2">
            <span className="text-gray-300">Moderate — 45 / 35 / 25</span>

            <input
              type="radio"
              name="repulsion-aoe"
              checked={aoe === 2}
              onChange={() => setAoe(2)}
              className="h-4 w-4 cursor-pointer accent-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-3 py-2">
            <span className="text-gray-300">Large — 180 / 140 / 100</span>

            <input
              type="radio"
              name="repulsion-aoe"
              checked={aoe === 3}
              onChange={() => setAoe(3)}
              className="h-4 w-4 cursor-pointer accent-cyan-500"
            />
          </label>
        </div>
      </div>

      {/* ================================================== */}
      {/* Final Statistics */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h2 className="text-xl font-bold text-orange-400">
            Final Statistics
          </h2>

          <div className="flex flex-wrap gap-2">
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
          </div>
        </div>

        {auraSurge && (
          <div className="mb-4 rounded-lg border border-orange-700 bg-orange-950/30 p-4 text-sm text-orange-200">
            <h3 className="mb-2 font-semibold text-orange-300">
              Aura Surge — Body Energy
            </h3>
            <p>
              While channeling <strong>Body Energy</strong>, Repulsion receives{" "}
              <strong>+30% Damage</strong> at the cost of{" "}
              <strong>50% extra Manna</strong>.
            </p>
            <p className="mt-2 text-xs text-orange-300">
              Requires channeling Body Energy during casting.
            </p>
          </div>
        )}

        {hyperSpell && (
          <p className="mb-4 border-b border-gray-700 pb-3 text-sm text-purple-300">
            Reduces Cost by 67% and increases Damage by 50%.
          </p>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Power</span>

            <span className="font-semibold text-white">{power}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Damage</span>

            <span className="font-semibold text-white">{finalDamage}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">AOE</span>

            <span className="font-semibold text-cyan-400">{getAOEName()}</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-700 pt-3">
            <span className="text-lg font-semibold text-gray-300">Cost</span>

            <span className="text-2xl font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructsRepulsion;
