import React, { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import { GlobeAltIcon } from "@heroicons/react/24/solid";

type TransmuteGravityProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const TransmuteGravity = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmuteGravityProps) => {
  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);

  const getRates = (masteryType: string) => {
    switch (masteryType) {
      case "NOVICE":
        return { power: 40, damage: 6 };

      case "INTERMEDIATE":
        return { power: 35, damage: 5 };

      case "MASTERED":
        return { power: 30, damage: 4 };

      default:
        return { power: 0, damage: 0 };
    }
  };

  const rates = getRates(ParentMastery.getType());

  const totalCost = power * rates.power + damage * rates.damage;

  const aoe = power > 6 ? (power > 8 ? "Massive" : "Large") : "Moderate";

  const resCheck = power * 2;

  // Reset local state whenever the spell becomes inactive.
  useEffect(() => {
    if (!active) {
      setPower(0);
      setDamage(0);
    }
  }, [active]);

  // Synchronize the calculated spell statistics with the parent Spell.
  useEffect(() => {
    if (!active) return;

    updateSpell("cost", totalCost);
    updateSpell("ttt", 0);
  }, [active, totalCost, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <div className="flex items-center gap-3">
        <GlobeAltIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Transmute Gravity</h1>
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Spell Properties
        </h2>

        <label className="mb-2 block font-medium text-gray-200">
          <p>GRAVITY</p>
          <p>RANGE - RADIAL</p>
        </label>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-gray-200">
              Power
            </label>

            <input
              type="number"
              min="0"
              max="8"
              step="1"
              value={power}
              onChange={(e) =>
                setPower(Math.min(8, Math.max(0, Number(e.target.value) || 0)))
              }
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
              Manna cost: {rates.power} per Power
            </p>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-200">
              Damage
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={damage}
              onChange={(e) =>
                setDamage(Math.max(0, Number(e.target.value) || 0))
              }
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
              Manna cost: {rates.damage} per Damage
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Power</span>
            <span className="font-semibold text-cyan-400">{power}</span>
          </div>

          <div className="flex justify-between">
            <span>Damage</span>
            <span className="font-semibold text-cyan-400">{damage}</span>
          </div>

          <div className="flex justify-between">
            <span>AOE</span>
            <span className="font-semibold text-cyan-400">{aoe}</span>
          </div>

          <div>
            <div className="flex justify-between">
              <span>Res Check</span>
              <span className="font-semibold text-orange-400">{resCheck}</span>
            </div>

            <p className="mt-1 text-right text-xs text-gray-500">
              Res check scales with Power.
            </p>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Manna</span>
            <span className="font-semibold text-cyan-400">{totalCost}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Secondary
        </h2>

        <div className="space-y-2 text-gray-300">
          <div className="flex justify-between">
            <span>Effect</span>
            <span className="font-semibold text-orange-400">Gravity</span>
          </div>

          <div className="flex justify-between">
            <span>Range</span>
            <span className="font-semibold text-orange-400">Radial</span>
          </div>

          <div className="flex justify-between">
            <span>AOE</span>
            <span className="font-semibold text-orange-400">Moderate</span>
          </div>

          <div className="flex justify-between">
            <span>Check</span>
            <span className="font-semibold text-orange-400">
              {resCheck} vs Res OR Dis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransmuteGravity;
