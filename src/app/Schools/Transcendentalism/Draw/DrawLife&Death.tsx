import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import { Potency } from "@/app/models/Potency";

type DrawLifeDeathProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const DrawLifeDeath = ({
  ParentMastery,
  active,
  updateSpell,
}: DrawLifeDeathProps) => {
  const [potency, setPotency] = useState<Potency>("MINOR");
  const [targetNecroForce, setTargetNecroForce] = useState(false);

  const mastery = ParentMastery.getType();

  const potencyCosts: Record<Potency, Record<string, number>> = {
    MINOR: {
      NOVICE: 25,
      INTERMEDIATE: 20,
      MASTERED: 15,
    },
    MAJOR: {
      NOVICE: 55,
      INTERMEDIATE: 45,
      MASTERED: 35,
    },
    EXTREME: {
      NOVICE: 120,
      INTERMEDIATE: 100,
      MASTERED: 80,
    },
    CATACLYSMIC: {
      NOVICE: 0,
      INTERMEDIATE: 0,
      MASTERED: 0,
    },
  };

  const damageRanges: Record<Potency, string> = {
    MINOR: "10 – 35",
    MAJOR: "40 – 90",
    EXTREME: "100 – 220",
    CATACLYSMIC: "—",
  };

  const potencyOptions = [
    {
      value: "MINOR" as Potency,
      label: "Minor",
      description: "25 / 20 / 15",
    },
    {
      value: "MAJOR" as Potency,
      label: "Major",
      description: "55 / 45 / 35",
    },
    {
      value: "EXTREME" as Potency,
      label: "Extreme",
      description: "120 / 100 / 80",
    },
  ];

  const baseCost = potencyCosts[potency][mastery] ?? 0;
  const finalCost = targetNecroForce ? baseCost * 2 : baseCost;

  useEffect(() => {
    if (!active) {
      setPotency("MINOR");
      setTargetNecroForce(false);
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", finalCost);
  }, [active, finalCost, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* Spell Title */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Draw Life Death</h1>
      </div>

      {/* Potency */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={potency}
          setSelectedPotency={setPotency}
        />
      </div>

      {/* Damage */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 text-xl font-bold text-cyan-400">Damage</h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-4">
          <p className="text-sm text-gray-400">
            Damage is randomly determined within the selected potency range.
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {damageRanges[potency]}
          </p>
        </div>
      </div>

      {/* Targeting */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 text-xl font-bold text-cyan-400">Targeting</h2>

        <label className="flex cursor-pointer items-center justify-between rounded border border-gray-700 bg-gray-900 p-4 transition hover:border-gray-500">
          <div>
            <p className="font-semibold text-gray-200">Necro-Force</p>
            <p className="mt-1 text-sm text-gray-400">
              Targets Necro-Force and doubles the Manna cost.
            </p>
          </div>

          <input
            type="checkbox"
            checked={targetNecroForce}
            onChange={(e) => setTargetNecroForce(e.target.checked)}
            className="h-5 w-5 accent-cyan-500"
          />
        </label>
      </div>

      {/* Spell Statistics */}
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 text-xl font-bold text-orange-400">
          Spell Statistics
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Cost</p>
            <p className="text-xl font-bold text-white">{finalCost}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Damage</p>
            <p className="text-xl font-bold text-white">
              {damageRanges[potency]}
            </p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Potency</p>
            <p className="text-xl font-bold text-white">{potency}</p>
          </div>

          <div className="rounded border border-gray-700 bg-gray-900 p-3">
            <p className="text-sm text-gray-400">Target</p>
            <p className="text-xl font-bold text-white">
              {targetNecroForce ? "Necro-Force" : "Normal"}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 text-xl font-bold text-orange-400">Secondary</h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-4">
          <p className="text-sm font-semibold text-gray-300">NECRO DAMAGE</p>
          <p className="text-sm text-gray-400">RANGE - DIRECT</p>
          <p className="text-sm text-gray-400">AOE - None</p>
        </div>
      </div>
    </div>
  );
};

export default DrawLifeDeath;
