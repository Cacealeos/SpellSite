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
  // ==================================================
  // State
  // ==================================================

  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);
  const [aoe, setAoe] = useState(1);

  const [spellRecovery, setSpellRecovery] = useState(false);
  const [counterSpell, setCounterSpell] = useState(false);
  const [spellSurge, setSpellSurge] = useState(false);
  const [doublePulse, setDoublePulse] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Mastery / Rates
  // ==================================================

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

  // ==================================================
  // Spell Statistics
  // ==================================================

  const masteryType = ParentMastery.getType();
  const powerRate = getPowerRate(masteryType);
  const aoeCost = getAoeCost(masteryType, aoe);

  const powerCost = power * powerRate;
  const baseCost = aoeCost + powerCost + damage;

  // Hyper Spell reduces the final Manna cost by 33%.
  const finalCost = hyperSpell ? Math.ceil(baseCost * 0.67) : baseCost;

  const maxDamage = power * 15 + 5;

  const aoeLabel = aoe === 1 ? "Small" : aoe === 2 ? "Moderate" : "Large";

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (active) return;

    setPower(0);
    setDamage(0);
    setAoe(1);

    setSpellRecovery(false);
    setCounterSpell(false);
    setSpellSurge(false);
    setDoublePulse(false);
    setHyperSpell(false);

    updateSpell("cost", 0);
  }, [active, updateSpell]);

  // ==================================================
  // Power / Damage Validation
  // ==================================================

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

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) return;

    updateSpell("cost", finalCost);
    updateSpell("ttt", 0);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">Repulsion</h1>
      </div>

      {/* ================================================== */}
      {/* Power & Endurance */}
      {/* ================================================== */}

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

      {/* ================================================== */}
      {/* Damage */}
      {/* ================================================== */}

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

      {/* ================================================== */}
      {/* Area of Effect */}
      {/* ================================================== */}

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

      {/* ================================================== */}
      {/* Spell Statistics */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-orange-400">
            Spell Statistics
          </h2>

          <div className="flex flex-wrap gap-2">
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

        {/* Technique Effects */}

        <div className="space-y-3">
          {spellRecovery && (
            <p className="border-t border-gray-700 pt-3 text-sm text-green-300">
              Restores <span className="font-semibold">50%</span> of Manna used
              for the projection during the next Gather.
            </p>
          )}

          {counterSpell && (
            <p className="border-t border-gray-700 pt-3 text-sm text-red-300">
              Allows Repulsion spells to function as a{" "}
              <span className="font-semibold">DEFENSIVE MEASURE</span>.
            </p>
          )}

          {spellSurge && (
            <p className="border-t border-gray-700 pt-3 text-sm text-cyan-300">
              Produces another copy of the Repulsion spell pending a successful{" "}
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
              Grants Repulsion prolonged activation in the form of a{" "}
              <span className="font-semibold">SECOND ACTION</span> and reduces
              its cost by <span className="font-semibold">33%</span>.
            </p>
          )}
        </div>

        {/* Statistics */}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
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

      {/* ================================================== */}
      {/* Secondary */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-bold text-orange-400">Secondary</h2>

        <div className="rounded border border-gray-700 bg-gray-900 p-3">
          <p className="text-sm font-semibold text-gray-300">KINETIC DAMAGE</p>
          <p className="text-sm text-gray-400">RANGE - RADIAL</p>
          <p className="text-sm text-gray-400">AOE - {aoeLabel}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectionsRepulsion;
