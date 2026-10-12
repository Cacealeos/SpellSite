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
  // ==================================================
  // State
  // ==================================================

  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);
  const [shape, setShape] = useState(1);

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  // Spell Techniques
  const [spellRecovery, setSpellRecovery] = useState(false);
  const [counterSpell, setCounterSpell] = useState(false);
  const [spellSurge, setSpellSurge] = useState(false);
  const [doublePulse, setDoublePulse] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Potency Options
  // ==================================================

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

  // ==================================================
  // Shape Cost
  // ==================================================

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

  // ==================================================
  // Shape Information
  // ==================================================

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

  // ==================================================
  // Potency
  // ==================================================

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

  // ==================================================
  // Base Spell Statistics
  // ==================================================

  const pot = getPotency();

  const baseShapeCost = getShapeCost(ParentMastery.getType(), pot.getType());

  const shapeCost = baseShapeCost * getShapeCostMultiplier();

  // Damage costs 2 Manna per point.
  const damageCost = damage * 2;

  const baseCost = Math.round(shapeCost + damageCost);

  // ==================================================
  // Final Spell Statistics
  // ==================================================

  // Hyper Spell reduces the Projection cost by 33%.
  // No other technique changes spell values.
  const finalCost = hyperSpell ? Math.ceil(baseCost * 0.67) : baseCost;

  const displayedDamage = damage * getDamageMultiplier();

  const maxDamage = power * 25;

  // ==================================================
  // Reset Local State
  // ==================================================

  // Reset local UI state whenever this spell is deselected.
  useEffect(() => {
    if (active) return;

    setPower(0);
    setDamage(0);
    setShape(1);
    setSelectedPotency("MINOR");

    setSpellRecovery(false);
    setCounterSpell(false);
    setSpellSurge(false);
    setDoublePulse(false);
    setHyperSpell(false);
  }, [active]);

  // ==================================================
  // Damage Validation
  // ==================================================

  // Keep Damage within the maximum allowed by Power.
  useEffect(() => {
    if (damage > maxDamage) {
      setDamage(maxDamage);
    }
  }, [power, damage, maxDamage]);

  // ==================================================
  // Update Parent Spell
  // ==================================================

  // Synchronize calculated spell values with the parent Spell object.
  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("potency", pot);
    updateSpell("cost", finalCost);

    // Projection does not intrinsically create TTT.
    updateSpell("ttt", 0);
  }, [
    active,
    selectedPotency,
    power,
    damage,
    shape,
    ParentMastery,
    updateSpell,
    finalCost,
    pot,
  ]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="space-y-6 rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Title */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-100">Projections</h1>
      </div>

      {/* ================================================== */}
      {/* Spell Information */}
      {/* ================================================== */}

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

      {/* ================================================== */}
      {/* Power */}
      {/* ================================================== */}

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

      {/* ================================================== */}
      {/* Damage */}
      {/* ================================================== */}

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

      {/* ================================================== */}
      {/* Potency */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md">
        <h2 className="mb-3 text-lg font-bold text-orange-400">Shape</h2>

        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* ================================================== */}
      {/* Size */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md">
        <h2 className="mb-3 text-lg font-bold text-orange-400">
          Size Multipliers
        </h2>

        <div className="space-y-3">
          {/* Tiny */}

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

          {/* Sizeable */}

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

          {/* Enormous */}

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

          {/* Gargantuan */}

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

      {/* ================================================== */}
      {/* Final Statistics */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-100">Final Statistics</h2>

          {/* ================================================== */}
          {/* Spell Techniques */}
          {/* ================================================== */}

          <div className="flex gap-2">
            {/* Spell Recovery */}

            <button
              type="button"
              onClick={() => setSpellRecovery((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                spellRecovery
                  ? "border-green-400 bg-green-500/10 text-green-300 shadow-[0_0_12px_rgba(74,222,128,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-green-500 hover:text-green-300"
              }`}
            >
              Spell Recovery
            </button>

            {/* Counter Spell */}

            <button
              type="button"
              onClick={() => setCounterSpell((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                counterSpell
                  ? "border-red-400 bg-red-500/10 text-red-300 shadow-[0_0_12px_rgba(248,113,113,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-red-500 hover:text-red-300"
              }`}
            >
              Counter Spell
            </button>

            {/* Spell Surge */}

            <button
              type="button"
              onClick={() => setSpellSurge((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                spellSurge
                  ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-cyan-500 hover:text-cyan-300"
              }`}
            >
              Spell Surge
            </button>

            {/* Double Pulse */}

            <button
              type="button"
              onClick={() => setDoublePulse((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                doublePulse
                  ? "border-yellow-400 bg-yellow-500/10 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-yellow-500 hover:text-yellow-300"
              }`}
            >
              Double Pulse
            </button>

            {/* Hyper Spell */}

            <button
              type="button"
              onClick={() => setHyperSpell((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                hyperSpell
                  ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-500 hover:text-purple-300"
              }`}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* Technique Effects */}
        {/* ================================================== */}

        <div className="mb-4 space-y-2">
          {spellRecovery && (
            <p className="border-t border-gray-700 pt-3 text-sm text-green-300">
              Restores <span className="font-semibold">50%</span> of Manna used
              for projection during the next Gather.
            </p>
          )}

          {counterSpell && (
            <p className="border-t border-gray-700 pt-3 text-sm text-red-300">
              Allows Projection spells to function as a{" "}
              <span className="font-semibold">DEFENSIVE MEASURE</span>.
            </p>
          )}

          {spellSurge && (
            <p className="border-t border-gray-700 pt-3 text-sm text-cyan-300">
              Produces another copy of the Projection spell pending a successful{" "}
              <span className="font-semibold">
                INTELLIGENCE OR DISCIPLINE CHECK
              </span>{" "}
              tied to the strength of the projection determined by GMD.
            </p>
          )}

          {doublePulse && (
            <p className="border-t border-gray-700 pt-3 text-sm text-yellow-300">
              Produces a second explosive effect from the repulsion and a{" "}
              <span className="font-semibold">33% CHANCE</span> to spawn another
              Projection copy.
            </p>
          )}

          {hyperSpell && (
            <p className="border-t border-gray-700 pt-3 text-sm text-purple-300">
              Grants Projections prolonged activation in the form of a{" "}
              <span className="font-semibold">SECOND ACTION</span> and reduces
              their cost by <span className="font-semibold">33%</span>.
            </p>
          )}
        </div>

        {/* ================================================== */}
        {/* Statistics */}
        {/* ================================================== */}

        <div className="space-y-3">
          {/* Power */}

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Power</span>

            <span className="font-semibold text-white">{power}</span>
          </div>

          {/* Damage */}

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Damage</span>

            <span className="font-semibold text-white">{displayedDamage}</span>
          </div>

          {/* Size */}

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Size</span>

            <span className="font-semibold text-cyan-400">
              {getShapeName()}
            </span>
          </div>

          {/* Shape Cost */}

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Shape Cost</span>

            <span className="font-semibold text-white">
              {Math.round(
                getShapeCost(ParentMastery.getType(), pot.getType()) *
                  getShapeCostMultiplier(),
              )}
            </span>
          </div>

          {/* Cost */}

          <div className="flex items-center justify-between border-t border-gray-700 pt-3">
            <span className="text-lg font-semibold text-gray-300">Cost</span>

            <span className="text-2xl font-bold text-orange-400">
              {finalCost}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projections;
