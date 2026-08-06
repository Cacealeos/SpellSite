import React, { useState, useEffect } from "react";
import { Mastery, Spell } from "@/app/models";

const EtherBringer = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [ether, setEther] = useState(0);

  const rate =
    ParentMastery.getType() === "NOVICE"
      ? 6
      : ParentMastery.getType() === "INTERMEDIATE"
        ? 4
        : 2;

  useEffect(() => {
    if (!active) {
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("ttt", ether * rate);
  }, [active, ether, rate, updateSpell]);

  return (
    <>
      <h2 className="mb-4 text-center text-3xl font-bold text-cyan-400">
        Ether Bringer
      </h2>

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Ether Generated
        </h3>

        <label className="mb-2 block text-sm text-gray-300">Ether</label>

        <input
          type="number"
          min={0}
          step={1}
          value={ether}
          onChange={(e) => setEther(Number(e.target.value) || 0)}
          className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
        />

        <p className="mt-3 text-center text-sm text-gray-400">
          TTT Cost = Ether × {rate}
        </p>
      </div>
      <div className="mt-6 space-y-4 text-gray-300">
        <p>
          Converts Ether into a sustained Turn-to-Turn expenditure. The TTT cost
          is determined by the amount of Ether generated and your current
          mastery.
        </p>
      </div>
    </>
  );
};

export default EtherBringer;
