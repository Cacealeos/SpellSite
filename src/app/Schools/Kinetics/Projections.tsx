import React, { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type ProjectionsProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const Projections = ({
  ParentMastery,
  active,
  updateSpell,
}: ProjectionsProps) => {
  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);
  const [shape, setShape] = useState(1);
  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "15 / 10 / 5",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "30 / 25 / 20",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "45 / 40 / 35",
    },
  ];

  const getShapeCost = (masteryType: string, potencyType: string): number => {
    switch (masteryType) {
      case "NOVICE":
        if (potencyType === "MINOR") return 15;
        if (potencyType === "MAJOR") return 30;
        if (potencyType === "EXTREME") return 45;
        return 0;

      case "INTERMEDIATE":
        if (potencyType === "MINOR") return 10;
        if (potencyType === "MAJOR") return 25;
        if (potencyType === "EXTREME") return 40;
        return 0;

      case "MASTERED":
        if (potencyType === "MINOR") return 5;
        if (potencyType === "MAJOR") return 20;
        if (potencyType === "EXTREME") return 35;
        return 0;

      default:
        return 0;
    }
  };

  const getShapeName = (): string => {
    switch (shape) {
      case 0.5:
        return "Tiny";

      case 1:
        return "Sizeable";

      case 1.5:
        return "Enormous";

      case 2:
        return "Gargantuan";

      default:
        return "Sizeable";
    }
  };

  const getShapeCostMultiplier = (): number => {
    switch (shape) {
      case 0.5:
        return 0.5;

      case 1:
        return 1;

      case 1.5:
        return 2;

      case 2:
        return 4;

      default:
        return 1;
    }
  };

  const getDamageMultiplier = (): number => {
    switch (shape) {
      case 0.5:
        return 0.5;

      case 1:
        return 1;

      case 1.5:
        return 1.5;

      case 2:
        return 2;

      default:
        return 1;
    }
  };

  const getPotency = (): Potency => {
    const pot = new Potency();

    switch (selectedPotency) {
      case "MINOR":
        pot.minor();
        break;

      case "MAJOR":
        pot.major();
        break;

      case "EXTREME":
        pot.extreme();
        break;
    }

    return pot;
  };

  // Reset local UI state whenever this spell is deselected.
  useEffect(() => {
    if (active) return;

    setPower(0);
    setDamage(0);
    setShape(1);
    setSelectedPotency("MINOR");
  }, [active]);

  // Keep Damage within the maximum allowed by Power.
  useEffect(() => {
    const maxDamage = power * 25;

    if (damage > maxDamage) {
      setDamage(maxDamage);
    }
  }, [power, damage]);

  // Synchronize calculated spell values with the parent Spell object.
  useEffect(() => {
    if (!active) return;

    const pot = getPotency();

    const baseShapeCost = getShapeCost(ParentMastery.getType(), pot.getType());

    const shapeCost = baseShapeCost * getShapeCostMultiplier();

    // Damage costs 2 Manna per point.
    const damageCost = damage * 2;

    const finalCost = Math.round(shapeCost + damageCost);

    updateSpell("potency", pot);
    updateSpell("cost", finalCost);

    // This spell does not intrinsically create TTT.
    updateSpell("ttt", 0);
  }, [
    active,
    selectedPotency,
    power,
    damage,
    shape,
    ParentMastery,
    updateSpell,
  ]);

  const displayedDamage = damage * getDamageMultiplier();

  const maxDamage = power * 25;

  return (
    <div className="space-y-6 rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* Title */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-100">Projections</h1>
      </div>

      {/* Spell Information */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-center shadow-md">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold tracking-wide text-cyan-400">
            KINETIC DAMAGE
          </h3>

          <h3 className="text-sm font-semibold tracking-wide text-cyan-400">
            RANGE - MISSILE / MELEE
          </h3>

          <p className="text-sm text-gray-400">Power, Endurance & Damage</p>
        </div>
      </div>

      {/* Power */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Manna to Power & Endurance
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
          max={maxDamage}
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
          Maximum Damage: {maxDamage}
        </p>

        <p className="text-sm text-gray-400">
          Each point of damage adds 2 Manna to the final cost.
        </p>
      </div>

      {/* Potency */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md">
        <h2 className="mb-3 text-lg font-bold text-orange-400">Shape</h2>

        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* Size */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Size Multipliers
        </h2>

        <div className="space-y-3">
          <label className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-3 py-2">
            <span className="text-gray-300">
              Tiny — Shape Cost × 1/2 | Damage × 1/2
            </span>

            <input
              type="radio"
              name="projections-shape"
              checked={shape === 0.5}
              onChange={() => setShape(0.5)}
              className="h-4 w-4 cursor-pointer accent-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-3 py-2">
            <span className="text-gray-300">
              Sizeable — Shape Cost × 1 | Damage × 1
            </span>

            <input
              type="radio"
              name="projections-shape"
              checked={shape === 1}
              onChange={() => setShape(1)}
              className="h-4 w-4 cursor-pointer accent-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-3 py-2">
            <span className="text-gray-300">
              Enormous — Shape Cost × 2 | Damage × 1.5
            </span>

            <input
              type="radio"
              name="projections-shape"
              checked={shape === 1.5}
              onChange={() => setShape(1.5)}
              className="h-4 w-4 cursor-pointer accent-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-3 py-2">
            <span className="text-gray-300">
              Gargantuan — Shape Cost × 4 | Damage × 2
            </span>

            <input
              type="radio"
              name="projections-shape"
              checked={shape === 2}
              onChange={() => setShape(2)}
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

            <span className="font-semibold text-white">{displayedDamage}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Size</span>

            <span className="font-semibold text-cyan-400">
              {getShapeName()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Shape Cost</span>

            <span className="font-semibold text-white">
              {Math.round(
                getShapeCost(ParentMastery.getType(), getPotency().getType()) *
                  getShapeCostMultiplier(),
              )}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-700 pt-3">
            <span className="text-lg font-semibold text-gray-300">Cost</span>

            <span className="text-2xl font-bold text-orange-400">
              {Math.round(
                getShapeCost(ParentMastery.getType(), getPotency().getType()) *
                  getShapeCostMultiplier() +
                  damage * 2,
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projections;
