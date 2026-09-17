import { useState, useEffect } from "react";

import { Mastery, Spell, Potency } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

const CollapseSaturation = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  // ==================================================
  // State
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [damage, setDamage] = useState(0);
  const [vitalityInvestment, setVitalityInvestment] = useState(0);

  const spellData = {
    MINOR: {
      costs: {
        NOVICE: 90,
        INTERMEDIATE: 60,
        MASTERED: 30,
      },
      vitality: {
        NOVICE: 50,
        INTERMEDIATE: 100,
        MASTERED: 150,
      },
      ratio: 2,
    },

    MAJOR: {
      costs: {
        NOVICE: 200,
        INTERMEDIATE: 150,
        MASTERED: 100,
      },
      vitality: {
        NOVICE: 200,
        INTERMEDIATE: 300,
        MASTERED: 400,
      },
      ratio: 1,
    },

    EXTREME: {
      costs: {
        NOVICE: 500,
        INTERMEDIATE: 400,
        MASTERED: 300,
      },
      vitality: {
        NOVICE: 500,
        INTERMEDIATE: 700,
        MASTERED: 900,
      },
      ratio: 0.5,
    },
  };
  // ==================================================
  // Technique State
  // ==================================================

  const [spellCharge, setSpellCharge] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Spell Techniques
  // ==================================================

  const Techniques = {
    "Quick Spell": true,
    "Spell Reflex": false,
    "Double Cast": true,
    "Double Pulse": false,
    "Carry Spell": true,
    "Spell Shift": false,
    "Counter Spell": true,
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

  const mastery = ParentMastery.getType() as
    | "NOVICE"
    | "INTERMEDIATE"
    | "MASTERED";

  const data = spellData[selectedPotency];

  const baseCost = data.costs[mastery];
  const baseVitality = data.vitality[mastery];

  const totalCost = baseCost + vitalityInvestment;

  const currentVitality = baseVitality + vitalityInvestment;

  const requiredTTT =
    selectedPotency === "MINOR"
      ? damage * 2
      : selectedPotency === "MAJOR"
        ? damage
        : Math.ceil(damage / 2);

  // ==================================================
  // Technique Effects
  // ==================================================

  const hyperCost = hyperSpell ? Math.floor(totalCost * 0.75) : totalCost;
  const spellChargeDamage = Math.floor(damage * 0.2);
  const hyperSpellDamage = Math.floor(damage * 0.3);

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "90 / 60 / 30",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "200 / 150 / 100",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "500 / 400 / 300",
    },
  ];

  // ==================================================
  // Spell Calculation
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("cost", totalCost);
    updateSpell("ttt", requiredTTT);

    const potency = new Potency();

    switch (selectedPotency) {
      case "MINOR":
        potency.minor();
        break;
      case "MAJOR":
        potency.major();
        break;
      case "EXTREME":
        potency.extreme();
        break;
    }

    updateSpell("potency", potency);
  }, [active, totalCost, requiredTTT, selectedPotency, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      <SpellTechniquesTable techniques={Techniques} />

      <h2 className="mb-6 border-b border-gray-700 pb-2 text-2xl font-bold text-orange-400">
        Collapse Saturation
      </h2>

      <PotencySelector
        options={potencyOptions}
        selectedPotency={selectedPotency}
        setSelectedPotency={setSelectedPotency}
      />

      {/* Statistics */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-orange-400">
            Collapse Statistics
          </h3>

          {/* Technique Controls */}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSpellCharge((prev) => !prev)}
              className={`
          rounded-lg border px-3 py-1.5 text-sm font-semibold
          transition-all
          ${
            spellCharge
              ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
              : "border-gray-700 bg-gray-900 text-gray-300 hover:border-cyan-400 hover:text-cyan-300"
          }
        `}
            >
              Spell Charge
            </button>

            <button
              type="button"
              onClick={() => setHyperSpell((prev) => !prev)}
              className={`
          rounded-lg border px-3 py-1.5 text-sm font-semibold
          transition-all
          ${
            hyperSpell
              ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
              : "border-gray-700 bg-gray-900 text-gray-300 hover:border-purple-400 hover:text-purple-300"
          }
        `}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        <div className="mt-2 h-px bg-gray-700" />

        <div className="mt-3 space-y-3">
          {hyperSpell && (
            <p className="text-right text-sm text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]">
              Hyper Spell: +1 Power*
            </p>
          )}

          <div className="flex justify-between">
            <span>Base Cost</span>
            <span>
              {hyperSpell ? (
                <>
                  {hyperCost}
                  <span className="text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]">
                    {" "}
                    ({totalCost}*)
                  </span>
                </>
              ) : (
                totalCost
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Base Vitality</span>
            <span>{baseVitality}</span>
          </div>

          <div className="flex justify-between">
            <span>Current Vitality</span>
            <span>{currentVitality}</span>
          </div>

          <div className="flex justify-between">
            <span>Current Damage</span>

            <span className="text-cyan-400">
              {damage}

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
        </div>

        {hyperSpell && (
          <p className="mt-4 text-center text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]">
            Hyper Spell: +1 Power • +30% Damage • −25% Cost
          </p>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Vitality Investment
        </h3>

        <label className="mb-2 block text-sm text-gray-300">
          Additional Vitality
        </label>

        <input
          type="number"
          min={0}
          value={vitalityInvestment}
          onChange={(e) => setVitalityInvestment(Number(e.target.value))}
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-center text-lg text-cyan-400 focus:border-orange-500 focus:outline-none"
        />

        <p className="mt-4 text-center text-sm text-gray-400">
          Current Vitality
        </p>

        <p className="text-center text-xl font-semibold text-cyan-400">
          {currentVitality}
        </p>
      </div>

      {/* Damage Investment */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Damage Investment
        </h3>

        <label className="mb-2 block text-sm text-gray-300">
          Desired Damage
        </label>

        <input
          type="number"
          min={0}
          value={damage}
          onChange={(e) => setDamage(Number(e.target.value))}
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-center text-lg text-cyan-400 focus:border-orange-500 focus:outline-none"
        />

        <p className="mt-4 text-center text-sm text-gray-400">TTT to Damage</p>

        <p className="text-center text-xl font-semibold text-cyan-400">
          {selectedPotency === "MINOR"
            ? "2 : 1"
            : selectedPotency === "MAJOR"
              ? "1 : 1"
              : "1 : 2"}
        </p>
      </div>

      {/* Spell Description */}

      <div className="mt-6 space-y-4 text-gray-300">
        <p>
          Collect and pool saturated manna into a construct before collapsing it
          into Ether or Ethereal, releasing tremendous kinetic energy.
        </p>

        <p>
          Power scales with Saturation. Every 10% Saturation grants +1 Power, up
          to a maximum of 6.
        </p>

        <p>
          Collective Vitality scales with potency and may be further reinforced
          through additional manna investment.
        </p>

        <p>
          Damage is generated by investing Turn-to-Turn cost into the construct.
          Stored TTT decays by 10 each turn while the construct remains
          undetonated.
        </p>

        <p>The construct cannot be detonated with less than 10 invested TTT.</p>
      </div>
    </>
  );
};

export default CollapseSaturation;
