import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import Select from "@/app/Select";

type PossessSprintProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

type SprintType = "Seal" | "Construct" | "Entity" | "Link" | "Orchestrate";

const sprintRates: Record<
  SprintType,
  {
    NOVICE: number;
    INTERMEDIATE: number;
    MASTERED: number;
  }
> = {
  Seal: {
    NOVICE: 6,
    INTERMEDIATE: 4,
    MASTERED: 2,
  },
  Construct: {
    NOVICE: 6,
    INTERMEDIATE: 4,
    MASTERED: 2,
  },
  Entity: {
    NOVICE: 8,
    INTERMEDIATE: 6,
    MASTERED: 4,
  },
  Link: {
    NOVICE: 7,
    INTERMEDIATE: 5,
    MASTERED: 3,
  },
  Orchestrate: {
    NOVICE: 3,
    INTERMEDIATE: 2,
    MASTERED: 1,
  },
};

const types: SprintType[] = [
  "Seal",
  "Construct",
  "Entity",
  "Link",
  "Orchestrate",
];

export default function PossessSprint({
  ParentMastery,
  active,
  updateSpell,
}: PossessSprintProps) {
  const [ppp, setPPP] = useState(0);
  const [type, setType] = useState<SprintType>("Seal");

  const mastery = ParentMastery.getType();

  const rate = sprintRates[type][mastery];

  const finalTTT = ppp * rate;

  const pppOver50 = ppp * 2;
  const pppUnder50 = ppp * 0.5;

  useEffect(() => {
    updateSpell("ttt", active ? finalTTT : 0);
  }, [active, finalTTT, updateSpell]);

  if (!active) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-200">Possession Sprint</h1>

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
        <h2 className="mb-3 text-sm font-medium text-gray-300">PPP Movement</h2>

        <p className="text-sm text-gray-400">
          While over 50%:{" "}
          <span className="font-medium text-gray-200">{pppOver50} PPP</span>
        </p>

        <p className="mt-1 text-sm text-gray-400">
          While under 50%:{" "}
          <span className="font-medium text-gray-200">{pppUnder50} PPP</span>
        </p>
      </section>

      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
          <h2 className="mb-3 text-sm font-medium text-gray-300">Type</h2>

          <Select choices={types} changeChoice={setType} title={type} />
        </section>
      </section>
    </div>
  );
}
