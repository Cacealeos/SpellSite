import React, { useEffect, useState } from "react";
import { Mastery } from "../../../models/Mastery";
import { Spell } from "@/app/models";
import Select from "@/app/Select";

const ManifestProxy = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [turns, setTurns] = useState(0);
  const [size, setSize] = useState("Small AOE");

  const sizes = ["Small AOE", "Moderate AOE", "Large AOE"];

  const testMastery = new Mastery();

  let rate = 0;

  if (ParentMastery.getType() === testMastery.novice(true)) {
    rate = 10;
  } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
    rate = 5;
  } else if (ParentMastery.getType() === testMastery.mastered(true)) {
    rate = 0;
  }

  const mannaCost = turns * rate;

  // Reset the spell whenever it becomes inactive.
  useEffect(() => {
    if (!active) {
      setTurns(0);
      setSize("Small AOE");
      updateSpell("cost", 0);
    }
  }, [active, updateSpell]);

  // Update the parent spell whenever the number of Turns
  // or the mastery-dependent cost changes.
  useEffect(() => {
    if (!active) return;

    updateSpell("cost", mannaCost);
  }, [active, mannaCost, updateSpell]);

  return (
    <div>
      <h1>Manifest Proxy</h1>

      <h3>Manna to Turns</h3>
      <h3>RANGE - DIRECT</h3>

      <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-semibold text-cyan-400">Turns</h2>

        <p className="mb-2 text-sm text-gray-400">Manna per Turn: 10 / 5 / 0</p>

        <input
          type="number"
          min="0"
          step="1"
          value={turns}
          onChange={(e) => setTurns(Math.max(0, Number(e.target.value)))}
          className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
        />
      </div>

      <div className="mt-4">
        <Select title="AOE" choices={sizes} changeChoice={setSize} />
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-2 text-gray-300">
          <div className="flex justify-between">
            <span>Turns</span>
            <span className="font-semibold text-cyan-400">{turns}</span>
          </div>

          <div className="flex justify-between">
            <span>AOE</span>
            <span className="font-semibold text-cyan-400">{size}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Manna</span>
            <span className="font-semibold text-cyan-400">{mannaCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManifestProxy;
