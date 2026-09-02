import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import Select from "@/app/Select";

type DominateSustainProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type DominateType = "Structure" | "Entity";

const types: DominateType[] = ["Structure", "Entity"];

const sustainRates: Record<
  DominateType,
  {
    NOVICE: number;
    INTERMEDIATE: number;
    MASTERED: number;
  }
> = {
  Structure: {
    NOVICE: 12,
    INTERMEDIATE: 10,
    MASTERED: 8,
  },
  Entity: {
    NOVICE: 14,
    INTERMEDIATE: 12,
    MASTERED: 10,
  },
};

export default function DominateSustain({
  ParentMastery,
  active,
  updateSpell,
}: DominateSustainProps) {
  const [ppp, setPPP] = useState(0);
  const [type, setType] = useState<DominateType>("Structure");

  const mastery = ParentMastery.getType();

  const rate = sustainRates[type][mastery];

  const finalTTT = ppp * rate;

  useEffect(() => {
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalTTT, updateSpell]);

  if (!active) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-200">
        Domination - Sustain
      </h1>

      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-sm font-medium text-gray-300">PPP</h2>

        <input
          type="number"
          min={0}
          step={1}
          value={ppp}
          onChange={(e) => setPPP(Number(e.target.value))}
          className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 outline-none focus:border-gray-400"
        />

        <p className="mt-3 text-sm text-gray-400">
          TTT per PPP: <span className="font-medium text-gray-200">{rate}</span>
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
