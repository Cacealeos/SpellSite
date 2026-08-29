import React, { useEffect, useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Spell } from "@/app/models";

const ImbueEnthalpy = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [size, setSize] = useState(1);
  const [baseCost, setBaseCost] = useState(0);
  const [ttt, setTtt] = useState(0);
  const [desc, setDesc] = useState("");

  const testMastery = new Mastery();

  const getRates = () => {
    if (ParentMastery.getType() === testMastery.novice(true)) {
      return {
        cost: 100,
        ttt: 16,
      };
    }

    if (ParentMastery.getType() === testMastery.intermediate(true)) {
      return {
        cost: 70,
        ttt: 12,
      };
    }

    if (ParentMastery.getType() === testMastery.mastered(true)) {
      return {
        cost: 40,
        ttt: 8,
      };
    }

    return {
      cost: 0,
      ttt: 0,
    };
  };

  // Reset the spell whenever it becomes inactive.
  useEffect(() => {
    if (!active) {
      setSize(1);
      setBaseCost(0);
      setTtt(0);
      setDesc("");
      updateSpell("cost", 0);
      updateSpell("ttt", 0);
    }
  }, [active, updateSpell]);

  // Recalculate Cost and TTT whenever mastery or size changes.
  useEffect(() => {
    if (!active) return;

    const rates = getRates();

    const calculatedCost = rates.cost;
    const calculatedTtt = rates.ttt * size;

    setBaseCost(calculatedCost);
    setTtt(calculatedTtt);

    updateSpell("cost", calculatedCost);
    updateSpell("ttt", calculatedTtt);
  }, [active, ParentMastery, size, updateSpell]);

  return (
    <div>
      <h1>Imbue Enthalpy</h1>

      <h3>RANGE - MISSILE</h3>

      <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-semibold text-cyan-400">Size</h2>

        <p className="mb-4 text-sm text-gray-400">TTT: 16 / 12 / 8</p>

        <div className="space-y-3">
          <label className="flex items-center justify-between rounded border border-gray-700 bg-gray-900 p-3">
            <span>Tiny × 1/2</span>
            <input
              type="radio"
              name="enthalpy-size"
              checked={size === 0.5}
              onChange={() => setSize(0.5)}
            />
          </label>

          <label className="flex items-center justify-between rounded border border-gray-700 bg-gray-900 p-3">
            <span>Sizeable × 1</span>
            <input
              type="radio"
              name="enthalpy-size"
              checked={size === 1}
              onChange={() => setSize(1)}
            />
          </label>

          <label className="flex items-center justify-between rounded border border-gray-700 bg-gray-900 p-3">
            <span>Enormous × 2</span>
            <input
              type="radio"
              name="enthalpy-size"
              checked={size === 2}
              onChange={() => setSize(2)}
            />
          </label>

          <label className="flex items-center justify-between rounded border border-gray-700 bg-gray-900 p-3">
            <span>Gargantuan × 4</span>
            <input
              type="radio"
              name="enthalpy-size"
              checked={size === 4}
              onChange={() => setSize(4)}
            />
          </label>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-semibold text-cyan-400">
          Description
        </h2>

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Optional description..."
          className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
        />
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-2 text-gray-300">
          <div className="flex justify-between">
            <span>Size</span>
            <span className="font-semibold text-cyan-400">×{size}</span>
          </div>

          <div className="flex justify-between">
            <span>Base Cost</span>
            <span className="font-semibold text-cyan-400">{baseCost}</span>
          </div>

          <div className="flex justify-between">
            <span>TTT</span>
            <span className="font-semibold text-cyan-400">{ttt}</span>
          </div>

          <div className="flex justify-between">
            <span>Range</span>
            <span className="font-semibold text-cyan-400">MISSILE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImbueEnthalpy;
