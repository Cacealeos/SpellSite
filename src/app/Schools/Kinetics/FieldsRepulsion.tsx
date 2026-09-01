import React, { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

const FieldsRepulse = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [cost, setCost] = useState(0);
  const [damage, setDamage] = useState(0);
  const [power, setPower] = useState(0);
  const [size, setSize] = useState(1);

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

  const totalCost = aoeCost + power * powerRate + damage * damageRate;

  useEffect(() => {
    if (!active) {
      setCost(0);
      setPower(0);
      setDamage(0);
      setSize(1);
      updateSpell("cost", 0);
      return;
    }

    setCost(totalCost);
    updateSpell("cost", totalCost);
  }, [active, totalCost, updateSpell]);

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

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h1 className="mb-4 text-2xl font-bold text-orange-400">
          Fields Repulsion
        </h1>

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

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-xl font-bold text-orange-400">Range</h2>

        <div className="space-y-3">
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
      </div>

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-xl font-bold text-orange-400">Effects</h2>

        <div className="space-y-2 text-sm text-gray-400">
          <p>KINETIC DAMAGE</p>
          <p>RANGE - RADIAL</p>
          <p>
            AOE - {size === 1 ? "Small" : size === 2 ? "Moderate" : "Large"}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-xl font-bold text-orange-400">Final Stats</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Cost
            </p>

            <p className="text-xl font-bold text-orange-400">{cost}</p>
          </div>

          <div className="rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Power
            </p>

            <p className="text-xl font-bold text-cyan-400">{power}</p>
          </div>
        </div>

        <div className="mt-3 rounded-md border border-gray-700 bg-gray-900/70 p-3">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Damage
          </p>

          <p className="text-xl font-bold text-red-400">
            {damage * damageRate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FieldsRepulse;
