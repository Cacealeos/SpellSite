import React, { useState, useEffect } from "react";
import { Mastery, Spell } from "@/app/models";
import { SunIcon } from "@heroicons/react/24/solid";
import Select from "@/app/Select";

type TransmuteLightHeatProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const TransmuteLightHeat = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmuteLightHeatProps) => {
  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);
  const [type, setType] = useState("");

  const testMastery = new Mastery();
  const choices = ["Light", "Heat", "Cold"];

  let rates: number[] = [0, 0];

  if (ParentMastery.getType() === testMastery.novice(true)) {
    rates = [35, 6];
  } else if (ParentMastery.getType() === testMastery.intermediate(true)) {
    rates = [30, 5];
  } else if (ParentMastery.getType() === testMastery.mastered(true)) {
    rates = [25, 4];
  }

  const typeIndex = choices.indexOf(type);

  const damageType = typeIndex !== 0 ? "THERMAL" : "ELECTRIC";

  const aoe = power > 6 ? "Large" : power > 4 ? "Moderate" : "Small";

  const mannaCost = power * rates[0] + damage * rates[1];

  // Reset local UI state whenever this spell becomes inactive.
  useEffect(() => {
    if (!active) {
      setPower(0);
      setDamage(0);
      setType("");
    }
  }, [active]);

  // Synchronize the calculated spell cost with the parent Spell.
  useEffect(() => {
    if (!active) return;

    updateSpell("cost", mannaCost);
    updateSpell("ttt", 0);
  }, [active, mannaCost, updateSpell]);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <SunIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Transmute Light & Heat & Cold
        </h1>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-xl font-bold text-orange-400">Type</h2>

          <Select choices={choices} title="Type" changeChoice={setType} />
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h2 className="mb-3 text-xl font-bold text-orange-400">Power</h2>

          <input
            type="number"
            min="0"
            max={8 - Math.max(typeIndex, 0)}
            step="1"
            value={power}
            onChange={(e) => setPower(Math.max(0, Number(e.target.value) || 0))}
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

          <p className="mt-2 text-sm text-gray-400">
            Manna cost per Power: {rates[0]}
          </p>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h2 className="mb-3 text-xl font-bold text-orange-400">Damage</h2>

          <input
            type="number"
            min="0"
            step="1"
            value={damage}
            onChange={(e) =>
              setDamage(Math.max(0, Number(e.target.value) || 0))
            }
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

          <p className="mt-2 text-sm text-gray-400">
            Manna cost per Damage: {rates[1]}
          </p>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h2 className="mb-3 border-b border-gray-700 pb-2 text-xl font-bold text-cyan-400">
            Spell Properties
          </h2>

          <div className="space-y-2 text-gray-300">
            <div className="flex justify-between">
              <span>Damage Type</span>
              <span className="font-semibold text-cyan-400">{damageType}</span>
            </div>

            <div className="flex justify-between">
              <span>Range</span>
              <span className="font-semibold text-cyan-400">RADIAL</span>
            </div>

            <div className="flex justify-between">
              <span>AOE</span>
              <span className="font-semibold text-cyan-400">{aoe}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h2 className="mb-3 border-b border-gray-700 pb-2 text-xl font-bold text-cyan-400">
            Secondary
          </h2>

          <div className="space-y-2 text-gray-300">
            <div className="flex justify-between">
              <span>Damage Type</span>
              <span className="font-semibold text-cyan-400">{damageType}</span>
            </div>

            <div className="flex justify-between">
              <span>Range</span>
              <span className="font-semibold text-cyan-400">RADIAL</span>
            </div>

            <div className="flex justify-between">
              <span>AOE</span>
              <span className="font-semibold text-cyan-400">Small</span>
            </div>

            <div className="flex justify-between">
              <span>Check</span>
              <span className="font-semibold text-orange-400">
                {power * 2} vs Res OR Dis
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h2 className="mb-3 border-b border-gray-700 pb-2 text-xl font-bold text-cyan-400">
            Final Spell Statistics
          </h2>

          <div className="space-y-2 text-gray-300">
            <div className="flex justify-between">
              <span>Type</span>
              <span className="font-semibold text-cyan-400">{type || "—"}</span>
            </div>

            <div className="flex justify-between">
              <span>Power</span>
              <span className="font-semibold text-cyan-400">{power}</span>
            </div>

            <div className="flex justify-between">
              <span>Damage</span>
              <span className="font-semibold text-cyan-400">{damage}</span>
            </div>

            <div className="flex justify-between">
              <span>Manna</span>
              <span className="font-semibold text-orange-400">{mannaCost}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransmuteLightHeat;
