import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

type TransmutePartProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const TransmutePart = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmutePartProps) => {
  const [power, setPower] = useState(5);
  const [damage, setDamage] = useState(0);

  const getRates = (masteryType: string): number[] => {
    switch (masteryType) {
      case "NOVICE":
        return [25, 6, 150];

      case "INTERMEDIATE":
        return [20, 5, 120];

      case "MASTERED":
        return [15, 4, 90];

      default:
        return [0, 0, 0];
    }
  };

  // Reset local UI state whenever this spell is deselected.
  useEffect(() => {
    if (active) return;

    setPower(5);
    setDamage(0);
  }, [active]);

  // Synchronize the final spell statistics with the parent Spell object.
  useEffect(() => {
    if (!active) return;

    const rates = getRates(ParentMastery.getType());

    const powerCost = rates[0] * (power - 5);
    const damageCost = rates[1] * damage;
    const baseCost = rates[2];

    const finalCost = baseCost + powerCost + damageCost;

    updateSpell("cost", finalCost);

    // This spell does not intrinsically generate TTT.
    updateSpell("ttt", 0);
  }, [active, power, damage, ParentMastery, updateSpell]);

  const rates = getRates(ParentMastery.getType());

  const finalCost = rates[2] + rates[1] * damage + rates[0] * (power - 5);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {" "}
      <div>
        {" "}
        <h1 className="text-xl font-bold">Transmute Particle </h1>
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-semibold text-gray-400">
            EXPLOSIVE DAMAGE
          </h3>

          <h3 className="text-sm font-semibold text-gray-400">
            RANGE - RADIAL
          </h3>

          <h3 className="text-sm font-semibold text-gray-400">
            Scaling: 0 / 33%
          </h3>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-6">
          <h2 className="mb-3 text-xl font-bold text-orange-400">
            Manna to Power
          </h2>

          <input
            type="number"
            min="5"
            max="8"
            step="1"
            value={power}
            onChange={(e) =>
              setPower(Math.min(8, Math.max(5, Number(e.target.value))))
            }
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
            Starts at 5 Power. Each additional Power costs {rates[0]} Manna.
          </p>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-6">
          <h2 className="mb-3 text-xl font-bold text-orange-400">
            Manna to Damage
          </h2>

          <input
            type="number"
            min="0"
            step="1"
            value={damage}
            onChange={(e) => setDamage(Math.max(0, Number(e.target.value)))}
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
            Each additional damage costs {rates[1]} Manna.
          </p>
        </div>
      </div>
      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-2 text-gray-300">
          <div className="flex justify-between">
            <span>Power</span>
            <span className="font-semibold text-cyan-400">{power}</span>
          </div>

          <div className="flex justify-between">
            <span>Damage</span>
            <span className="font-semibold text-cyan-400">{damage + 150}</span>
          </div>

          <div className="flex justify-between">
            <span>Cost</span>
            <span className="font-semibold text-cyan-400">{finalCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransmutePart;
