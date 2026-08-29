import React, { useEffect, useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Spell } from "@/app/models";

const DrainAvatar = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [spirit, setSpirit] = useState(0);
  const [soul, setSoul] = useState(0);
  const [life, setLife] = useState(0);

  const testMastery = new Mastery();

  let spiritRate = 0;
  let soulRate = 0;
  let lifeRate = 0;

  if (ParentMastery.getType() === testMastery.novice(true)) {
    spiritRate = 5;
    soulRate = 10;
    lifeRate = 6;
  } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
    spiritRate = 4;
    soulRate = 8;
    lifeRate = 4;
  } else if (ParentMastery.getType() === testMastery.mastered(true)) {
    spiritRate = 3;
    soulRate = 6;
    lifeRate = 2;
  }

  // Reset the spell whenever it becomes inactive.
  useEffect(() => {
    if (!active) {
      setSpirit(0);
      setSoul(0);
      setLife(0);
      updateSpell("cost", 0);
    }
  }, [active, updateSpell]);

  // Recalculate the total Manna cost whenever the mastery
  // or any of the selected damage values changes.
  useEffect(() => {
    if (!active) return;

    const totalCost = spirit * spiritRate + soul * soulRate + life * lifeRate;

    updateSpell("cost", totalCost);
  }, [
    active,
    ParentMastery,
    spirit,
    soul,
    life,
    spiritRate,
    soulRate,
    lifeRate,
    updateSpell,
  ]);

  const totalCost = spirit * spiritRate + soul * soulRate + life * lifeRate;

  return (
    <div>
      <h1>Drain Avatar</h1>

      <h3>DIRECT DAMAGE</h3>
      <h3>RANGE - DIRECT</h3>

      <div className="mt-4 space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div>
          <h4 className="text-gray-300">Manna to Spirit Damage: 5 / 4 / 3</h4>

          <input
            type="number"
            min="0"
            step="1"
            value={spirit}
            onChange={(e) => setSpirit(Math.max(0, Number(e.target.value)))}
            className="mt-2 w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
          />
        </div>

        <div>
          <h4 className="text-gray-300">Manna to Soul Damage: 10 / 8 / 6</h4>

          <input
            type="number"
            min="0"
            step="1"
            value={soul}
            onChange={(e) => setSoul(Math.max(0, Number(e.target.value)))}
            className="mt-2 w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
          />
        </div>

        <div>
          <h4 className="text-gray-300">
            Manna to Life-Force Damage: 6 / 4 / 2
          </h4>

          <input
            type="number"
            min="0"
            step="1"
            value={life}
            onChange={(e) => setLife(Math.max(0, Number(e.target.value)))}
            className="mt-2 w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
          />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-2 text-gray-300">
          <div className="flex justify-between">
            <span>Life Force Damage</span>
            <span className="font-semibold text-cyan-400">{life}</span>
          </div>

          <div className="flex justify-between">
            <span>Spirit Damage</span>
            <span className="font-semibold text-cyan-400">{spirit}</span>
          </div>

          <div className="flex justify-between">
            <span>Soul Damage</span>
            <span className="font-semibold text-cyan-400">{soul}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Manna</span>
            <span className="font-semibold text-cyan-400">{totalCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrainAvatar;
