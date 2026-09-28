import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// Static Data
// ==================================================

const masteryData = {
  NOVICE: {
    powerRate: 12,
    damageRate: 5,
  },
  INTERMEDIATE: {
    powerRate: 10,
    damageRate: 4,
  },
  MASTERED: {
    powerRate: 8,
    damageRate: 3,
  },
};

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": false,
  "Carry Spell": true,
  "Spell Shift": false,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": true,
  "Father Spell": false,
};

// ==================================================
// Component
// ==================================================

export default function FluctuateSaturation({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) {
  // ==================================================
  // State
  // ==================================================

  const [power, setPower] = useState(0);
  const [damageInvestment, setDamageInvestment] = useState(0);

  const [spellCharge, setSpellCharge] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Derived Values
  // ==================================================

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const { powerRate, damageRate } = masteryData[mastery];

  const adjustedPower = power + (hyperSpell ? 1 : 0);

  // Base damage from actual Power investment only.
  const powerDamageBonus = power * 5;

  // Damage from Power investment + direct Damage investment.
  const baseDamage = damageInvestment + powerDamageBonus;

  // Hyper Spell directly adds 30% damage.
  const hyperSpellDamage = hyperSpell ? Math.floor(baseDamage * 0.3) : 0;

  const totalDamage = baseDamage + hyperSpellDamage;

  // Hyper Spell reduces the normal cost by 25%.
  const baseCost = power * powerRate + damageInvestment * damageRate;
  const cost = hyperSpell ? Math.floor(baseCost * 0.75) : baseCost;

  const positiveScaling = 0;
  const negativeScaling = 0.2;
  const scalingAdjustment = Math.floor(totalDamage * negativeScaling);

  // Spell Charge
  const spellChargeDamage = Math.floor(totalDamage * 0.2);

  // ==================================================
  // Spell Updates
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      <SpellTechniquesTable techniques={Techniques} />

      {/* ================================================== */}
      {/* Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <div className="mb-3 flex items-center justify-between border-b border-gray-700 pb-2">
          <h3 className="text-lg font-semibold text-orange-400">
            Fluctuation Statistics
          </h3>

          <div className="flex gap-2">
            {/* Spell Charge */}

            <button
              type="button"
              onClick={() => setSpellCharge((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                spellCharge
                  ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-cyan-500 hover:text-cyan-300"
              }`}
            >
              Spell Charge
            </button>

            {/* Hyper Spell */}

            <button
              type="button"
              onClick={() => setHyperSpell((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                hyperSpell
                  ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-500 hover:text-purple-300"
              }`}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Damage Type</span>
            <span className="font-semibold text-cyan-400">Kinetic</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Range</span>
            <span className="font-semibold text-cyan-400">Missile / Cloud</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Scaling</span>

            <span className="font-semibold text-cyan-400">
              0 / {scalingAdjustment} ({positiveScaling * 100}% / -
              {negativeScaling * 100}%)
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Power</span>

            <span className="font-semibold text-cyan-400">
              {power}

              {hyperSpell && (
                <span className="ml-2 text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.6)]">
                  (+1)
                </span>
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Damage</span>

            <span className="font-semibold text-cyan-400">
              {totalDamage}

              {spellCharge && (
                <span className="ml-2 text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">
                  (+{spellChargeDamage})
                </span>
              )}

              {hyperSpell && (
                <span className="ml-2 text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.6)]">
                  (+{hyperSpellDamage})
                </span>
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Cost</span>

            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>
        </div>

        {/* Spell Charge Effect */}

        {spellCharge && (
          <p className="mt-4 text-center text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
            Spell Charge: +20% Damage per charge • Maximum +100% Damage
          </p>
        )}

        {/* Hyper Spell Effect */}

        {hyperSpell && (
          <p className="mt-4 text-center text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]">
            Hyper Spell: +1 Power • +30% Damage • −25% Cost
          </p>
        )}
      </div>

      {/* ================================================== */}
      {/* Power Investment */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Power Investment
        </h3>

        <label className="mb-2 block text-sm text-gray-300">
          Manna to Power
          <span className="ml-2 text-xs text-gray-500">(Max of 5)</span>
        </label>

        <input
          type="number"
          min={0}
          max={5}
          value={power}
          onChange={(e) => setPower(Number(e.target.value) || 0)}
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-center text-lg text-cyan-400"
        />

        <p className="mt-4 text-center text-sm text-gray-400">Bonus Damage</p>

        <p className="text-center text-xl font-semibold text-cyan-400">
          +{powerDamageBonus}
        </p>
      </div>

      {/* ================================================== */}
      {/* Damage Investment */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Damage Investment
        </h3>

        <label className="mb-2 block text-sm text-gray-300">
          Manna to Damage
        </label>

        <input
          type="number"
          min={0}
          max={200}
          value={damageInvestment}
          onChange={(e) => setDamageInvestment(Number(e.target.value) || 0)}
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-center text-lg text-cyan-400"
        />
      </div>
    </>
  );
}
