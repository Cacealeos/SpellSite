"use client";

import { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import Select from "@/app/Select";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

const Techniques = {
  "Quick Spell": false,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": false,
  "Soul Cast": true,
  "Full Cast ": false,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": false,
  "Focus Spell": false,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Aura Surge": true,
};

type ConstructsProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const Constructs = ({
  ParentMastery,
  active,
  updateSpell,
}: ConstructsProps) => {
  // ==================================================
  // State
  // ==================================================

  const [power, setPower] = useState(0);
  const [damage, setDamage] = useState(0);
  const [size, setSize] = useState("Tiny");
  const [hyperSpell, setHyperSpell] = useState(false);
  const [soulCast, setSoulCast] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "15 / 10 / 5",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "45 / 30 / 15",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "135 / 90 / 45",
    },
  ];

  // ==================================================
  // Mastery Rates
  // ==================================================

  const getMasteryRates = () => {
    switch (ParentMastery.getType()) {
      case "NOVICE":
        return {
          powerRate: 6,
          damageRate: 4,
        };

      case "INTERMEDIATE":
        return {
          powerRate: 4,
          damageRate: 3,
        };

      case "MASTERED":
        return {
          powerRate: 2,
          damageRate: 2,
        };

      default:
        return {
          powerRate: 0,
          damageRate: 0,
        };
    }
  };

  // ==================================================
  // Base Cost
  // ==================================================

  const getBaseCost = () => {
    switch (ParentMastery.getType()) {
      case "NOVICE":
        switch (selectedPotency) {
          case "MINOR":
            return 15;
          case "MAJOR":
            return 45;
          case "EXTREME":
            return 135;
        }
        break;

      case "INTERMEDIATE":
        switch (selectedPotency) {
          case "MINOR":
            return 10;
          case "MAJOR":
            return 30;
          case "EXTREME":
            return 90;
        }
        break;

      case "MASTERED":
        switch (selectedPotency) {
          case "MINOR":
            return 5;
          case "MAJOR":
            return 15;
          case "EXTREME":
            return 45;
        }
        break;
    }

    return 0;
  };

  // ==================================================
  // Vitality
  // ==================================================

  const getBaseVitality = () => {
    switch (selectedPotency) {
      case "MINOR":
        return 10;

      case "MAJOR":
        return 30;

      case "EXTREME":
        return 90;

      default:
        return 10;
    }
  };

  // ==================================================
  // Size
  // ==================================================

  const getSizeOptions = () => {
    switch (selectedPotency) {
      case "MINOR":
        return ["Tiny", "Sizeable"];

      case "MAJOR":
        return ["Sizeable", "Enormous"];

      case "EXTREME":
        return ["Enormous", "Gargantuan"];

      default:
        return ["Tiny", "Sizeable"];
    }
  };

  const getSizeMultiplier = () => {
    switch (size) {
      case "Tiny":
        return 0.5;

      case "Sizeable":
        return 1;

      case "Enormous":
        return 2;

      case "Gargantuan":
        return 4;

      default:
        return 1;
    }
  };

  // ==================================================
  // Derived Values
  // ==================================================

  const rates = getMasteryRates();
  const baseVitality = getBaseVitality();
  const sizeOptions = getSizeOptions();

  const vitality = baseVitality * getSizeMultiplier();

  // Only Power/Endurance generate TTT.
  const ttt = power * rates.powerRate;

  const baseCost = getBaseCost() + damage * rates.damageRate;

  // Technique modifiers (casting-time requirements are not validated here).
  const memoryAura = auraSurge;
  const soulCost = soulCast ? 50 : 0;
  const damageBonus = hyperSpell ? Math.ceil(damage * 0.3) : 0;
  const finalDamage = damage + damageBonus;
  const finalEndurance = power + (memoryAura ? 1 : 0);
  const finalVitality = vitality + (memoryAura ? Math.ceil(vitality * 0.4) : 0);
  const cost = hyperSpell ? Math.ceil(baseCost * 0.33) : baseCost;

  // ==================================================
  // Spell Reset
  // ==================================================

  useEffect(() => {
    if (!active) {
      setPower(0);
      setDamage(0);
      setSize("Tiny");
      setSelectedPotency("MINOR");
      setHyperSpell(false);
      setSoulCast(false);
      setAuraSurge(false);
    }
  }, [active]);

  // ==================================================
  // Size Validation
  // ==================================================

  useEffect(() => {
    if (!active) return;

    const validSizes = getSizeOptions();

    if (!validSizes.includes(size)) {
      setSize(validSizes[0]);
    }
  }, [active, selectedPotency, size]);

  // ==================================================
  // Spell Updates
  // ==================================================

  useEffect(() => {
    if (!active) return;

    const pot = new Potency();

    switch (selectedPotency) {
      case "MINOR":
        pot.minor();
        break;

      case "MAJOR":
        pot.major();
        break;

      case "EXTREME":
        pot.extreme();
        break;
    }

    updateSpell("potency", pot);
    updateSpell("cost", cost);
    updateSpell("ttt", ttt);
  }, [active, selectedPotency, cost, ttt, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  if (!active) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* Spell Header */}
      {/* ================================================== */}

      <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4 text-center">
        <h1 className="text-2xl font-bold text-cyan-400">Constructs</h1>

        <div className="mt-2 space-y-1 text-sm text-gray-400">
          <p>POWER & ENDURANCE</p>
          <p>KINETIC DAMAGE</p>
          <p>RANGE - MISSILE / MELEE</p>
        </div>
      </div>

      {/* ================================================== */}
      {/* Spell Techniques Table */}
      <div className="mt-6">
        <SpellTechniquesTable techniques={Techniques} />
      </div>

      {/* Potency */}
      {/* ================================================== */}

      <div className="mt-6">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* ================================================== */}
      {/* Power & Endurance */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 border-b border-gray-700 pb-2 text-xl font-bold text-orange-400">
          Power & Endurance
        </h2>

        <p className="mb-2 text-sm text-gray-400">Manna to Power & Endurance</p>

        <input
          type="number"
          min="0"
          max="3"
          step="1"
          value={power}
          onChange={(e) => setPower(Math.max(0, Number(e.target.value) || 0))}
          className="w-24 rounded border border-gray-600 bg-gray-900 px-3 py-2 text-center text-lg text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
        />

        <p className="mt-2 text-sm text-gray-400">
          {rates.powerRate} TTT per Power/Endurance.
        </p>

        <div className="mt-5">
          <p className="mb-2 text-sm text-gray-400">Size</p>

          <Select title={size} choices={sizeOptions} changeChoice={setSize} />

          <p className="mt-2 text-sm text-gray-400">
            Base Vitality: {baseVitality}
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Vitality is determined by Potency and Size.
          </p>

          <p className="mt-2">
            Vitality:{" "}
            <span className="font-semibold text-cyan-400">{finalVitality}</span>
          </p>
        </div>
      </div>

      {/* ================================================== */}
      {/* Damage */}
      {/* ================================================== */}

      <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 border-b border-gray-700 pb-2 text-xl font-bold text-orange-400">
          Damage
        </h2>

        <p className="mb-2 text-sm text-gray-400">Manna to Damage</p>

        <input
          type="number"
          min="0"
          max={power * 15 + 5}
          step="1"
          value={damage}
          onChange={(e) => setDamage(Math.max(0, Number(e.target.value) || 0))}
          className="w-24 rounded border border-gray-600 bg-gray-900 px-3 py-2 text-center text-lg text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
        />

        <p className="mt-2 text-sm text-gray-400">
          {rates.damageRate} Manna per Damage.
        </p>
        {hyperSpell && (
          <p className="mt-2 text-sm text-gray-400">
            Adjusted Damage:{" "}
            <span className="font-semibold text-cyan-400">{finalDamage}</span>
          </p>
        )}
      </div>

      {/* ================================================== */}
      {/* Final Spell Statistics */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-2">
          <h2 className="text-lg font-semibold text-orange-400">
            Final Spell Statistics
          </h2>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={soulCast}
              onClick={() => setSoulCast((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                soulCast
                  ? "border-indigo-400 bg-indigo-500/10 text-indigo-300"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-indigo-500 hover:text-indigo-300"
              }`}
            >
              Soul Cast
            </button>
            <button
              type="button"
              aria-pressed={auraSurge}
              onClick={() => setAuraSurge((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                auraSurge
                  ? "border-orange-400 bg-orange-500/10 text-orange-300"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-orange-500 hover:text-orange-300"
              }`}
            >
              Aura Surge
            </button>
            {/* Hyper Spell */}
            <button
              type="button"
              aria-pressed={hyperSpell}
              onClick={() => setHyperSpell((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                hyperSpell
                  ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
                  : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-500 hover:text-purple-300"
              }`}
            >
              Hyper Spell
            </button>
          </div>
        </div>

        <div className="mb-4 space-y-3">
          {soulCast && (
            <div className="rounded-lg border border-indigo-700 bg-indigo-950/30 p-4 text-sm text-indigo-200">
              <h3 className="mb-2 font-semibold">
                Soul Cast — {soulCost} Soul
              </h3>
              The caster may leave a temporary sentient consciousness inside the
              construct. While active, the construct may make actions on its own
              without interacts from others.
            </div>
          )}
          {auraSurge && (
            <div className="space-y-3 rounded-lg border border-orange-700 bg-orange-950/30 p-4 text-sm text-orange-200">
              <h3 className="font-semibold">Aura Surge — Memory Energy</h3>
              <p>
                While channeling <strong>Memory Energy</strong>, Constructs
                receive <strong>+1 Endurance</strong> and{" "}
                <strong>+40% Vitality</strong> if the caster's Endurance is
                higher than the construct's base Endurance.
              </p>
              <p className="text-xs text-orange-300">
                Energy and Endurance requirements are resolved during casting.
                Statistics preview the conditional bonuses.
              </p>
            </div>
          )}
          {hyperSpell && (
            <div className="rounded-lg border border-purple-700 bg-purple-950/30 p-4 text-sm text-purple-200">
              <h3 className="mb-2 font-semibold">Hyper Spell</h3>
              Reduces Manna cost by 67% and increases Repulsion Damage by 30%.
            </div>
          )}
        </div>

        <div className="space-y-2 text-gray-300">
          <div className="flex justify-between">
            <span>Size</span>
            <span className="font-semibold text-orange-400">{size}</span>
          </div>

          <div className="flex justify-between">
            <span>Power / Endurance</span>
            <span className="font-semibold text-cyan-400">
              {power} / {finalEndurance}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Vitality</span>
            <span className="font-semibold text-cyan-400">{finalVitality}</span>
          </div>

          {soulCast && (
            <div className="flex justify-between">
              <span>Soul Cost</span>
              <span className="font-semibold text-indigo-300">
                {soulCost} Soul
              </span>
            </div>
          )}
          {memoryAura && (
            <p className="text-xs text-orange-300">
              Endurance and Vitality bonuses are conditional on the casting
              requirement.
            </p>
          )}
          <div className="flex justify-between border-t border-gray-700 pt-2">
            <span>Cost</span>
            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>

          <div className="flex justify-between">
            <span>TTT</span>
            <span className="font-semibold text-orange-400">{ttt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Constructs;
