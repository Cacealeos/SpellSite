import { useEffect, useState } from "react";
import { BoltSlashIcon } from "@heroicons/react/24/solid";
import { Mastery, Spell } from "@/app/models";
import Select from "@/app/Select";

type TransmuteDimensionalProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const TransmuteDimensional = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmuteDimensionalProps) => {
  const [res, setRes] = useState(0);
  const [damage, setDamage] = useState(0);
  const [form, setForm] = useState("Tear");

  const testMastery = new Mastery();

  const forms = ["Tear", "Crush", "Dissolve"];

  let rates: [number, number, number] = [0, 0, 0];

  if (ParentMastery.getType() === testMastery.novice(true)) {
    rates = [350, 4, 100];
  } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
    rates = [280, 3, 75];
  } else if (ParentMastery.getType() === testMastery.mastered(true)) {
    rates = [210, 2, 50];
  }

  const [baseCost, damageRate, resRate] = rates;

  const aoe = forms.indexOf(form);

  const bonusDamageCost = damageRate > 0 ? Math.ceil(damage / damageRate) : 0;

  const resCost = resRate > 0 ? Math.ceil(res / resRate) : 0;

  const finalCost = baseCost + bonusDamageCost + resCost;

  useEffect(() => {
    if (!active) {
      setRes(0);
      setDamage(0);
      setForm("Tear");
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;

    updateSpell("cost", finalCost);
    updateSpell("ttt", 0);
  }, [active, finalCost, updateSpell]);

  if (!active) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <div className="flex items-center gap-3">
        <BoltSlashIcon className="h-7 w-7 text-orange-400" />

        <div>
          <h1 className="text-2xl font-bold text-gray-100">
            Transmute Dimensional
          </h1>

          <h3 className="text-sm font-semibold tracking-wide text-gray-400">
            DIMENSIONAL DAMAGE • RANGE - RADIAL
          </h3>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-xl font-bold text-orange-400">
          Form
        </h2>

        <Select title={form} choices={forms} changeChoice={setForm} />
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-semibold text-orange-400">
          Bonus Damage
        </h2>

        <p className="mb-2 text-sm text-gray-400">
          Each {damageRate} damage costs 1 Manna.
        </p>

        <input
          type="number"
          min="0"
          step={damageRate || 1}
          value={damage}
          onChange={(e) => setDamage(Math.max(0, Number(e.target.value) || 0))}
          className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
        />
      </div>

      <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-semibold text-orange-400">
          Resistance
        </h2>

        <p className="mb-2 text-sm text-gray-400">
          Each {resRate} points of Res costs 1 Manna.
        </p>

        <input
          type="number"
          min="0"
          max="20"
          step="1"
          value={res}
          onChange={(e) => setRes(Math.max(0, Number(e.target.value) || 0))}
          className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
        />
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-2 text-gray-300">
          <div className="flex justify-between">
            <span>Form</span>
            <span className="font-semibold text-orange-400">{form}</span>
          </div>

          <div className="flex justify-between">
            <span>AOE</span>
            <span className="font-semibold text-orange-400">
              {aoe > 0 ? "Moderate" : "Small"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Bonus Damage</span>
            <span className="font-semibold text-cyan-400">{damage}</span>
          </div>

          <div className="flex justify-between">
            <span>Resistance</span>
            <span className="font-semibold text-cyan-400">{res}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-2">
            <span>Manna</span>
            <span className="font-semibold text-cyan-400">{finalCost}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Secondary
        </h2>

        <div className="space-y-1 text-gray-300">
          <h3>DIMENSIONAL</h3>
          <h3>RANGE - DIRECT</h3>
          <h3>AOE - None</h3>

          <h3 className="pt-2">
            Check:{" "}
            <span className="font-semibold text-cyan-400">{res} vs Res</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default TransmuteDimensional;
