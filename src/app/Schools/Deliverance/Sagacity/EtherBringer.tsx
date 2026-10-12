import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Types
// ==================================================

type EtherBringerProps = {
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
// Mastery Rates
// ==================================================

const masteryRates = {
  NOVICE: 6,
  INTERMEDIATE: 4,
  MASTERED: 2,
};

// ==================================================
// Component
// ==================================================

const EtherBringer = ({
  ParentMastery,
  active,
  updateSpell,
}: EtherBringerProps) => {
  // ==================================================
  // State
  // ==================================================

  const [ether, setEther] = useState(0);

  // ==================================================
  // Spell Calculations
  // ==================================================

  const masteryType = ParentMastery.getType() as keyof typeof masteryRates;

  const rate = masteryRates[masteryType] ?? 6;

  const tttCost = ether * rate;

  // ==================================================
  // Reset Local State
  // ==================================================

  useEffect(() => {
    if (!active) {
      setEther(0);
    }
  }, [active]);

  // ==================================================
  // Update Parent Spell
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("ttt", tttCost);
  }, [active, tttCost, updateSpell]);

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
        <SparklesIcon className="h-8 w-8 text-cyan-400" />

        <h1 className="text-2xl font-bold text-cyan-400">Ether Bringer</h1>
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

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h2 className="mb-4 border-b border-gray-700 pb-3 text-lg font-semibold text-cyan-400">
          Spell Properties
        </h2>

        {/* ================================================== */}
        {/* Ether Generated */}
        {/* ================================================== */}

        <label
          htmlFor="ether-generated"
          className="mb-2 block text-sm font-semibold text-gray-300"
        >
          Ether Generated
        </label>

        <input
          id="ether-generated"
          type="number"
          min={0}
          step={1}
          value={ether}
          onChange={(e) =>
            setEther(Math.max(0, Math.floor(Number(e.target.value) || 0)))
          }
          className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50"
        />

        {/* ================================================== */}
        {/* Ether Conversion Information */}
        {/* ================================================== */}

        <p className="mt-3 text-sm text-gray-400">
          Converts Ether into a sustained Turn-to-Turn expenditure. The TTT cost
          is determined by the amount of Ether generated and your current
          Mastery.
        </p>

        <p className="mt-3 text-center text-sm font-semibold text-cyan-400">
          TTT Cost = Ether × {rate}
        </p>
      </div>

      {/* ================================================== */}
      {/* Final Spell Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h2 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Final Spell Statistics
        </h2>

        <div className="space-y-3 text-gray-300">
          {/* ================================================== */}
          {/* Ether Generated */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Ether Generated</span>

            <span className="font-semibold text-orange-400">{ether}</span>
          </div>

          {/* ================================================== */}
          {/* Range */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>Range</span>

            <span className="font-semibold text-orange-400">Direct</span>
          </div>

          {/* ================================================== */}
          {/* Mastery Rate */}
          {/* ================================================== */}

          <div className="flex justify-between">
            <span>TTT per Ether</span>

            <span className="font-semibold text-orange-400">{rate}</span>
          </div>

          {/* ================================================== */}
          {/* Final TTT */}
          {/* ================================================== */}

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>TTT</span>

            <span className="font-semibold text-orange-400">{tttCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtherBringer;
