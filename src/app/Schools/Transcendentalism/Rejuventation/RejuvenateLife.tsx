import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

type RejuvenateLifeProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const RejuvenateLife = ({
  ParentMastery,
  active,
  updateSpell,
}: RejuvenateLifeProps) => {
  const [lifeForce, setLifeForce] = useState(0);

  const getRate = (masteryType: string): number => {
    switch (masteryType) {
      case "NOVICE":
        return 4;
      case "INTERMEDIATE":
        return 2;
      case "MASTERED":
        return 1;
      default:
        return 0;
    }
  };

  const rate = getRate(ParentMastery.getType());
  const cost = lifeForce * rate;

  useEffect(() => {
    if (!active) {
      setLifeForce(0);
      return;
    }

    updateSpell("cost", cost);
    updateSpell("ttt", 0);
  }, [active, cost, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* Title */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Rejuvenate Life</h1>
      </div>

      {/* Life-Force Input */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">Life-Force</h2>

        <div className="mb-3 rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">
            Restore Life-Force
          </p>
          <p className="text-sm text-gray-400">
            Manna cost is {rate} per point of Life-Force restored.
          </p>
        </div>

        <input
          type="number"
          min="0"
          step="1"
          value={lifeForce}
          onChange={(e) => setLifeForce(Number(e.target.value) || 0)}
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
      </div>

      {/* Spell Statistics */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Spell Statistics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Life-Force</p>
            <p className="text-xl font-bold text-white">{lifeForce}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Cost</p>
            <p className="text-xl font-bold text-white">{cost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Rate</p>
            <p className="text-xl font-bold text-white">
              {rate} Manna / Life-Force
            </p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">TTT</p>
            <p className="text-xl font-bold text-white">0</p>
          </div>
        </div>
      </div>

      {/* Secondary */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">Secondary</h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">LIFE-FORCE</p>
          <p className="text-sm text-gray-400">Restore Life-Force</p>
        </div>
      </div>
    </div>
  );
};

export default RejuvenateLife;
