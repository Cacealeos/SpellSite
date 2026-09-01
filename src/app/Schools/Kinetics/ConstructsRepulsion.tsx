import React, { useEffect, useState } from "react";
import { Mastery } from "@/app/models";

type ConstructsRepulsionProps = {
  ParentMastery: Mastery;
  active: boolean;
};

const ConstructsRepulsion = ({
  ParentMastery,
  active,
}: ConstructsRepulsionProps) => {
  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);
  const [aoe, setAoe] = useState(1);
  const [cost, setCost] = useState(0);

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

  useEffect(() => {
    if (!active) {
      setPower(0);
      setDamage(0);
      setAoe(1);
      setCost(0);
      return;
    }

    const masteryType = ParentMastery.getType();
    const aoeCost = getAOECost(masteryType, aoe);

    setCost(aoeCost + damage);
  }, [active, damage, aoe, ParentMastery]);

  useEffect(() => {
    const maxDamage = power * 15 + 5;

    if (damage > maxDamage) {
      setDamage(maxDamage);
    }
  }, [power, damage]);

  return (
    <div className="space-y-6 rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* Title */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-100">Repulsion</h1>
      </div>

      {/* Spell Information */}
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

      {/* Power */}
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

      {/* Damage */}
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

      {/* AOE */}
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

      {/* Final Statistics */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h2 className="mb-4 border-b border-gray-700 pb-3 text-xl font-bold text-gray-100">
          Final Statistics
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Power</span>

            <span className="font-semibold text-white">{power}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Damage</span>

            <span className="font-semibold text-white">{damage}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">AOE</span>

            <span className="font-semibold text-cyan-400">{getAOEName()}</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-700 pt-3">
            <span className="text-lg font-semibold text-gray-300">Cost</span>

            <span className="text-2xl font-bold text-orange-400">{cost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructsRepulsion;
