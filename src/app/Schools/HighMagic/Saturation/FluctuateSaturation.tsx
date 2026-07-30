import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";

// ==================================================
// Static Data
// ==================================================

const masteryData = {
  NOVICE: {
    powerRate: 12,
    damageRate: 5,
  },
  INTERMEDIATE: {
    powerRate: 10,
    damageRate: 4,
  },
  MASTERED: {
    powerRate: 8,
    damageRate: 3,
  },
};

export default function FluctuateSaturation({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) {
  // ==================================================
  // State
  // ==================================================
  const [power, setPower] = useState(0);
  const [damageInvestment, setDamageInvestment] = useState(0);

  // ==================================================
  // Derived Values
  // ==================================================
  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const { powerRate, damageRate } = masteryData[mastery];

  const powerDamageBonus = power * 5;

  const totalDamage = damageInvestment + powerDamageBonus;

  const cost = power * powerRate + damageInvestment * damageRate;

  const positiveScaling = 0;
  const negativeScaling = 0.2;
  const scalingAdjustment = Math.floor(totalDamage * negativeScaling);
  // ==================================================
  // Spell Updates
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* Statistics */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Fluctuation Statistics
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Damage Type</span>
            <span className="font-semibold text-cyan-400">Kinetic</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Range</span>
            <span className="font-semibold text-cyan-400">Missile / Cloud</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Scaling</span>

            <span className="font-semibold text-cyan-400">
              0 / {scalingAdjustment} ({positiveScaling * 100}% / -
              {negativeScaling * 100}%)
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Power</span>
            <span className="font-semibold text-cyan-400">{power}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Damage</span>
            <span className="font-semibold text-cyan-400">{totalDamage}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Cost</span>
            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>
        </div>
      </div>

      {/* Power Investment */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Power Investment
        </h3>

        <label className="mb-2 block text-sm text-gray-300">
          Manna to Power
          <span className="ml-2 text-xs text-gray-500">(Max of 5)</span>
        </label>

        <input
          type="number"
          min={0}
          max={5}
          value={power}
          onChange={(e) => setPower(Number(e.target.value) || 0)}
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-center text-lg text-cyan-400"
        />

        <p className="mt-4 text-center text-sm text-gray-400">Bonus Damage</p>

        <p className="text-center text-xl font-semibold text-cyan-400">
          +{powerDamageBonus}
        </p>
      </div>

      {/* Damage Investment */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Damage Investment
        </h3>

        <label className="mb-2 block text-sm text-gray-300">
          Manna to Damage
        </label>

        <input
          type="number"
          min={0}
          max={200}
          value={damageInvestment}
          onChange={(e) => setDamageInvestment(Number(e.target.value) || 0)}
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-center text-lg text-cyan-400"
        />
      </div>
    </>
  );
}
