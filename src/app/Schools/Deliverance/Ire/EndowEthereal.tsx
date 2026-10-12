import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type EndowEtherealProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Carry Spell": true,
  "Spell Shift": true,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Constants
// ==================================================

const POWER_BIAS = 3;
const ALLOCATION_BIAS = 3;
const MAX_CHARGE = 5;

// ==================================================
// Mastery Rates
// ==================================================

const masteryRates: Record<
  MasteryType,
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

// ==================================================
// Input Styling
// ==================================================

const inputClass =
  "mt-1 w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50";

// ==================================================
// Component
// ==================================================

const EndowEthereal = ({
  ParentMastery,
  active,
  updateSpell,
}: EndowEtherealProps) => {
  // ==================================================
  // State - Spell Modifiers
  // ==================================================

  const [base, setBase] = useState(0);
  const [power, setPower] = useState(POWER_BIAS);
  const [pScale, setPScale] = useState(0);
  const [nScale, setNScale] = useState(0);
  const [reduction, setReduction] = useState(0);

  // ==================================================
  // State - Resource Allocation
  // ==================================================

  const [attunement, setAttunement] = useState(0);
  const [favor, setFavor] = useState(0);
  const [wisdom, setWisdom] = useState(0);
  const [esteem, setEsteem] = useState(0);
  const [bonus, setBonus] = useState(0);

  // ==================================================
  // State - Spell Techniques
  // ==================================================

  const [spellCharge, setSpellCharge] = useState(false);
  const [chargeTurns, setChargeTurns] = useState(1);

  // ==================================================
  // Mastery Calculations
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

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
  // Spell Charge Calculations
  // ==================================================

  const chargedAOE =
    chargeTurns >= 5 ? "Large" : chargeTurns >= 3 ? "Moderate" : "Small";

  const finalAOE = spellCharge ? chargedAOE : "None";

  // ==================================================
  // Spell Cost
  // ==================================================

  const finalCost = Math.max(0, Math.floor(base * (1 - reduction / 100)));

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
  // Change Handlers - Base
  // ==================================================

  function changeBase(value: number) {
    if (value < 0 || value % baseRate !== 0) return;

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

  // ==================================================
  // Change Handlers - Power
  // ==================================================

  function changePower(value: number) {
    if (value < POWER_BIAS) return;

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

  // ==================================================
  // Change Handlers - Positive Scaling
  // ==================================================

  function changePScaling(value: number) {
    if (value < 0 || value > 100 || value % 5 !== 0) {
      return;
    }

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

  // ==================================================
  // Change Handlers - Negative Scaling
  // ==================================================

  function changeNScaling(value: number) {
    if (value < 0 || value > 75 || value % 5 !== 0) {
      return;
    }

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

  // ==================================================
  // Change Handlers - Cost Reduction
  // ==================================================

  function changeReduction(value: number) {
    if (value < 0 || value > 100) return;

    if (value % costReductionRate !== 0) return;

    const newAllocation = value / costReductionRate;

    const currentAllocation = reduction / costReductionRate;

    if (
      !validateAllocation(newAllocation, [
        baseAllocation,
        powerAllocation,
        positiveScalingAllocation,
        negativeScalingAllocation,
      ])
    ) {
      return;
    }

    if (!canFitTotalAllocation(newAllocation, currentAllocation)) {
      return;
    }

    setReduction(value);
  }

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
  // Reset Spell Techniques When Inactive
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSpellCharge(false);
      setChargeTurns(1);
    }
  }, [active]);

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", finalCost);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  if (!active) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <SparklesIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Endow Ethereal</h1>
      </div>

      {/* ================================================== */}
      {/* Spell Techniques Table */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* Spell Properties */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        {/* ================================================== */}
        {/* Spell Properties Header */}
        {/* ================================================== */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-3">
          <h2 className="text-lg font-semibold text-cyan-400">
            Spell Properties
          </h2>

          <button
            type="button"
            onClick={() => setSpellCharge((prev) => !prev)}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
              spellCharge
                ? "border-yellow-400 bg-yellow-500/10 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.5)]"
                : "border-gray-600 bg-gray-900 text-gray-400 hover:border-yellow-500 hover:text-yellow-300"
            }`}
          >
            Spell Charge
          </button>
        </div>

        {/* ================================================== */}
        {/* Spell Charge Description */}
        {/* ================================================== */}

        {spellCharge && (
          <div className="mb-5 rounded-md border border-yellow-500/30 bg-yellow-500/5 p-4">
            <p className="text-sm text-yellow-200">
              <span className="font-semibold">Spell Charge:</span> Endow
              Ethereal receives Small AOE after 1 turn of charge, Moderate AOE
              after 3 turns, and Large AOE after 5 turns.
            </p>

            {/* ================================================== */}
            {/* Charge Counter */}
            {/* ================================================== */}

            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-yellow-300">
                Charge Turns
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setChargeTurns((prev) => Math.max(1, prev - 1))
                  }
                  disabled={chargeTurns <= 1}
                  className="rounded-md border border-gray-600 bg-gray-900 px-4 py-2 font-bold text-yellow-300 transition hover:border-yellow-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  -
                </button>

                <span className="min-w-10 text-center text-lg font-bold text-yellow-300">
                  {chargeTurns}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setChargeTurns((prev) => Math.min(MAX_CHARGE, prev + 1))
                  }
                  disabled={chargeTurns >= MAX_CHARGE}
                  className="rounded-md border border-gray-600 bg-gray-900 px-4 py-2 font-bold text-yellow-300 transition hover:border-yellow-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>

                <div className="flex justify-between">
                  <span>AOE</span>
                  <span className="font-semibold text-orange-400">
                    {finalAOE === "None" ? "None" : `${finalAOE} - Selective`}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-400">
                Maximum charge: {MAX_CHARGE} turns. Charging does not modify
                Manna cost.
              </p>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* Base Spell Properties */}
        {/* ================================================== */}

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Damage Type</span>
            <span className="font-semibold text-orange-400">Kinetic</span>
          </div>

          <div className="flex justify-between">
            <span>Range</span>
            <span className="font-semibold text-orange-400">Radial</span>
          </div>

          <div className="flex justify-between">
            <span>AOE</span>
            <span className="font-semibold text-orange-400">
              {finalAOE === "None" ? "None" : `${finalAOE} - Selective`}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Allocation Budget */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Allocation Budget
        </h2>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Available Allocation</span>
            <span className="font-semibold text-orange-400">
              {totalAllocation}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Used Allocation</span>
            <span className="font-semibold text-orange-400">{usedTotal}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Remaining Allocation</span>
            <span
              className={`font-semibold ${
                remainingAllocation < 0 ? "text-red-400" : "text-orange-400"
              }`}
            >
              {remainingAllocation}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Resource Allocation */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h2 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Resource Allocation
        </h2>

        <div className="grid gap-4">
          {/* ================================================== */}
          {/* Attunement */}
          {/* ================================================== */}

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
              className={inputClass}
            />
          </label>

          {/* ================================================== */}
          {/* Favor */}
          {/* ================================================== */}

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
              className={inputClass}
            />
          </label>

          {/* ================================================== */}
          {/* Wisdom */}
          {/* ================================================== */}

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
              className={inputClass}
            />
          </label>

          {/* ================================================== */}
          {/* Esteem */}
          {/* ================================================== */}

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
              className={inputClass}
            />
          </label>

          {/* ================================================== */}
          {/* Optional Bonus */}
          {/* ================================================== */}

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
              className={inputClass}
            />
          </label>
        </div>
      </div>

      {/* ================================================== */}
      {/* Spell Modifiers */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h2 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Spell Modifiers
        </h2>

        <div className="grid gap-4">
          {/* ================================================== */}
          {/* Base */}
          {/* ================================================== */}

          <label>
            <span className="text-gray-300">
              Base
              <span className="ml-2 text-gray-400">
                ({baseRate} cost per point)
              </span>
            </span>

            <input
              type="number"
              min={0}
              step={baseRate}
              value={base}
              onChange={(e) => changeBase(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>

          {/* ================================================== */}
          {/* Power */}
          {/* ================================================== */}

          <label>
            <span className="text-gray-300">
              Power
              <span className="ml-2 text-gray-400">(minimum {POWER_BIAS})</span>
            </span>

            <input
              type="number"
              min={POWER_BIAS}
              step={1}
              value={power}
              onChange={(e) =>
                changePower(Number(e.target.value) || POWER_BIAS)
              }
              className={inputClass}
            />
          </label>

          {/* ================================================== */}
          {/* Cost Reduction */}
          {/* ================================================== */}

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
              max={100}
              step={costReductionRate}
              value={reduction}
              onChange={(e) => changeReduction(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>

          {/* ================================================== */}
          {/* Positive Scaling */}
          {/* ================================================== */}

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
              onChange={(e) => changePScaling(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>

          {/* ================================================== */}
          {/* Negative Scaling */}
          {/* ================================================== */}

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
              onChange={(e) => changeNScaling(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>
        </div>
      </div>

      {/* ================================================== */}
      {/* Final Spell Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-3 text-gray-300">
          {/* ================================================== */}
          {/* Spell Properties */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Damage Type</span>
            <span className="font-semibold text-orange-400">Kinetic</span>
          </div>

          <div className="flex justify-between">
            <span>Range</span>
            <span className="font-semibold text-orange-400">Radial</span>
          </div>

          <div className="flex justify-between">
            <span>AOE</span>
            <span className="font-semibold text-orange-400">
              {finalAOE} - Selective
            </span>
          </div>

          {spellCharge && (
            <div className="flex justify-between">
              <span>Charge</span>
              <span className="font-semibold text-yellow-300">
                {chargeTurns} {chargeTurns === 1 ? "Turn" : "Turns"}
              </span>
            </div>
          )}

          {/* ================================================== */}
          {/* Allocation */}
          {/* ================================================== */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Total Allocation</span>
            <span className="font-semibold text-orange-400">
              {totalAllocation}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Used Allocation</span>
            <span className="font-semibold text-orange-400">{usedTotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Remaining Allocation</span>
            <span
              className={`font-semibold ${
                remainingAllocation < 0 ? "text-red-400" : "text-orange-400"
              }`}
            >
              {remainingAllocation}
            </span>
          </div>

          {/* ================================================== */}
          {/* Spell Modifiers */}
          {/* ================================================== */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Base</span>
            <span className="font-semibold text-orange-400">{base}</span>
          </div>

          <div className="flex justify-between">
            <span>Power</span>
            <span className="font-semibold text-orange-400">{power}</span>
          </div>

          <div className="flex justify-between">
            <span>Positive Scaling</span>
            <span className="font-semibold text-orange-400">
              +{((base * pScale) / 100).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Negative Scaling</span>
            <span className="font-semibold text-orange-400">
              -{((base * nScale) / 100).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Cost Reduction</span>
            <span className="font-semibold text-orange-400">{reduction}%</span>
          </div>

          {/* ================================================== */}
          {/* Final Manna Cost */}
          {/* ================================================== */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Manna</span>
            <span className="font-semibold text-orange-400">{finalCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndowEthereal;
