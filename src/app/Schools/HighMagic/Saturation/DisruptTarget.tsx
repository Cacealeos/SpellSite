"use client";

import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";

// ==================================================
// TYPES
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";
type AOEType = "SMALL" | "MODERATE";
type AuraEnergy = "BODY" | "SPIRITUAL" | "MEMORY";

// ==================================================
// MASTERY DATA
// ==================================================

const masteryData: Record<MasteryType, { rate: number; max: number }> = {
  NOVICE: {
    rate: 6,
    max: 50,
  },
  INTERMEDIATE: {
    rate: 4,
    max: 100,
  },
  MASTERED: {
    rate: 2,
    max: 150,
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
  "Hyper Spell": false,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": true,
  "Aura Surge": true,
};

// ==================================================
// AREA OF EFFECT
// ==================================================

const aoeOptions = [
  {
    value: "SMALL" as const,
    label: "Small AOE",
    description: "Cost ×1",
    multiplier: 1,
  },
  {
    value: "MODERATE" as const,
    label: "Moderate AOE",
    description: "Cost ×3",
    multiplier: 3,
  },
];

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

export default function DisruptTarget({
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

  const [disruption, setDisruption] = useState(0);

  const [selectedAOE, setSelectedAOE] = useState<AOEType>("SMALL");

  // ==================================================
  // TECHNIQUE STATE
  // ==================================================

  const [spellCharge, setSpellCharge] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);

  const [auraEnergy, setAuraEnergy] = useState<AuraEnergy>("BODY");

  // ==================================================
  // DERIVED VALUES
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const rate = masteryData[mastery].rate;
  const maxDisruption = masteryData[mastery].max;

  const selectedAOEOption = aoeOptions.find(
    (option) => option.value === selectedAOE,
  );

  const aoeMultiplier = selectedAOEOption?.multiplier ?? 1;

  const effectiveDisruption = Math.min(disruption, maxDisruption);

  const cost = Math.round(effectiveDisruption * rate * aoeMultiplier);

  // ==================================================
  // SPELL CHARGE
  // ==================================================

  const spellChargeDamage = spellCharge
    ? Math.floor(effectiveDisruption * 0.2)
    : 0;

  // ==================================================
  // AURA SURGE
  // ==================================================

  const bodyAuraActive = auraSurge && auraEnergy === "BODY";

  const spiritualAuraActive = auraSurge && auraEnergy === "SPIRITUAL";

  const memoryAuraActive = auraSurge && auraEnergy === "MEMORY";

  const auraDamageBonus = bodyAuraActive
    ? Math.floor(effectiveDisruption * 0.2)
    : 0;

  const selectedAuraOption = auraOptions.find(
    (option) => option.value === auraEnergy,
  );

  // ==================================================
  // FINAL STATISTICS
  // ==================================================

  const finalDisruption =
    effectiveDisruption + spellChargeDamage + auraDamageBonus;

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
      setAuraSurge(false);
      setAuraEnergy("BODY");
    }
  }, [active]);

  // ==================================================
  // TECHNIQUE BUTTON STYLES
  // ==================================================

  const techniqueButtonClass = (enabled: boolean) =>
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

        {/* AURA SURGE */}

        <button
          type="button"
          onClick={() => setAuraSurge((prev) => !prev)}
          aria-pressed={auraSurge}
          className={techniqueButtonClass(auraSurge)}
        >
          Aura Surge
        </button>
      </div>

      {/* ================================================== */}
      {/* SPELL CHARGE EFFECT */}
      {/* ================================================== */}

      {spellCharge && (
        <div className="mt-3 rounded-lg border border-cyan-800 bg-cyan-950/30 p-3">
          <p className="text-sm leading-relaxed text-gray-300">
            <strong className="text-cyan-300">Spell Charge:</strong> +20% Damage
            per charge, up to a maximum of +100% Damage.
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
                  name="disrupt-target-aura"
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
      {/* DISRUPTION CALIBRATION */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Disruption Calibration
        </h3>

        <label
          htmlFor="disrupt-target-value"
          className="mb-2 block text-sm text-gray-300"
        >
          Desired Disruption
        </label>

        <input
          id="disrupt-target-value"
          type="number"
          min={0}
          max={maxDisruption}
          value={effectiveDisruption}
          onChange={(e) =>
            setDisruption(
              Math.min(maxDisruption, Math.max(0, Number(e.target.value) || 0)),
            )
          }
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-center text-lg text-cyan-400 focus:border-orange-500 focus:outline-none"
        />

        <p className="mt-4 text-center text-sm text-gray-400">
          Maximum Disruption
        </p>

        <p className="text-center text-xl font-semibold text-cyan-400">
          {maxDisruption}
        </p>
      </div>

      {/* ================================================== */}
      {/* DISRUPTION STATISTICS */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Disruption Statistics
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Damage Type</span>

            <span className="font-semibold text-cyan-400">KINETIC</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Range</span>

            <span className="font-semibold text-cyan-400">CLOUD</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-300">Base Disruption</span>

            <span className="font-semibold text-cyan-400">
              {effectiveDisruption}
            </span>
          </div>

          {spellCharge && (
            <div className="flex justify-between gap-3">
              <span className="text-cyan-300">Spell Charge Damage</span>

              <span className="font-semibold text-cyan-300">
                +{spellChargeDamage}
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
            <span className="font-semibold text-gray-200">
              Current Disruption
            </span>

            <span className="font-semibold text-cyan-400">
              {finalDisruption}
            </span>
          </div>

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-gray-200">Cost</span>

            <span className="font-semibold text-cyan-400">{cost}</span>
          </div>

          {spiritualAuraActive && (
            <p className="border-t border-gray-700 pt-3 text-center text-sm text-purple-300">
              Construct is highly resistant to disruption.
            </p>
          )}

          {memoryAuraActive && (
            <p className="border-t border-gray-700 pt-3 text-center text-sm text-purple-300">
              Construct Vitality increased by 30%.
            </p>
          )}
        </div>
      </div>

      {/* ================================================== */}
      {/* AREA OF EFFECT */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Area of Effect
        </h3>

        <div className="space-y-3">
          {aoeOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-gray-700 bg-gray-900 px-4 py-3 transition hover:border-orange-500"
            >
              <div>
                <p className="font-medium text-gray-100">{option.label}</p>

                <p className="text-sm text-gray-400">{option.description}</p>
              </div>

              <input
                type="radio"
                name="disrupt-target-aoe"
                value={option.value}
                checked={selectedAOE === option.value}
                onChange={() => setSelectedAOE(option.value)}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
