"use client";

import React, { useEffect, useState } from "react";

import { Mastery, Potency, Spell } from "@/app/models";
import { elements } from "./ConjurationData";
import SpellTechniquesTable from "@/app/SpellCreation/SpellTechTable";
import PotencySelector from "@/app/PotencyDisplay";

import {
  FireIcon,
  BeakerIcon,
  PaperAirplaneIcon,
  BoltIcon,
} from "@heroicons/react/24/solid";

// ==================================================
// TYPES
// ==================================================

type MasteryType = "NOVICE" | "INTERMEDIATE" | "MASTERED";
type PotencyType = "MINOR" | "MAJOR" | "EXTREME";

export const elementOptions = [
  "Heat & Cold",
  "Earth & Water",
  "Wind",
  "Lightning",
] as const;

export type ElementType = (typeof elementOptions)[number];

type ConjureElementProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

// ==================================================
// SPELL TECHNIQUES
// ==================================================

const Techniques = {
  "Quick Spell": true,
  "Spell Reflex": false,
  "Double Cast": true,
  "Double Pulse": true,
  "Soul Cast": false,
  "Full Cast": false,
  "Counter Spell": true,
  "Spell Surge": true,
  "Junction Cast": true,
  "Spell Charge": true,
  "Focus Spell": true,
  "Hyper Spell": true,
  "Auto Cast": false,
  "Rivet Cast": true,
  "Spell Recovery": false,
  "Aura Surge": true,
};

// ==================================================
// POTENCY DATA
// ==================================================

const POTENCY_STATS = {
  MINOR: {
    label: "Minor",
    base: 12,
    power: 0,
    roll: 6,
    costs: {
      NOVICE: 75,
      INTERMEDIATE: 50,
      MASTERED: 25,
    },
  },

  MAJOR: {
    label: "Major",
    base: 20,
    power: 1,
    roll: 10,
    costs: {
      NOVICE: 105,
      INTERMEDIATE: 70,
      MASTERED: 35,
    },
  },

  EXTREME: {
    label: "Extreme",
    base: 28,
    power: 2,
    roll: 14,
    costs: {
      NOVICE: 135,
      INTERMEDIATE: 90,
      MASTERED: 45,
    },
  },
} as const;

// ==================================================
// AOE DATA
// ==================================================

const AOES = ["None", "Small", "Moderate", "Large"] as const;

// ==================================================
// ELEMENT STYLES
// ==================================================

const elementIcons: Record<ElementType, React.ElementType> = {
  "Heat & Cold": FireIcon,
  "Earth & Water": BeakerIcon,
  Wind: PaperAirplaneIcon,
  Lightning: BoltIcon,
};

const elementTheme: Record<
  ElementType,
  {
    base: string;
    border: string;
    glow: string;
    bg: string;
  }
> = {
  "Heat & Cold": {
    base: "text-orange-400",
    border: "border-orange-400",
    glow: "shadow-orange-500/30",
    bg: "bg-orange-500/10",
  },

  "Earth & Water": {
    base: "text-blue-400",
    border: "border-blue-400",
    glow: "shadow-blue-500/30",
    bg: "bg-blue-500/10",
  },

  Wind: {
    base: "text-green-400",
    border: "border-green-400",
    glow: "shadow-green-500/30",
    bg: "bg-green-500/10",
  },

  Lightning: {
    base: "text-yellow-300",
    border: "border-yellow-300",
    glow: "shadow-yellow-400/30",
    bg: "bg-yellow-500/10",
  },
};

// ==================================================
// COMPONENT
// ==================================================

export default function ConjureElement({
  ParentMastery,
  active,
  updateSpell,
}: ConjureElementProps) {
  // ==================================================
  // STATE
  // ==================================================

  const [selectedPotency, setSelectedPotency] = useState<PotencyType>("MINOR");

  const [intensity, setIntensity] = useState(0);

  const [selectedElement, setSelectedElement] =
    useState<ElementType>("Heat & Cold");

  // ==================================================
  // TECHNIQUE STATE
  // ==================================================

  const [spellCharge, setSpellCharge] = useState(false);
  const [spellSurge, setSpellSurge] = useState(false);
  const [hyperSpell, setHyperSpell] = useState(false);
  const [auraSurge, setAuraSurge] = useState(false);

  // ==================================================
  // POTENCY OPTIONS
  // ==================================================

  const potencyOptions = (Object.keys(POTENCY_STATS) as PotencyType[]).map(
    (key) => {
      const stats = POTENCY_STATS[key];

      return {
        value: key,
        label: stats.label,
        description: `${stats.costs.NOVICE} / ${stats.costs.INTERMEDIATE} / ${stats.costs.MASTERED}`,
      };
    },
  );

  // ==================================================
  // DERIVED VALUES
  // ==================================================

  const mastery = ParentMastery.getType() as MasteryType;

  const stats = POTENCY_STATS[selectedPotency];
  const selectedData = elements[selectedElement];

  // ==================================================
  // POWER
  // ==================================================

  const basePower = stats.power + (intensity > 0 ? 1 : 0);

  const spellChargePower = spellCharge ? 1 : 0;

  const spellPower = basePower + spellChargePower;

  // ==================================================
  // DAMAGE
  // ==================================================

  const baseDamage = stats.base * (1 + intensity);

  const hyperSpellDamage = hyperSpell ? Math.floor(baseDamage * 0.3) : 0;

  const auraDamage = auraSurge ? Math.floor(baseDamage * 0.3) : 0;

  const finalDamage = baseDamage + hyperSpellDamage + auraDamage;

  // ==================================================
  // AREA OF EFFECT
  // ==================================================

  const baseAOEIndex = intensity;

  const finalAOEIndex = Math.min(
    baseAOEIndex + (auraSurge ? 1 : 0),
    AOES.length - 1,
  );

  const baseAOE = AOES[baseAOEIndex];
  const finalAOE = AOES[finalAOEIndex];

  // ==================================================
  // COST
  // ==================================================

  const baseCost = stats.costs[mastery] * 2 ** intensity;

  const auraExtraCost = auraSurge ? baseCost : 0;

  const finalCost = baseCost + auraExtraCost;

  // ==================================================
  // SPELL CHARGE
  // ==================================================

  const requiredCharges = intensity + 1;

  // ==================================================
  // SPELL SURGE
  // ==================================================

  const spellSurgeReduction = Math.trunc(baseCost * 0.15);

  const minimumSurgeCost = Math.trunc(baseCost * 0.25);

  // ==================================================
  // SPELL UPDATES
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("base", 0);
      updateSpell("cost", 0);
      updateSpell("ttt", 0);
      return;
    }

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
    updateSpell("base", finalDamage);
    updateSpell("cost", finalCost);
    updateSpell("ttt", 0);
  }, [active, selectedPotency, finalDamage, finalCost, updateSpell]);

  // ==================================================
  // RESET ON DEACTIVATE
  // ==================================================

  useEffect(() => {
    if (active) return;

    setSelectedPotency("MINOR");
    setSelectedElement("Heat & Cold");
    setIntensity(0);

    setSpellCharge(false);
    setSpellSurge(false);
    setHyperSpell(false);
    setAuraSurge(false);
  }, [active]);

  // ==================================================
  // BUTTON STYLES
  // ==================================================

  const techniqueButtonClass = (
    enabled: boolean,
    color: "cyan" | "red" | "purple",
  ) => {
    if (!enabled) {
      return "rounded-md border border-gray-600 bg-gray-900 px-3 py-1.5 text-xs font-semibold text-gray-400 transition hover:border-gray-400";
    }

    const colors = {
      cyan: "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]",
      red: "border-red-400 bg-red-500/10 text-red-300 shadow-[0_0_12px_rgba(248,113,113,0.5)]",
      purple:
        "border-purple-400 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.5)]",
    };

    return `rounded-md border px-3 py-1.5 text-xs font-semibold transition ${colors[color]}`;
  };

  // ==================================================
  // RENDER
  // ==================================================

  if (!active) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* ================================================== */}
      {/* SPELL TECHNIQUES */}
      {/* ================================================== */}

      <SpellTechniquesTable techniques={Techniques} />

      {/* ================================================== */}
      {/* TECHNIQUE BUTTONS */}
      {/* ================================================== */}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSpellCharge((prev) => !prev)}
          aria-pressed={spellCharge}
          className={techniqueButtonClass(spellCharge, "cyan")}
        >
          Spell Charge
        </button>

        <button
          type="button"
          onClick={() => setSpellSurge((prev) => !prev)}
          aria-pressed={spellSurge}
          className={techniqueButtonClass(spellSurge, "red")}
        >
          Spell Surge
        </button>

        <button
          type="button"
          onClick={() => setHyperSpell((prev) => !prev)}
          aria-pressed={hyperSpell}
          className={techniqueButtonClass(hyperSpell, "purple")}
        >
          Hyper Spell
        </button>

        <button
          type="button"
          onClick={() => setAuraSurge((prev) => !prev)}
          aria-pressed={auraSurge}
          className={techniqueButtonClass(auraSurge, "purple")}
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
            <strong className="text-cyan-300">Spell Charge:</strong>{" "}
            {requiredCharges} {requiredCharges === 1 ? "Charge" : "Charges"}{" "}
            Required.
          </p>
        </div>
      )}

      {spellSurge && (
        <div className="mt-3 rounded-lg border border-red-800 bg-red-950/20 p-3">
          <p className="text-sm text-gray-300">
            <strong className="text-red-300">Spell Surge:</strong> Reduce Cost
            by{" "}
            <span className="font-semibold text-red-300">
              {spellSurgeReduction}
            </span>
            .
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Minimum Cost: {minimumSurgeCost} (75% maximum reduction).
          </p>
        </div>
      )}

      {hyperSpell && (
        <div className="mt-3 rounded-lg border border-purple-800 bg-purple-950/30 p-3">
          <p className="text-sm text-gray-300">
            <strong className="text-purple-300">Hyper Spell:</strong> +30%
            Damage.
          </p>
        </div>
      )}

      {/* ================================================== */}
      {/* AURA SURGE EFFECT */}
      {/* ================================================== */}

      {auraSurge && (
        <div className="mt-3 rounded-lg border border-purple-800 bg-purple-950/30 p-4">
          <h3 className="mb-3 font-semibold text-purple-300">
            Aura Surge — Body Energy
          </h3>

          <p className="text-sm leading-relaxed text-gray-300">
            While channeling{" "}
            <span className="font-semibold text-purple-300">BODY ENERGY</span>,
            Conjure Element receives{" "}
            <span className="font-semibold text-cyan-300">+30% Damage</span> and{" "}
            <span className="font-semibold text-cyan-300">+1 AOE Level</span> at
            the cost of{" "}
            <span className="font-semibold text-purple-300">+100% Manna</span>.
          </p>

          <p className="mt-3 text-sm italic text-gray-400">
            Casting requirement: The caster's Power must be greater than the
            Conjure Element spell's Power. This requirement is evaluated during
            casting.
          </p>
        </div>
      )}

      {/* ================================================== */}
      {/* SPELL TITLE */}
      {/* ================================================== */}

      <h2 className="mb-6 mt-6 border-b border-gray-700 pb-2 text-2xl font-bold text-orange-400">
        Conjure Element
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
      {/* ELEMENT SELECTOR */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Element
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {elementOptions.map((element) => {
            const theme = elementTheme[element];
            const Icon = elementIcons[element];
            const isSelected = selectedElement === element;

            return (
              <label
                key={element}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border p-4 transition ${
                  isSelected
                    ? `${theme.border} ${theme.bg} ${theme.glow}`
                    : "border-gray-700 bg-gray-900 hover:border-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="conjure-element"
                  value={element}
                  checked={isSelected}
                  onChange={() => setSelectedElement(element)}
                  className="sr-only"
                />

                <Icon
                  className={`h-6 w-6 ${
                    isSelected ? theme.base : "text-gray-500"
                  }`}
                />

                <span
                  className={`text-sm font-semibold ${
                    isSelected ? theme.base : "text-gray-200"
                  }`}
                >
                  {element}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ================================================== */}
      {/* INTENSITY */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Intensity
        </h3>

        <p className="mb-4 text-sm text-gray-400">
          Each level increases base Damage by 100% and doubles Cost.
        </p>

        <div className="mb-2 flex justify-between text-xs text-gray-400">
          <span>0</span>
          <span>1</span>
          <span>2</span>
        </div>

        <input
          type="range"
          min={0}
          max={2}
          step={1}
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full cursor-pointer accent-cyan-500"
        />
      </div>

      {/* ================================================== */}
      {/* ELEMENT STATISTICS */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5">
        <h3 className="mb-4 border-b border-gray-700 pb-2 text-xl font-bold text-cyan-300">
          {selectedElement}
        </h3>

        <div className="space-y-3">
          {/* DAMAGE */}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-orange-400">Base Damage</span>

            <span className="font-semibold text-cyan-400">{baseDamage}</span>
          </div>

          {hyperSpell && (
            <div className="flex justify-between gap-3">
              <span className="text-purple-300">Hyper Spell Damage</span>

              <span className="font-semibold text-purple-300">
                +{hyperSpellDamage}
              </span>
            </div>
          )}

          {auraSurge && (
            <div className="flex justify-between gap-3">
              <span className="text-purple-300">Aura Surge Damage</span>

              <span className="font-semibold text-purple-300">
                +{auraDamage}
              </span>
            </div>
          )}

          <div className="flex justify-between gap-3 border-t border-gray-700 pt-3">
            <span className="font-semibold text-orange-400">Final Damage</span>

            <span className="font-semibold text-cyan-400">{finalDamage}</span>
          </div>

          {/* ROLL */}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-orange-400">Roll</span>

            <span className="text-gray-200">{stats.roll}</span>
          </div>

          {/* POWER */}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-orange-400">Power</span>

            <span className="font-semibold text-cyan-400">
              {spellPower}

              {spellCharge && (
                <span className="ml-2 text-cyan-300">(+1 Spell Charge)</span>
              )}
            </span>
          </div>

          {/* AOE */}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-orange-400">AOE</span>

            <span className="font-semibold text-cyan-400">
              {finalAOE}

              {auraSurge && (
                <span className="ml-2 text-purple-300">({baseAOE} +1)</span>
              )}
            </span>
          </div>

          {/* RANGE */}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-orange-400">Range</span>

            <span className="text-gray-200">{selectedData.range}</span>
          </div>

          {/* EMANATES */}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-orange-400">Emanates</span>

            <span className="text-gray-200">{selectedData.emanates}</span>
          </div>

          {/* COST */}

          <div className="border-t border-gray-700 pt-3">
            <div className="flex justify-between gap-3">
              <span className="font-semibold text-orange-400">Base Cost</span>

              <span className="font-semibold text-cyan-400">{baseCost}</span>
            </div>
          </div>

          {auraSurge && (
            <div className="flex justify-between gap-3">
              <span className="text-purple-300">Aura Surge Manna</span>

              <span className="font-semibold text-purple-300">
                +{auraExtraCost}
              </span>
            </div>
          )}

          <div className="flex justify-between gap-3">
            <span className="font-semibold text-orange-400">Final Cost</span>

            <span className="font-semibold text-cyan-400">{finalCost}</span>
          </div>

          {/* EFFECTS */}

          <div className="border-t border-gray-700 pt-3">
            <h4 className="mb-2 font-semibold text-orange-400">Effects</h4>

            <ul className="list-disc space-y-2 pl-5 text-gray-300">
              {selectedData.effect.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
