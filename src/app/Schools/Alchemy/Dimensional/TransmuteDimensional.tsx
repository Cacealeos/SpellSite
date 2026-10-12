import { useEffect, useState } from "react";
import { BoltSlashIcon } from "@heroicons/react/24/solid";
import { Mastery, Spell } from "@/app/models";
import Select from "@/app/Select";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type TransmuteDimensionalProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

// ==================================================
// Spell Techniques
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Carry Spell": true,
  "Spell Shift": true,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Father Spell": false,
};

// ==================================================
// Form Options
// ==================================================

const forms = ["Tear", "Crush", "Dissolve"];

const TransmuteDimensional = ({
  ParentMastery,
  active,
  updateSpell,
}: TransmuteDimensionalProps) => {
  // ==================================================
  // State
  // ==================================================

  const [res, setRes] = useState(0);
  const [damage, setDamage] = useState(0);
  const [form, setForm] = useState("Tear");

  // ==================================================
  // Mastery Rates
  // ==================================================

  const masteryType = ParentMastery.getType();

  let rates: [number, number, number] = [0, 0, 0];

  switch (masteryType) {
    case "NOVICE":
      rates = [350, 4, 100];
      break;

    case "INTERMEDIATE":
      rates = [280, 3, 75];
      break;

    case "MASTERED":
      rates = [210, 2, 50];
      break;
  }

  const [baseCost, damageRate, resRate] = rates;

  // ==================================================
  // Spell Calculations
  // ==================================================

  const aoe = forms.indexOf(form);

  const bonusDamageCost = damageRate > 0 ? Math.ceil(damage / damageRate) : 0;

  const resCost = resRate > 0 ? Math.ceil(res / resRate) : 0;

  const finalCost = baseCost + bonusDamageCost + resCost;

  const primaryAOE = aoe > 0 ? "Moderate" : "Small";

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (active) return;

    setRes(0);
    setDamage(0);
    setForm("Tear");
  }, [active]);

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) return;

    updateSpell("cost", finalCost);
    updateSpell("ttt", 0);
  }, [active, finalCost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  if (!active) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Spell Title */}
      {/* ================================================== */}

      <div className="flex items-center gap-3">
        <BoltSlashIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">
          Transmute Dimensional
        </h1>
      </div>

      {/* ================================================== */}
      {/* Spell Techniques Table */}
      {/* ================================================== */}

      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* ================================================== */}
      {/* Spell Properties */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 border-b border-gray-700 pb-3 text-lg font-semibold text-cyan-400">
          Spell Properties
        </h2>

        {/* ================================================== */}
        {/* Form Selection */}
        {/* ================================================== */}

        <div>
          <h3 className="mb-3 text-lg font-bold text-orange-400">Form</h3>

          <Select title={form} choices={forms} changeChoice={setForm} />
        </div>

        {/* ================================================== */}
        {/* Bonus Damage */}
        {/* ================================================== */}

        <div className="mt-6 border-t border-gray-700 pt-6">
          <h3 className="mb-3 text-lg font-semibold text-orange-400">
            Bonus Damage
          </h3>

          <p className="mb-3 text-sm text-gray-400">
            Each {damageRate} damage costs 1 Manna.
          </p>

          <input
            type="number"
            min="0"
            step={damageRate || 1}
            value={damage}
            onChange={(e) =>
              setDamage(Math.max(0, Number(e.target.value) || 0))
            }
            className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50"
          />
        </div>

        {/* ================================================== */}
        {/* Resistance */}
        {/* ================================================== */}

        <div className="mt-6 border-t border-gray-700 pt-6">
          <h3 className="mb-3 text-lg font-semibold text-orange-400">
            Resistance
          </h3>

          <p className="mb-3 text-sm text-gray-400">
            Each {resRate} points of Res costs 1 Manna.
          </p>

          <input
            type="number"
            min="0"
            max="20"
            step="1"
            value={res}
            onChange={(e) =>
              setRes(Math.max(0, Math.min(20, Number(e.target.value) || 0)))
            }
            className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* Primary Spell Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Primary Spell Statistics
        </h2>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Effect</span>
            <span className="font-semibold text-orange-400">Dimensional</span>
          </div>

          <div className="flex justify-between">
            <span>Form</span>
            <span className="font-semibold text-orange-400">{form}</span>
          </div>

          <div className="flex justify-between">
            <span>Damage Type</span>
            <span className="font-semibold text-orange-400">Dimensional</span>
          </div>

          <div className="flex justify-between">
            <span>Range</span>
            <span className="font-semibold text-orange-400">Radial</span>
          </div>

          <div className="flex justify-between">
            <span>AOE</span>
            <span className="font-semibold text-orange-400">{primaryAOE}</span>
          </div>

          <div className="flex justify-between">
            <span>Bonus Damage</span>
            <span className="font-semibold text-orange-400">{damage}</span>
          </div>

          <div className="flex justify-between">
            <span>Resistance</span>
            <span className="font-semibold text-orange-400">{res}</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Manna</span>
            <span className="font-semibold text-orange-400">{finalCost}</span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Secondary Spell Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Secondary Spell Statistics
        </h2>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Effect</span>
            <span className="font-semibold text-orange-400">Dimensional</span>
          </div>

          <div className="flex justify-between">
            <span>Range</span>
            <span className="font-semibold text-orange-400">Direct</span>
          </div>

          <div className="flex justify-between">
            <span>AOE</span>
            <span className="font-semibold text-orange-400">None</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Check</span>
            <span className="font-semibold text-orange-400">{res} vs Res</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransmuteDimensional;
