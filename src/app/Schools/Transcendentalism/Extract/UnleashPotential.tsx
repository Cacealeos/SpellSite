import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

type UnleashPotentialProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const UnleashPotential = ({
  ParentMastery,
  active,
  updateSpell,
}: UnleashPotentialProps) => {
  const [base, setBase] = useState(0);

  const getMultiplier = (masteryType: string): number => {
    switch (masteryType) {
      case "NOVICE":
        return 1.75;
      case "INTERMEDIATE":
        return 1.5;
      case "MASTERED":
        return 1.25;
      default:
        return 0;
    }
  };

  const multiplier = getMultiplier(ParentMastery.getType());
  const finalCost = base * multiplier;

  useEffect(() => {
    if (!active) {
      setBase(0);
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;

    updateSpell("cost", finalCost);
    updateSpell("ttt", 0);
  }, [active, finalCost, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* Title */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Unleash Potential</h1>
      </div>

      {/* Base Cost */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">
          Recipient Spell
        </h2>

        <div className="mb-3 rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">Base Spell Cost</p>
          <p className="text-sm text-gray-400">
            Enter the base Manna cost of the recipient spell.
          </p>
        </div>

        <input
          type="number"
          min="0"
          step="1"
          value={base}
          onChange={(e) => setBase(Number(e.target.value) || 0)}
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

      {/* Mastery Penalty */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-cyan-300">
          Mastery Penalty
        </h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm text-gray-400">
            Unleash Potential increases the recipient spell&apos;s base cost
            according to mastery.
          </p>

          <p className="mt-2 text-sm font-semibold text-gray-300">
            Current multiplier: ×{multiplier}
          </p>
        </div>
      </div>

      {/* Spell Statistics */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Spell Statistics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Base Cost</p>
            <p className="text-xl font-bold text-white">{base}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Penalty</p>
            <p className="text-xl font-bold text-white">×{multiplier}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Final Cost</p>
            <p className="text-xl font-bold text-white">{finalCost}</p>
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
          <p className="text-sm font-semibold text-gray-300">RECIPIENT SPELL</p>
          <p className="text-sm text-gray-400">
            Unleash Potential modifies the recipient spell&apos;s Manna cost.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnleashPotential;
