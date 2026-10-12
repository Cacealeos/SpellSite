import React, { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

const Fields = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [power, setPower] = useState(0);
  const [vitality, setVitality] = useState(0);
  const [size, setSize] = useState(2);

  const [hyperSpell, setHyperSpell] = useState(false);
  const [counterSpell, setCounterSpell] = useState(false);
  const [spellSurge, setSpellSurge] = useState(false);

  const testMastery = new Mastery();

  let powerRate = 0;
  let vitalityRate = 0;
  let aoeTTT = 0;

  if (ParentMastery.getType() === testMastery.novice(true)) {
    powerRate = 5;
    vitalityRate = 1;
  } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
    powerRate = 4;
    vitalityRate = 0.5;
  } else if (ParentMastery.getType() === testMastery.mastered(true)) {
    powerRate = 3;
    vitalityRate = 0.25;
  }

  if (size === 1) {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      aoeTTT = 6;
    } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
      aoeTTT = 4;
    } else if (ParentMastery.getType() === testMastery.mastered(true)) {
      aoeTTT = 2;
    }
  } else if (size === 2) {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      aoeTTT = 12;
    } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
      aoeTTT = 10;
    } else if (ParentMastery.getType() === testMastery.mastered(true)) {
      aoeTTT = 8;
    }
  } else if (size === 3) {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      aoeTTT = 18;
    } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
      aoeTTT = 16;
    } else if (ParentMastery.getType() === testMastery.mastered(true)) {
      aoeTTT = 14;
    }
  }

  // ==================================================
  // Base Spell Statistics
  // ==================================================

  const baseCost = Math.round(
    power * 10 + Math.max(0, vitality - power * 10) * vitalityRate,
  );

  const baseTTT = power * powerRate + aoeTTT;

  // ==================================================
  // Final Spell Statistics
  // ==================================================

  const surgeCost = Math.ceil(baseCost * 0.8);

  const finalTTT = hyperSpell ? Math.ceil(baseTTT * 0.5) : baseTTT;

  const finalCost = baseCost;

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) {
      setPower(0);
      setVitality(0);
      setSize(2);
      setHyperSpell(false);
      setCounterSpell(false);
      setSpellSurge(false);

      updateSpell("cost", 0);
      updateSpell("ttt", 0);

      return;
    }

    updateSpell("cost", finalCost);
    updateSpell("ttt", finalTTT);
  }, [active, finalCost, finalTTT, updateSpell]);

  // ==================================================
  // Power / Vitality
  // ==================================================

  const handlePowerChange = (value: number) => {
    const newPower = Math.max(0, Math.min(3, value));

    setPower(newPower);

    const minimumVitality = newPower * 10;

    setVitality((currentVitality) =>
      Math.max(currentVitality, minimumVitality),
    );
  };

  const handleVitalityChange = (value: number) => {
    const minimumVitality = power * 10;

    setVitality(Math.max(minimumVitality, value));
  };

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Title */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h1 className="mb-3 text-2xl font-bold text-orange-400">Fields</h1>

        {/* ================================================== */}
        {/* Power & Endurance */}
        {/* ================================================== */}

        <div className="rounded-md border border-gray-700 bg-gray-900/70 p-4">
          <h2 className="mb-1 text-lg font-semibold text-gray-200">
            Power & Endurance
          </h2>

          <p className="mb-3 text-sm text-gray-400">
            Manna to Power & Endurance
          </p>

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

          <p className="mt-2 text-xs text-gray-500">
            Power/Endurance contributes to TTT at {powerRate} TTT per Manna.
          </p>
        </div>

        {/* ================================================== */}
        {/* Vitality */}
        {/* ================================================== */}

        <div className="mt-4 rounded-md border border-gray-700 bg-gray-900/70 p-4">
          <h2 className="mb-1 text-lg font-semibold text-gray-200">Vitality</h2>

          <p className="mb-3 text-sm text-gray-400">Manna to Vitality</p>

          <input
            type="number"
            min={power * 10}
            step="1"
            value={vitality}
            onChange={(e) => handleVitalityChange(Number(e.target.value))}
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

          <p className="mt-2 text-xs text-gray-500">
            Base Vitality: {power * 10}. Additional Vitality increases Manna
            cost at {vitalityRate} per point. Vitality does not contribute to
            TTT.
          </p>
        </div>
      </div>

      {/* ================================================== */}
      {/* Range */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-xl font-bold text-orange-400">Range</h2>

        <div className="space-y-3">
          <label className="flex items-center gap-3 rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <input
              type="radio"
              name="fields-size"
              checked={size === 1}
              onChange={() => setSize(1)}
              className="h-4 w-4 accent-cyan-500"
            />

            <span className="text-gray-200">Small AOE</span>

            <span className="ml-auto text-sm text-gray-400">
              {ParentMastery.getType() === testMastery.novice(true)
                ? "6 TTT"
                : ParentMastery.getType() === testMastery.intermediate(true)
                  ? "4 TTT"
                  : "2 TTT"}
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <input
              type="radio"
              name="fields-size"
              checked={size === 2}
              onChange={() => setSize(2)}
              className="h-4 w-4 accent-cyan-500"
            />

            <span className="text-gray-200">Moderate AOE</span>

            <span className="ml-auto text-sm text-gray-400">
              {ParentMastery.getType() === testMastery.novice(true)
                ? "12 TTT"
                : ParentMastery.getType() === testMastery.intermediate(true)
                  ? "10 TTT"
                  : "8 TTT"}
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <input
              type="radio"
              name="fields-size"
              checked={size === 3}
              onChange={() => setSize(3)}
              className="h-4 w-4 accent-cyan-500"
            />

            <span className="text-gray-200">Large AOE</span>

            <span className="ml-auto text-sm text-gray-400">
              {ParentMastery.getType() === testMastery.novice(true)
                ? "18 TTT"
                : ParentMastery.getType() === testMastery.intermediate(true)
                  ? "16 TTT"
                  : "14 TTT"}
            </span>
          </label>
        </div>
      </div>

      {/* ================================================== */}
      {/* Final Stats */}
      {/* ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-orange-400">Final Stats</h2>

          {/* ================================================== */}
          {/* Spell Techniques */}
          {/* ================================================== */}

          <div className="flex gap-2">
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
          {counterSpell && (
            <p className="border-t border-gray-700 pt-3 text-sm text-red-300">
              Allows the spell to be used as a{" "}
              <span className="font-semibold">DEFENSIVE MEASURE</span>.
            </p>
          )}

          {spellSurge && (
            <p className="border-t border-gray-700 pt-3 text-sm text-cyan-300">
              Reduces the cost by 20% per additional cast.{" "}
              <span className="font-semibold">
                ({Math.ceil(baseCost * 0.2)} Manna)
              </span>
            </p>
          )}

          {hyperSpell && (
            <p className="border-t border-gray-700 pt-3 text-sm text-purple-300">
              Reduces TTT by 50%. When cast for free, Range can increase by{" "}
              <span className="font-semibold">ONE LEVEL</span>.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Cost */}

          <div className="rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Cost
            </p>

            <p className="text-xl font-bold text-orange-400">{finalCost}</p>
          </div>

          {/* TTT */}

          <div className="rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">TTT</p>

            <p className="text-xl font-bold text-cyan-400">{finalTTT}</p>
          </div>
        </div>

        {/* Vitality */}

        <div className="mt-3 rounded-md border border-gray-700 bg-gray-900/70 p-3">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Vitality
          </p>

          <p className="text-xl font-bold text-green-400">{vitality}</p>
        </div>
      </div>
    </div>
  );
};

export default Fields;
