"use client";

import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// TYPES
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";
type AuraEnergy = "BODY" | "SPIRITUAL" | "MEMORY";

// ==================================================
// MASTERY DATA
// ==================================================

const masteryData: Record<
  MasteryType,
  {
    powerRate: number;
    damageRate: number;
  }
> = {
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

// ==================================================
// SPELL TECHNIQUES
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": false,
  "Soul Cast": false,
  "Full Cast": false,
  "Counter Spell": false,
  "Spell Surge": false,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": true,
  "Aura Surge": true,
};

// ==================================================
// AURA SURGE OPTIONS
// ==================================================

const auraOptions: {
  value: AuraEnergy;
  label: string;
  description: string;
}[] = [
  {
    value: "BODY",
    label: "Body Energy",
    description: "Damage increased by 20% when cast.",
  },
  {
    value: "SPIRITUAL",
    label: "Spiritual Energy",
    description: "Construct is highly resistant to disruption.",
  },
  {
    value: "MEMORY",
    label: "Memory Energy",
    description: "Construct Vitality increased by 30%.",
  },
];

// ==================================================
// COMPONENT
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
  // STATE
  // ==================================================

  const [power, setPower] = useState(0);
  const [damageInvestment, setDamageInvestment] = useState(0);

  // ==================================================
  // TECHNIQUE STATE
  // ==================================================

  const [spellCharge, setSpellCharge] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);

  const [auraEnergy, setAuraEnergy] = useState<AuraEnergy>("BODY");

  // ==================================================
  // DERIVED VALUES
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const { powerRate, damageRate } = masteryData[mastery];

  // ==================================================
  // POWER
  // ==================================================

  const adjustedPower = power + (hyperSpell ? 1 : 0);

  // Bonus Damage comes from invested Power only.
  const powerDamageBonus = power * 5;

  // ==================================================
  // BASE DAMAGE
  // ==================================================

  const baseDamage = damageInvestment + powerDamageBonus;

  // ==================================================
  // HYPER SPELL
  // ==================================================

  const hyperSpellDamage = hyperSpell ? Math.floor(baseDamage * 0.3) : 0;

  // ==================================================
  // SPELL CHARGE
  // ==================================================

  const spellChargeDamage = spellCharge ? Math.floor(baseDamage * 0.2) : 0;

  // ==================================================
  // AURA SURGE
  // ==================================================

  const bodyAuraActive = auraSurge && auraEnergy === "BODY";

  const spiritualAuraActive = auraSurge && auraEnergy === "SPIRITUAL";

  const memoryAuraActive = auraSurge && auraEnergy === "MEMORY";

  const auraDamageBonus = bodyAuraActive ? Math.floor(baseDamage * 0.2) : 0;

  const selectedAuraOption = auraOptions.find(
    (option) => option.value === auraEnergy,
  );

  // ==================================================
  // FINAL DAMAGE
  // ==================================================

  const totalDamage =
    baseDamage + hyperSpellDamage + spellChargeDamage + auraDamageBonus;

  // ==================================================
  // COST
  // ==================================================

  const baseCost = power * powerRate + damageInvestment * damageRate;

  const cost = hyperSpell ? Math.floor(baseCost * 0.75) : baseCost;

  // ==================================================
  // SCALING
  // ==================================================

  const positiveScaling = 0;
  const negativeScaling = 0.2;

  const scalingAdjustment = Math.floor(totalDamage * negativeScaling);

  // ==================================================
  // SPELL UPDATES
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  // ==================================================
  // RESET TECHNIQUES
  // ==================================================

  useEffect(() => {
    if (!active) {
      setSpellCharge(false);
      setHyperSpell(false);
      setAuraSurge(false);
      setAuraEnergy("BODY");
    }
  }, [active]);

  // ==================================================
  // TECHNIQUE BUTTON STYLES
  // ==================================================

  const purpleButtonClass = (enabled: boolean) =>
    `rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
      enabled
        ? "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]"
        : "border-gray-600 bg-gray-900 text-gray-400 hover:border-purple-400 hover:text-purple-300"
    }`;

  // ==================================================
  // RENDER
  // ==================================================

  if (!active) return null;

  return (
    <>
      {/* ================================================== */}
      {/* SPELL TECHNIQUES */}
      {/* ================================================== */}

      <SpellTechniquesTable techniques={Techniques} />

      {/* ================================================== */}
      {/* TECHNIQUE BUTTONS */}
      {/* ================================================== */}

      <div className="mt-3 flex flex-wrap gap-2">
        {/* SPELL CHARGE */}

        <button
          type="button"
          onClick={() => setSpellCharge((prev) => !prev)}
          aria-pressed={spellCharge}
          className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
            spellCharge
              ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
              : "border-gray-600 bg-gray-900 text-gray-400 hover:border-cyan-400 hover:text-cyan-300"
          }`}
        >
          Spell Charge
        </button>

        {/* HYPER SPELL */}

        <button
          type="button"
          onClick={() => setHyperSpell((prev) => !prev)}
          aria-pressed={hyperSpell}
          className={purpleButtonClass(hyperSpell)}
        >
          Hyper Spell
        </button>

        {/* AURA SURGE */}

        <button
          type="button"
          onClick={() => setAuraSurge((prev) => !prev)}
          aria-pressed={auraSurge}
          className={purpleButtonClass(auraSurge)}
        >
          Aura Surge
        </button>
      </div>

      {/* ================================================== */}
      {/* TECHNIQUE EFFECTS */}
      {/* ================================================== */}

      {spellCharge && (
        <div className="mt-3 rounded-lg border border-cyan-800 bg-cyan-950/30 p-3">
          <p className="text-sm text-gray-300">
            <strong className="text-cyan-300">Spell Charge:</strong> +20% Damage
            per charge, up to a maximum of +100% Damage.
          </p>
        </div>
      )}

      {hyperSpell && (
        <div className="mt-3 rounded-lg border border-purple-800 bg-purple-950/30 p-3">
          <p className="text-sm text-gray-300">
            <strong className="text-purple-300">Hyper Spell:</strong> +1 Power,
            +30% Damage, and -25% Cost.
          </p>
        </div>
      )}

      {/* ================================================== */}
      {/* AURA SURGE CONFIGURATION */}
      {/* ================================================== */}

      {auraSurge && (
        <div className="mt-3 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
          <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
            Aura Surge Configuration
          </h3>

          <p className="mb-4 text-sm text-gray-400">
            Select the energy being channeled.
          </p>

          <div className="space-y-3">
            {auraOptions.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-md border px-4 py-3 transition ${
                  auraEnergy === option.value
                    ? "border-purple-500 bg-purple-950/20"
                    : "border-gray-700 bg-gray-900 hover:border-purple-500"
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-100">{option.label}</p>

                  <p className="mt-1 text-sm text-gray-400">
                    {option.description}
                  </p>
                </div>

                <input
                  type="radio"
                  name="fluctuate-aura-energy"
                  value={option.value}
                  checked={auraEnergy === option.value}
                  onChange={() => setAuraEnergy(option.value)}
                  className="h-5 w-5 accent-purple-500"
                />
              </label>
            ))}
          </div>

          {/* ACTIVE AURA EFFECT */}

          <div className="mt-4 rounded-lg border border-purple-800 bg-purple-950/30 p-4">
            <p className="mb-2 text-sm font-semibold text-purple-300">
              Active Aura Surge Effect
            </p>

            <p className="text-sm text-gray-300">
              <span className="font-semibold text-purple-300">
                {selectedAuraOption?.label}:
              </span>{" "}
              {selectedAuraOption?.description}
            </p>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* FLUCTUATION STATISTICS */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Fluctuation Statistics
        </h3>

        <div className="space-y-3">
          {/* DAMAGE TYPE */}

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Damage Type</span>

            <span className="font-semibold text-cyan-400">KINETIC</span>
          </div>

          {/* RANGE */}

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Range</span>

            <span className="font-semibold text-cyan-400">MISSILE / CLOUD</span>
          </div>

          {/* SCALING */}

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Scaling</span>

            <span className="font-semibold text-cyan-400">
              0 / {scalingAdjustment} ({positiveScaling * 100}% / -
              {negativeScaling * 100}%)
            </span>
          </div>

          {/* POWER */}

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Power</span>

            <span className="font-semibold text-cyan-400">
              {power}

              {hyperSpell && <span className="ml-2 text-purple-300">(+1)</span>}
            </span>
          </div>

          {/* ADJUSTED POWER */}

          {hyperSpell && (
            <div className="flex justify-between gap-3">
              <span className="text-gray-300">Final Power</span>

              <span className="font-semibold text-cyan-400">
                {adjustedPower}
              </span>
            </div>
          )}

          {/* BASE DAMAGE */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="text-gray-300">Base Damage</span>

            <span className="font-semibold text-cyan-400">{baseDamage}</span>
          </div>

          {/* SPELL CHARGE DAMAGE */}

          {spellCharge && (
            <div className="flex justify-between gap-3">
              <span className="text-cyan-300">Spell Charge Damage</span>

              <span className="font-semibold text-cyan-300">
                +{spellChargeDamage}
              </span>
            </div>
          )}

          {/* HYPER SPELL DAMAGE */}

          {hyperSpell && (
            <div className="flex justify-between gap-3">
              <span className="text-purple-300">Hyper Spell Damage</span>

              <span className="font-semibold text-purple-300">
                +{hyperSpellDamage}
              </span>
            </div>
          )}

          {/* AURA SURGE DAMAGE */}

          {bodyAuraActive && (
            <div className="flex justify-between gap-3">
              <span className="text-purple-300">Aura Surge Damage</span>

              <span className="font-semibold text-purple-300">
                +{auraDamageBonus}
              </span>
            </div>
          )}

          {/* TOTAL DAMAGE */}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-gray-200">Total Damage</span>

            <span className="font-semibold text-cyan-400">{totalDamage}</span>
          </div>

          {/* COST */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="text-gray-300">Base Cost</span>

            <span className="font-semibold text-cyan-400">{baseCost}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-gray-200">Cost</span>

            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>

          {/* SPIRITUAL AURA */}

          {spiritualAuraActive && (
            <p className="border-t border-gray-700 pt-3 text-center text-sm text-purple-300">
              Construct is highly resistant to disruption.
            </p>
          )}

          {/* MEMORY AURA */}

          {memoryAuraActive && (
            <p className="border-t border-gray-700 pt-3 text-center text-sm text-purple-300">
              Construct Vitality increased by 30%.
            </p>
          )}
        </div>
      </div>

      {/* ================================================== */}
      {/* POWER INVESTMENT */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Power Investment
        </h3>

        <label
          htmlFor="fluctuate-power"
          className="mb-2 block text-sm text-gray-300"
        >
          Manna to Power
          <span className="ml-2 text-xs text-gray-500">(Max of 5)</span>
        </label>

        <input
          id="fluctuate-power"
          type="number"
          min={0}
          max={5}
          step={1}
          value={power}
          onChange={(e) =>
            setPower(
              Math.min(5, Math.max(0, Math.floor(Number(e.target.value) || 0))),
            )
          }
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-center text-lg text-cyan-400 focus:border-orange-500 focus:outline-none"
        />

        <p className="mt-4 text-center text-sm text-gray-400">Bonus Damage</p>

        <p className="text-center text-xl font-semibold text-cyan-400">
          +{powerDamageBonus}
        </p>
      </div>

      {/* ================================================== */}
      {/* DAMAGE INVESTMENT */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Damage Investment
        </h3>

        <label
          htmlFor="fluctuate-damage"
          className="mb-2 block text-sm text-gray-300"
        >
          Manna to Damage
        </label>

        <input
          id="fluctuate-damage"
          type="number"
          min={0}
          max={200}
          step={1}
          value={damageInvestment}
          onChange={(e) =>
            setDamageInvestment(
              Math.min(
                200,
                Math.max(0, Math.floor(Number(e.target.value) || 0)),
              ),
            )
          }
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-center text-lg text-cyan-400 focus:border-orange-500 focus:outline-none"
        />
      </div>
    </>
  );
}
