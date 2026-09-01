import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

type RaysProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const Rays = ({ ParentMastery, active, updateSpell }: RaysProps) => {
  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);

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

  const powerValue = power * powerRate;
  const damageValue = damage * damageRate;

  const totalTTT = powerValue + damageValue;

  const displayDamage = power * 5 + damage / 2;

  useEffect(() => {
    if (!active) {
      setPower(0);
      setDamage(0);
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;

    updateSpell("cost", 0);
    updateSpell("ttt", totalTTT);
  }, [active, totalTTT, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Rays</h1>
      </div>

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
            {powerRate} TTT per Manna
          </p>
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
            {damageRate} TTT per Manna
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">
          Spell Statistics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Cost</p>
            <p className="text-xl font-bold text-white">0</p>
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
            <p className="text-xl font-bold text-white">{powerValue}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">Secondary</h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">KINETIC DAMAGE</p>
          <p className="text-sm text-gray-400">RANGE - MISSILE</p>
          <p className="text-sm text-gray-400">AOE - None</p>
        </div>
      </div>
    </div>
  );
};

export default Rays;
