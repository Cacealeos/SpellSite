import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import Select from "@/app/Select";

type DominateDashProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type DominateType = "Structure" | "Entity";

const types: DominateType[] = ["Structure", "Entity"];

export default function DominateDash({
  ParentMastery,
  active,
  updateSpell,
}: DominateDashProps) {
  const [increment, setIncrement] = useState(0);
  const [type, setType] = useState<DominateType>("Structure");

  const mastery = ParentMastery.getType();

  const masteryRate =
    mastery === "NOVICE" ? 10 : mastery === "INTERMEDIATE" ? 5 : 3;

  const finalTTT = increment * masteryRate;

  useEffect(() => {
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalTTT, updateSpell]);

  if (!active) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-200">Dominate Dash</h1>

      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-sm font-medium text-gray-300">Increment</h2>

        <input
          type="number"
          min={0}
          step={1}
          value={increment}
          onChange={(e) => setIncrement(Number(e.target.value))}
          className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 outline-none focus:border-gray-400"
        />

        <p className="mt-3 text-sm text-gray-400">
          TTT per Increment:{" "}
          <span className="font-medium text-gray-200">{masteryRate}</span>
        </p>

        <p className="mt-1 text-sm text-gray-400">
          TTT: <span className="font-semibold text-gray-200">{finalTTT}</span>
        </p>
      </section>

      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-sm font-medium text-gray-300">Type</h2>

        <Select choices={types} changeChoice={setType} title={type} />
      </section>
    </div>
  );
}
