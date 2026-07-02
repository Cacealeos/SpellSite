import React, { useState, useEffect } from "react";
import { Mastery } from "../../../models/Mastery";
import { Potency } from "@/app/models/Potency";
import { elements } from "./ConjurationData";
import { Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";
import {
  FireIcon,
  BeakerIcon,
  PaperAirplaneIcon,
  BoltIcon,
} from "@heroicons/react/24/solid";

export const elementOptions = [
  "Heat & Cold",
  "Earth & Water",
  "Wind",
  "Lightning",
] as const;

/**
 * Derived union type of valid element keys.
 */
export type ElementType = (typeof elementOptions)[number];

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

type ConjureElementProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const ConjureElement = ({
  ParentMastery,
  active,
  updateSpell,
}: ConjureElementProps) => {
  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [intensity, setIntensity] = useState<number>(0);
  const [selectedElement, setSelectedElement] =
    useState<ElementType>("Heat & Cold");

  /* =========================
     ELEMENT DATA
  ========================= */

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
      hover: string;
    }
  > = {
    "Heat & Cold": {
      base: "text-orange-400",
      border: "border-orange-400",
      glow: "shadow-orange-500/30",
      bg: "bg-orange-500/10",
      hover: "hover:border-orange-300",
    },
    "Earth & Water": {
      base: "text-blue-400",
      border: "border-blue-400",
      glow: "shadow-blue-500/30",
      bg: "bg-blue-500/10",
      hover: "hover:border-blue-300",
    },
    Wind: {
      base: "text-green-400",
      border: "border-green-400",
      glow: "shadow-green-500/30",
      bg: "bg-green-500/10",
      hover: "hover:border-green-300",
    },
    Lightning: {
      base: "text-yellow-300",
      border: "border-yellow-300",
      glow: "shadow-yellow-400/30",
      bg: "bg-yellow-500/10",
      hover: "hover:border-yellow-200",
    },
  };

  const selectedData = elements[selectedElement];

  /* =========================
     RESET ON DEACTIVATE
  ========================= */

  useEffect(() => {
    if (active) return;

    setSelectedPotency("MINOR");
    setSelectedElement("Heat & Cold");
    setIntensity(0);
  }, [active]);

  /* =========================
     POTENCY SYNC EFFECT
  ========================= */

  useEffect(() => {
    if (!active) return;

    const pot = new Potency();

    const potencyMethod = {
      MINOR: () => pot.minor(),
      MAJOR: () => pot.major(),
      EXTREME: () => pot.extreme(),
    } as const;

    potencyMethod[selectedPotency]();

    const stats = POTENCY_STATS[selectedPotency];
    const mastery =
      ParentMastery.getType() as keyof POTENCY_STATS["MINOR"]["costs"];
    const base = stats.base * (1 + intensity);
    const cost = stats.costs[mastery] * 2 ** intensity;

    updateSpell("potency", pot);
    updateSpell("base", base);
    updateSpell("cost", cost);
    updateSpell("ttt", 0);
  }, [active, selectedPotency, intensity, ParentMastery, updateSpell]);

  /* =========================
     DERIVED UI VALUES
  ========================= */

  /**
   * Builds the UI options for the potency selector dynamically from POTENCY_STATS.
   *
   * We derive this instead of hardcoding values so that:
   * - Labels stay consistent with the central potency definition
   * - Cost descriptions always reflect actual mastery scaling
   * - Adding/removing potency tiers only requires updating POTENCY_STATS
   *
   * Object.keys is typed via keyof to preserve TypeScript safety.
   */

  const potencyOptions = (
    Object.keys(POTENCY_STATS) as Array<keyof typeof POTENCY_STATS>
  ).map((key) => {
    const stats = POTENCY_STATS[key];

    return {
      value: key,
      label: stats.label,
      description: `${stats.costs.NOVICE} / ${stats.costs.INTERMEDIATE} / ${stats.costs.MASTERED}`,
    };
  });

  const AOES = ["None", "Small", "Moderate"] as const;

  const aoeLevel = AOES[intensity];

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
      {/* =========================
        POTENCY
    ========================= */}
      <PotencySelector
        options={potencyOptions}
        selectedPotency={selectedPotency}
        setSelectedPotency={setSelectedPotency}
      />

      {/* =========================
        ELEMENT SELECTOR
    ========================= */}
      <div className="mt-6 border-t border-gray-700 pt-6">
        <h2 className="mb-4 text-xl font-bold text-orange-400">Element</h2>

        <div className="grid grid-cols-2 gap-3">
          {elementOptions.map((element) => {
            const theme = elementTheme[element];
            const Icon = elementIcons[element];
            const isSelected = selectedElement === element;

            return (
              <label
                key={element}
                className={`
                flex flex-col items-center justify-center gap-2
                cursor-pointer rounded-lg border p-4 transition
                ${
                  isSelected
                    ? `${theme.border} ${theme.bg} ${theme.glow}`
                    : "border-gray-700 bg-gray-800 hover:border-gray-600"
                }
              `}
              >
                <input
                  type="radio"
                  name="element"
                  value={element}
                  checked={isSelected}
                  onChange={() => setSelectedElement(element)}
                  className="sr-only"
                />

                <Icon
                  className={`h-6 w-6 transition ${
                    isSelected ? theme.base : "text-gray-500"
                  }`}
                />

                <span
                  className={`text-sm font-semibold transition ${
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

      {/* =========================
        INTENSITY
    ========================= */}
      <div className="mt-8 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-200">Intensity</h3>

          <p className="mt-2 text-sm text-gray-400">
            Each level increases base damage by 100% and doubles cost.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between px-1 text-xs text-gray-400">
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
      </div>

      {/* =========================
        ELEMENT STATS CARD
    ========================= */}
      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5">
        <h3 className="mb-4 text-xl font-bold text-cyan-300">
          {selectedElement}
        </h3>

        <div className="space-y-3">
          <div className="flex">
            <span className="w-28 font-semibold text-orange-400">Damage</span>
            <span>
              {selectedData.damage}{" "}
              <span className="text-gray-400">
                ({POTENCY_STATS[selectedPotency].base * (1 + intensity)})
              </span>
            </span>
          </div>
          <div className="flex">
            <span className="w-28 font-semibold text-orange-400">Roll</span>
            <span>{POTENCY_STATS[selectedPotency].roll}</span>
          </div>

          <div className="flex">
            <span className="w-28 font-semibold text-orange-400">Power</span>
            <span>
              {POTENCY_STATS[selectedPotency].power + (intensity > 0 ? 1 : 0)}
            </span>
          </div>

          <div className="flex">
            <span className="w-28 font-semibold text-orange-400">AoE</span>
            <span>{aoeLevel}</span>
          </div>

          <div className="flex">
            <span className="w-28 font-semibold text-orange-400">Range</span>
            <span>{selectedData.range}</span>
          </div>

          <div className="flex">
            <span className="w-28 font-semibold text-orange-400">Emanates</span>
            <span>{selectedData.emanates}</span>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h4 className="mb-2 font-semibold text-orange-400">Effects</h4>

            <ul className="list-disc space-y-2 pl-5 text-gray-300">
              {selectedData.effect.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConjureElement;
