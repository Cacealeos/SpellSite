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

  useEffect(() => {
    if (!active) {
      setPower(0);
      setVitality(0);
      setSize(2);

      updateSpell("cost", 0);
      updateSpell("ttt", 0);

      return;
    }

    const powerTTT = power * powerRate;
    const totalTTT = powerTTT + aoeTTT;

    const baseVitality = power * 10;
    const additionalVitality = Math.max(0, vitality - baseVitality);

    const vitalityCost = additionalVitality * vitalityRate;

    const finalCost = Math.round(baseVitality + vitalityCost);

    updateSpell("cost", finalCost);
    updateSpell("ttt", totalTTT);
  }, [
    active,
    power,
    vitality,
    size,
    powerRate,
    vitalityRate,
    aoeTTT,
    updateSpell,
  ]);

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
      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h1 className="mb-3 text-2xl font-bold text-orange-400">Fields</h1>

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

      <div className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-xl font-bold text-orange-400">Final Stats</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Cost
            </p>
            <p className="text-xl font-bold text-orange-400">
              {Math.round(
                power * 10 + Math.max(0, vitality - power * 10) * vitalityRate,
              )}
            </p>
          </div>

          <div className="rounded-md border border-gray-700 bg-gray-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">TTT</p>
            <p className="text-xl font-bold text-cyan-400">
              {power * powerRate + aoeTTT}
            </p>
          </div>
        </div>

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
