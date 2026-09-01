import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

type ProjectionsRepulsionProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const ProjectionsRepulsion = ({
  ParentMastery,
  active,
  updateSpell,
}: ProjectionsRepulsionProps) => {
  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);
  const [aoe, setAoe] = useState(1);

  const getPowerRate = (masteryType: string): number => {
    switch (masteryType) {
      case "NOVICE":
        return 6;
      case "INTERMEDIATE":
        return 4;
      case "MASTERED":
        return 2;
      default:
        return 0;
    }
  };

  const getAoeCost = (masteryType: string, aoeLevel: number): number => {
    switch (masteryType) {
      case "NOVICE":
        if (aoeLevel === 2) return 45;
        if (aoeLevel === 3) return 180;
        return 0;

      case "INTERMEDIATE":
        if (aoeLevel === 2) return 35;
        if (aoeLevel === 3) return 140;
        return 0;

      case "MASTERED":
        if (aoeLevel === 2) return 25;
        if (aoeLevel === 3) return 100;
        return 0;

      default:
        return 0;
    }
  };

  const masteryType = ParentMastery.getType();
  const powerRate = getPowerRate(masteryType);
  const aoeCost = getAoeCost(masteryType, aoe);

  const powerCost = power * powerRate;
  const finalCost = aoeCost + powerCost + damage;
  const maxDamage = power * 15 + 5;

  const aoeLabel = aoe === 1 ? "Small" : aoe === 2 ? "Moderate" : "Large";

  useEffect(() => {
    if (!active) {
      setPower(0);
      setDamage(0);
      setAoe(1);
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", finalCost);
  }, [active, finalCost, updateSpell]);

  const handlePowerChange = (value: number) => {
    const newPower = Math.max(0, Math.min(3, value));

    setPower(newPower);

    const newMaxDamage = newPower * 15 + 5;

    setDamage((currentDamage) => Math.min(currentDamage, newMaxDamage));
  };

  const handleDamageChange = (value: number) => {
    const newDamage = Math.max(0, Math.min(maxDamage, value));

    setDamage(newDamage);
  };

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Repulsion</h1>
      </div>

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">
          Power & Endurance
        </h2>

        <div className="mb-3 rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">KINETIC DAMAGE</p>
          <p className="text-sm text-gray-400">RANGE - RADIAL</p>
          <p className="mt-2 text-sm text-gray-400">
            Manna to Power & Endurance
          </p>
        </div>

        <input
          type="number"
          min="0"
          max="3"
          step="1"
          value={power}
          onChange={(e) => handlePowerChange(Number(e.target.value))}
          className="
            w-24
            rounded
            border
            border-gray-600
            bg-gray-800
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
          Power & Endurance cost: {powerRate} per Manna.
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">Damage</h2>

        <div className="mb-3 rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm text-gray-400">
            Damage contributes directly to the spell's Manna cost.
          </p>
        </div>

        <input
          type="number"
          min="0"
          max={maxDamage}
          step="1"
          value={damage}
          onChange={(e) => handleDamageChange(Number(e.target.value))}
          className="
            w-24
            rounded
            border
            border-gray-600
            bg-gray-800
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
          Maximum damage: Power × 15 + 5.
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">Area of Effect</h2>

        <div className="space-y-3">
          <label className="flex cursor-pointer items-center justify-between rounded border border-gray-700 bg-gray-900 p-3 transition hover:border-gray-500">
            <div>
              <p className="font-semibold text-gray-200">Small</p>
              <p className="text-sm text-gray-400">0 / 0 / 0 Manna</p>
            </div>

            <input
              type="radio"
              name="projections-repulsion-aoe"
              checked={aoe === 1}
              onChange={() => setAoe(1)}
              className="h-5 w-5 accent-cyan-500"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded border border-gray-700 bg-gray-900 p-3 transition hover:border-gray-500">
            <div>
              <p className="font-semibold text-gray-200">Moderate</p>
              <p className="text-sm text-gray-400">45 / 35 / 25 Manna</p>
            </div>

            <input
              type="radio"
              name="projections-repulsion-aoe"
              checked={aoe === 2}
              onChange={() => setAoe(2)}
              className="h-5 w-5 accent-cyan-500"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded border border-gray-700 bg-gray-900 p-3 transition hover:border-gray-500">
            <div>
              <p className="font-semibold text-gray-200">Large</p>
              <p className="text-sm text-gray-400">180 / 140 / 100 Manna</p>
            </div>

            <input
              type="radio"
              name="projections-repulsion-aoe"
              checked={aoe === 3}
              onChange={() => setAoe(3)}
              className="h-5 w-5 accent-cyan-500"
            />
          </label>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Spell Statistics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Cost</p>
            <p className="text-xl font-bold text-white">{finalCost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Power</p>
            <p className="text-xl font-bold text-white">{power}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Damage</p>
            <p className="text-xl font-bold text-white">{damage}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">AOE</p>
            <p className="text-xl font-bold text-white">{aoeLabel}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">Secondary</h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">KINETIC DAMAGE</p>
          <p className="text-sm text-gray-400">RANGE - RADIAL</p>
          <p className="text-sm text-gray-400">AOE - Small</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectionsRepulsion;
