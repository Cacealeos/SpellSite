"use client";

import { useEffect, useState } from "react";

import { Mastery, Spell, Potency } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// TYPES
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";
type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

type SizeType = "TINY" | "SIZEABLE" | "ENORMOUS" | "GARGANTUAN";

type AuraEnergy = "BODY" | "SPIRITUAL" | "MEMORY";

// ==================================================
// STATIC DATA
// ==================================================

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
      NOVICE: 100,
      INTERMEDIATE: 200,
      MASTERED: 300,
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
      NOVICE: 150,
      INTERMEDIATE: 300,
      MASTERED: 450,
    },
    ratio: 0.5,
  },
};

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
// SIZE OPTIONS
// ==================================================

const sizeOptions: Record<PotencyType, { value: SizeType; label: string }[]> = {
  MINOR: [
    { value: "TINY", label: "Tiny" },
    { value: "SIZEABLE", label: "Sizeable" },
  ],

  MAJOR: [
    { value: "SIZEABLE", label: "Sizeable" },
    { value: "ENORMOUS", label: "Enormous" },
  ],

  EXTREME: [
    { value: "ENORMOUS", label: "Enormous" },
    { value: "GARGANTUAN", label: "Gargantuan" },
  ],
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
    description: "Construct becomes highly resistant to disruption.",
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

export default function CollapseSaturation({
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

  const [selectedPotency, setSelectedPotency] = useState<PotencyType>("MINOR");

  const [size, setSize] = useState<SizeType>("TINY");

  const [damage, setDamage] = useState(0);

  const [vitalityInvestment, setVitalityInvestment] = useState(0);

  // ==================================================
  // TECHNIQUE STATE
  // ==================================================

  const [spellCharge, setSpellCharge] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);

  const [auraEnergy, setAuraEnergy] = useState<AuraEnergy>("BODY");

  // ==================================================
  // SIZE VALIDATION
  // ==================================================

  const availableSizes = sizeOptions[selectedPotency];

  useEffect(() => {
    if (!availableSizes.some((option) => option.value === size)) {
      setSize(availableSizes[0].value);
    }
  }, [availableSizes, size]);

  // ==================================================
  // DERIVED VALUES
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const data = spellData[selectedPotency];

  const baseCost = data.costs[mastery];
  const baseVitality = data.vitality[mastery];

  const totalCost = baseCost + vitalityInvestment;

  const currentVitality = baseVitality + vitalityInvestment;

  // ==================================================
  // TTT
  // ==================================================

  const requiredTTT =
    selectedPotency === "MINOR"
      ? damage * 2
      : selectedPotency === "MAJOR"
        ? damage
        : Math.ceil(damage / 2);

  // ==================================================
  // SPELL CHARGE
  // ==================================================

  const spellChargeDamage = spellCharge ? Math.floor(damage * 0.2) : 0;

  // ==================================================
  // HYPER SPELL
  // ==================================================

  const hyperCost = hyperSpell ? Math.floor(totalCost * 0.75) : totalCost;

  const hyperSpellDamage = hyperSpell ? Math.floor(damage * 0.3) : 0;

  // ==================================================
  // AURA SURGE
  // ==================================================

  const bodyAuraActive = auraSurge && auraEnergy === "BODY";

  const spiritualAuraActive = auraSurge && auraEnergy === "SPIRITUAL";

  const memoryAuraActive = auraSurge && auraEnergy === "MEMORY";

  const auraDamageBonus = bodyAuraActive ? Math.floor(damage * 0.2) : 0;

  const auraVitalityBonus = memoryAuraActive
    ? Math.floor(currentVitality * 0.3)
    : 0;

  // ==================================================
  // FINAL STATISTICS
  // ==================================================

  const finalDamage =
    damage + spellChargeDamage + hyperSpellDamage + auraDamageBonus;

  const finalVitality = currentVitality + auraVitalityBonus;

  const finalCost = hyperCost;

  // ==================================================
  // SPELL UPDATES
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      updateSpell("ttt", 0);
      return;
    }

    updateSpell("cost", finalCost);
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
  }, [active, finalCost, requiredTTT, selectedPotency, updateSpell]);

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

      {(spellCharge || hyperSpell || auraSurge) && (
        <div className="mt-3 space-y-3">
          {spellCharge && (
            <div className="rounded-lg border border-cyan-800 bg-cyan-950/30 p-3">
              <p className="text-sm text-gray-300">
                <strong className="text-cyan-300">Spell Charge:</strong>{" "}
                Increases Damage by 20%.
              </p>
            </div>
          )}

          {hyperSpell && (
            <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
              <p className="text-sm text-gray-300">
                <strong className="text-purple-300">Hyper Spell:</strong> +1
                Power, +30% Damage, and -25% Cost.
              </p>
            </div>
          )}

          {auraSurge && (
            <div className="rounded-lg border border-purple-800 bg-purple-950/30 p-3">
              <p className="text-sm text-gray-300">
                <strong className="text-purple-300">Aura Surge:</strong> Grants
                an additional effect based on the energy being channeled.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================================================== */}
      {/* AURA SURGE CONFIGURATION */}
      {/* ================================================== */}

      {auraSurge && (
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
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
                  name="collapse-aura-energy"
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

            {bodyAuraActive && (
              <p className="text-sm text-gray-300">
                While channeling{" "}
                <span className="font-semibold text-purple-300">
                  BODY ENERGY
                </span>
                , Damage is increased by{" "}
                <span className="font-semibold text-cyan-400">20%</span> when
                cast.
              </p>
            )}

            {spiritualAuraActive && (
              <p className="text-sm text-gray-300">
                While channeling{" "}
                <span className="font-semibold text-purple-300">
                  SPIRITUAL ENERGY
                </span>
                , the construct becomes{" "}
                <span className="font-semibold text-cyan-400">
                  highly resistant to disruption
                </span>
                .
              </p>
            )}

            {memoryAuraActive && (
              <p className="text-sm text-gray-300">
                While channeling{" "}
                <span className="font-semibold text-purple-300">
                  MEMORY ENERGY
                </span>
                , Construct Vitality is increased by{" "}
                <span className="font-semibold text-cyan-400">30%</span>.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* SPELL TITLE */}
      {/* ================================================== */}

      <h2 className="mb-6 mt-6 border-b border-gray-700 pb-2 text-2xl font-bold text-orange-400">
        Collapse Saturation
      </h2>

      {/* ================================================== */}
      {/* POTENCY */}
      {/* ================================================== */}

      <PotencySelector
        options={potencyOptions}
        selectedPotency={selectedPotency}
        setSelectedPotency={setSelectedPotency}
      />

      {/* ================================================== */}
      {/* CONSTRUCT SIZE */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Construct Size
        </h3>

        <div className="space-y-3">
          {availableSizes.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-gray-700 bg-gray-900 px-4 py-3 hover:border-orange-500"
            >
              <p className="font-medium text-gray-100">{option.label}</p>

              <input
                type="radio"
                name="collapse-size"
                checked={size === option.value}
                onChange={() => setSize(option.value)}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* COLLAPSE STATISTICS */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Collapse Statistics
        </h3>

        <div className="space-y-3">
          {/* COST */}

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Base Cost</span>

            <span className="font-semibold text-cyan-400">{baseCost}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Vitality Investment</span>

            <span className="font-semibold text-cyan-400">
              +{vitalityInvestment}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Total Cost</span>

            <span className="font-semibold text-cyan-400">
              {hyperSpell ? (
                <>
                  {finalCost}

                  <span className="ml-2 text-purple-300">({totalCost}*)</span>
                </>
              ) : (
                finalCost
              )}
            </span>
          </div>

          {/* VITALITY */}

          <div className="border-t border-gray-700 pt-3">
            <div className="flex justify-between gap-3">
              <span className="text-gray-300">Base Vitality</span>

              <span className="font-semibold text-cyan-400">
                {baseVitality}
              </span>
            </div>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Current Vitality</span>

            <span className="font-semibold text-cyan-400">
              {currentVitality}
            </span>
          </div>

          {memoryAuraActive && (
            <div className="flex justify-between gap-3">
              <span className="text-purple-300">Aura Surge Vitality</span>

              <span className="font-semibold text-purple-300">
                +{auraVitalityBonus}
              </span>
            </div>
          )}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-gray-200">Final Vitality</span>

            <span className="font-semibold text-cyan-400">{finalVitality}</span>
          </div>

          {/* DAMAGE */}

          <div className="border-t border-gray-700 pt-3">
            <div className="flex justify-between gap-3">
              <span className="text-gray-300">Base Damage</span>

              <span className="font-semibold text-cyan-400">{damage}</span>
            </div>
          </div>

          {spellCharge && (
            <div className="flex justify-between gap-3">
              <span className="text-cyan-300">Spell Charge Damage</span>

              <span className="font-semibold text-cyan-300">
                +{spellChargeDamage}
              </span>
            </div>
          )}

          {hyperSpell && (
            <div className="flex justify-between gap-3">
              <span className="text-purple-300">Hyper Spell Damage</span>

              <span className="font-semibold text-purple-300">
                +{hyperSpellDamage}
              </span>
            </div>
          )}

          {bodyAuraActive && (
            <div className="flex justify-between gap-3">
              <span className="text-purple-300">Aura Surge Damage</span>

              <span className="font-semibold text-purple-300">
                +{auraDamageBonus}
              </span>
            </div>
          )}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-gray-200">Final Damage</span>

            <span className="font-semibold text-cyan-400">{finalDamage}</span>
          </div>

          {/* TTT */}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-200">Required TTT</span>

            <span className="font-semibold text-cyan-400">{requiredTTT}</span>
          </div>

          {/* SPIRITUAL ENERGY */}

          {spiritualAuraActive && (
            <p className="border-t border-gray-700 pt-3 text-center text-sm text-purple-300">
              Construct is highly resistant to disruption.
            </p>
          )}

          {/* HYPER SPELL POWER */}

          {hyperSpell && (
            <p className="text-center text-sm text-purple-300">
              Hyper Spell: +1 Power
            </p>
          )}
        </div>
      </div>

      {/* ================================================== */}
      {/* VITALITY INVESTMENT */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Vitality Investment
        </h3>

        <label
          htmlFor="collapse-vitality"
          className="mb-2 block text-sm text-gray-300"
        >
          Additional Vitality
        </label>

        <input
          id="collapse-vitality"
          type="number"
          min={0}
          step={1}
          value={vitalityInvestment}
          onChange={(e) =>
            setVitalityInvestment(
              Math.max(0, Math.floor(Number(e.target.value) || 0)),
            )
          }
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-center text-lg text-cyan-400 focus:border-orange-500 focus:outline-none"
        />

        <p className="mt-4 text-center text-sm text-gray-400">
          Current Vitality
        </p>

        <p className="text-center text-xl font-semibold text-cyan-400">
          {finalVitality}
        </p>

        {memoryAuraActive && (
          <p className="mt-2 text-center text-sm text-purple-300">
            Includes +30% Vitality from Aura Surge.
          </p>
        )}
      </div>

      {/* ================================================== */}
      {/* DAMAGE INVESTMENT */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Damage Investment
        </h3>

        <label
          htmlFor="collapse-damage"
          className="mb-2 block text-sm text-gray-300"
        >
          Desired Damage
        </label>

        <input
          id="collapse-damage"
          type="number"
          min={0}
          step={1}
          value={damage}
          onChange={(e) =>
            setDamage(Math.max(0, Math.floor(Number(e.target.value) || 0)))
          }
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

        <p className="mt-4 text-center text-sm text-gray-400">Final Damage</p>

        <p className="text-center text-xl font-semibold text-cyan-400">
          {finalDamage}
        </p>
      </div>

      {/* ================================================== */}
      {/* SPELL DESCRIPTION */}
      {/* ================================================== */}

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
}
