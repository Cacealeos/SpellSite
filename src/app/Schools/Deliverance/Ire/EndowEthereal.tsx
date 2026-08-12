import React, { useState, useEffect } from "react";
import { Mastery, Spell } from "@/app/models";

const EndowEthereal = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ==================================================
  // Constants
  // ==================================================

  const POWER_BIAS = 3; // Minimum starting power
  const ALLOCATION_BIAS = 3; // Maximum remainder allowed by validation

  // ==================================================
  // Allocation Validation
  // ==================================================

  function validateAllocation(value: number, otherValues: number[]) {
    return otherValues.every((other) => {
      if (other === 0) return true;

      return value % other <= ALLOCATION_BIAS;
    });
  }

  // ==================================================
  // State
  // ==================================================

  const [base, setBase] = useState(0);
  const [power, setPower] = useState(POWER_BIAS);
  const [pScale, setPScale] = useState(0);
  const [nScale, setNScale] = useState(0);
  const [reduction, setReduction] = useState(0);

  const [attunement, setAttunement] = useState(0);
  const [favor, setFavor] = useState(0);
  const [wisdom, setWisdom] = useState(0);
  const [esteem, setEsteem] = useState(0);
  const [bonus, setBonus] = useState(0);

  // ==================================================
  // Mastery Rates
  // ==================================================

  const masteryRates: Record<
    "NOVICE" | "INTERMEDIATE" | "MASTERED",
    {
      baseCost: number;
      reduction: number;
    }
  > = {
    NOVICE: {
      baseCost: 10,
      reduction: 1,
    },
    INTERMEDIATE: {
      baseCost: 15,
      reduction: 3,
    },
    MASTERED: {
      baseCost: 20,
      reduction: 5,
    },
  };

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const baseRate = masteryRates[mastery].baseCost;
  const costReductionRate = masteryRates[mastery].reduction;

  // ==================================================
  // Resource Allocation
  // ==================================================

  const totalAllocation = attunement + favor + wisdom + esteem + bonus;

  // ==================================================
  // Modifier Allocation
  // ==================================================

  const baseAllocation = base / baseRate;

  const powerAllocation = (power - POWER_BIAS) * 2;

  const positiveScalingAllocation = pScale / 5;

  const negativeScalingAllocation = nScale / 5;

  const reductionAllocation = reduction / costReductionRate;

  // ==================================================
  // Used Allocation
  // ==================================================

  const usedTotal =
    baseAllocation +
    powerAllocation +
    positiveScalingAllocation +
    negativeScalingAllocation +
    reductionAllocation;

  const remainingAllocation = totalAllocation - usedTotal;

  // ==================================================
  // Total Allocation Validation
  // ==================================================

  function canFitTotalAllocation(
    newAllocation: number,
    currentAllocation: number,
  ) {
    return usedTotal - currentAllocation + newAllocation <= totalAllocation;
  }

  // ==================================================
  // Modifier Bias Validation
  // ==================================================

  function validateModifierAllocation(
    value: number,
    otherAllocations: number[],
  ) {
    return otherAllocations.every(
      (other) => Math.abs(value - other) <= ALLOCATION_BIAS,
    );
  }
  // ==================================================
  // Spell Cost
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    const finalCost = Math.max(0, Math.floor(base * (1 - reduction / 100)));

    updateSpell("cost", finalCost);
  }, [active, base, reduction, updateSpell]);

  // ==================================================
  // Reset Modifiers When Mastery Changes
  // ==================================================

  useEffect(() => {
    setBase(0);
    setPower(POWER_BIAS);
    setPScale(0);
    setNScale(0);
    setReduction(0);
  }, [mastery]);

  // ==================================================
  // Change Handlers
  // ==================================================
  function changeBase(value: number) {
    const newAllocation = value / baseRate;

    if (
      !validateModifierAllocation(newAllocation, [
        powerAllocation,
        positiveScalingAllocation,
        negativeScalingAllocation,
      ])
    ) {
      return;
    }

    if (canFitTotalAllocation(newAllocation, baseAllocation)) {
      setBase(value);
    }
  }

  function changePower(value: number) {
    const newAllocation = (value - POWER_BIAS) * 2;

    if (
      !validateModifierAllocation(newAllocation, [
        baseAllocation,
        positiveScalingAllocation,
        negativeScalingAllocation,
      ])
    ) {
      return;
    }

    if (canFitTotalAllocation(newAllocation, powerAllocation)) {
      setPower(value);
    }
  }

  function changePScaling(value: number) {
    const newAllocation = value / 5;

    if (
      !validateModifierAllocation(newAllocation, [
        baseAllocation,
        powerAllocation,
        negativeScalingAllocation,
      ])
    ) {
      return;
    }

    if (canFitTotalAllocation(newAllocation, positiveScalingAllocation)) {
      setPScale(value);
    }
  }

  function changeNScaling(value: number) {
    const newAllocation = value / 5;

    if (
      !validateModifierAllocation(newAllocation, [
        baseAllocation,
        powerAllocation,
        positiveScalingAllocation,
      ])
    ) {
      return;
    }

    if (canFitTotalAllocation(newAllocation, negativeScalingAllocation)) {
      setNScale(value);
    }
  }

  function changeReduction(value: number) {
    if (value < 0 || value > 100) return;

    // Reduction is allocated according to mastery:
    // 1% / 3% / 5% per allocation.
    if (value % costReductionRate !== 0) return;

    const newAllocation = value / costReductionRate;
    const currentAllocation = reduction / costReductionRate;

    if (
      !validateAllocation(newAllocation, [
        base / baseRate,
        (power - POWER_BIAS) * 2,
        pScale / 5,
        nScale / 5,
      ])
    ) {
      return;
    }

    if (!canFitTotalAllocation(newAllocation, currentAllocation)) {
      return;
    }

    setReduction(value);
  }

  return (
    <>
      {/* ==================================================
    Total Allocation
    ================================================== */}

      {/* Allocation Budget */}
      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Allocation Budget
        </h3>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Available Allocation</span>

            <span className="font-semibold text-cyan-400">
              {totalAllocation}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Used Allocation</span>

            <span className="font-semibold text-cyan-400">{usedTotal}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Remaining Allocation</span>

            <span
              className={`font-semibold ${
                remainingAllocation < 0 ? "text-red-400" : "text-cyan-400"
              }`}
            >
              {remainingAllocation}
            </span>
          </div>
        </div>
      </div>

      {/* Resource Allocation */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Resource Allocation
        </h3>

        <div className="grid gap-4">
          <label>
            <span className="text-gray-300">Attunement</span>

            <input
              type="number"
              min={0}
              max={4}
              step={1}
              value={attunement}
              onChange={(e) =>
                setAttunement(Math.max(0, Number(e.target.value) || 0))
              }
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>

          <label>
            <span className="text-gray-300">Favor</span>

            <input
              type="number"
              min={0}
              max={20}
              step={4}
              value={favor}
              onChange={(e) =>
                setFavor(Math.max(0, Number(e.target.value) || 0))
              }
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>

          <label>
            <span className="text-gray-300">Wisdom</span>

            <input
              type="number"
              min={0}
              max={8}
              step={2}
              value={wisdom}
              onChange={(e) =>
                setWisdom(Math.max(0, Number(e.target.value) || 0))
              }
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>

          <label>
            <span className="text-gray-300">Esteem</span>

            <input
              type="number"
              min={0}
              max={4}
              step={1}
              value={esteem}
              onChange={(e) =>
                setEsteem(Math.max(0, Number(e.target.value) || 0))
              }
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>

          {/* Optional Bonus */}
          <label className="border-t border-gray-700 pt-4">
            <span className="text-gray-300">
              Bonus
              <span className="ml-2 text-sm text-gray-500">Optional</span>
            </span>

            <input
              type="number"
              min={0}
              step={1}
              value={bonus}
              onChange={(e) =>
                setBonus(Math.max(0, Number(e.target.value) || 0))
              }
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>
        </div>
      </div>

      {/* ==================================================
    Spell Modifiers
    ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Modifiers
        </h3>

        <div className="grid gap-4">
          {/* Base */}
          <label>
            <span className="text-gray-300">
              Base
              <span className="text-gray-400">
                {" "}
                ({baseRate} cost per point)
              </span>
            </span>

            <input
              type="number"
              min={0}
              step={baseRate}
              value={base}
              onChange={(e) => changeBase(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>

          {/* Power */}
          <label>
            <span className="text-gray-300">
              Power
              <span className="text-gray-400"> (minimum {POWER_BIAS})</span>
            </span>

            <input
              type="number"
              min={POWER_BIAS}
              step={1}
              value={power}
              onChange={(e) =>
                changePower(Number(e.target.value) || POWER_BIAS)
              }
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>

          {/* Cost Reduction */}
          <label>
            <span className="text-gray-300">
              Cost Reduction
              <span className="ml-2 text-gray-500">
                ({costReductionRate}% per point)
              </span>
            </span>

            <input
              type="number"
              min={0}
              step={costReductionRate}
              value={reduction}
              onChange={(e) => changeReduction(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>

          {/* Positive Scaling */}
          <label>
            <span className="text-gray-300">
              Positive Scaling
              <span className="ml-2 text-gray-500">(% of Base)</span>
            </span>

            <input
              type="number"
              min={0}
              max={100}
              step={5}
              value={pScale}
              onChange={(e) => changePScaling(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>

          {/* Negative Scaling */}
          <label>
            <span className="text-gray-300">
              Negative Scaling
              <span className="ml-2 text-gray-500">(% of Base)</span>
            </span>

            <input
              type="number"
              min={0}
              max={75}
              step={5}
              value={nScale}
              onChange={(e) => changeNScaling(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
            />
          </label>
        </div>
      </div>

      {/* ==================================================
    Final Spell Statistics
    ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h3>

        <div className="space-y-3 text-gray-300">
          {/* Spell Properties */}
          <div className="border-b border-gray-700 pb-3">
            <p className="font-semibold text-orange-400">Spell Properties</p>

            <div className="mt-2 space-y-1">
              <p>LARGE AOE - SELECTIVE</p>
              <p>KINETIC - DAMAGE</p>
              <p>RANGE - RADIAL</p>
            </div>
          </div>

          {/* Allocation */}
          <div className="flex justify-between">
            <span>Total Allocation</span>

            <span className="font-semibold text-cyan-400">
              {totalAllocation}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Used Allocation</span>

            <span className="font-semibold text-cyan-400">{usedTotal}</span>
          </div>

          {/* Spell Modifiers */}
          <div className="flex justify-between">
            <span>Base</span>

            <span className="font-semibold text-cyan-400">{base}</span>
          </div>

          <div className="flex justify-between">
            <span>Power</span>

            <span className="font-semibold text-cyan-400">{power}</span>
          </div>

          <div className="flex justify-between">
            <span>Positive Scaling</span>

            <span className="font-semibold text-cyan-400">
              +{((base * pScale) / 100).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Negative Scaling</span>

            <span className="font-semibold text-cyan-400">
              -{((base * nScale) / 100).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Cost Reduction</span>

            <span className="font-semibold text-cyan-400">{reduction}%</span>
          </div>

          {/* Final Cost */}
          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Final Cost</span>

            <span className="font-semibold text-cyan-400">
              {Math.max(0, Math.floor(base * (1 - reduction / 100)))}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default EndowEthereal;
