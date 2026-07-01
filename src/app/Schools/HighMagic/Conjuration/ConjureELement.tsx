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

  /* =========================================================
   1. STATIC CONFIGURATION (UI + DATA MAPS)
   ========================================================= */

  /**
   * Available element choices for this spell.
   * Kept as a const tuple so TypeScript can infer strict union types.
   */

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
      base: "text-green-400", // changed from cyan → green
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

  /**
   * Cost table:
   * Maps Mastery tier + Potency tier → base cost.
   */
  const COSTS = {
    NOVICE: {
      MINOR: 75,
      MAJOR: 105,
      EXTREME: 135,
    },
    INTERMEDIATE: {
      MINOR: 50,
      MAJOR: 70,
      EXTREME: 90,
    },
    MASTERED: {
      MINOR: 25,
      MAJOR: 35,
      EXTREME: 45,
    },
  } as const;

  /**
   * Helper for safe cost lookup.
   * Centralizes indexing logic so component stays readable.
   */
  const getCost = (
    mastery: keyof typeof COSTS,
    potency: keyof (typeof COSTS)["NOVICE"],
  ) => COSTS[mastery][potency];

  /**
   * Potency selector configuration for UI rendering.
   */
  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "75 / 50 / 25",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "105 / 70 / 35",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "135 / 90 / 45",
    },
  ];

  /* =========================================================
   2. COMPONENT STATE (USER SELECTIONS)
   ========================================================= */

  /**
   * Currently selected element (drives UI + spell output).
   */
  const [selectedElement, setSelectedElement] =
    useState<ElementType>("Heat & Cold");

  /**
   * Currently selected potency tier.
   */

  /**
   * Derived element data used for rendering stats panel.
   */
  const selectedData = elements[selectedElement];

  /* =========================================================
   3. RESET EFFECT (WHEN SPELL DEACTIVATES)
   ========================================================= */

  /**
   * When the spell becomes inactive:
   * reset UI state back to defaults.
   */
  useEffect(() => {
    if (active) return;

    setSelectedPotency("MINOR");
    setSelectedElement("Heat & Cold");
  }, [active]);

  /* =========================================================
   4. SPELL SYNCHRONIZATION EFFECT
   (SYNC LOCAL UI → GLOBAL SPELL STATE)
   ========================================================= */

  useEffect(() => {
    if (!active) return;

    /* ---------------------------------------------
     4.1 Build Potency instance from selection
     --------------------------------------------- */
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

    /* ---------------------------------------------
     4.2 Resolve mastery + cost calculation
     --------------------------------------------- */
    const mastery = ParentMastery.getType() as keyof typeof COSTS;

    const cost = getCost(mastery, selectedPotency);

    /* ---------------------------------------------
     4.3 Push updates to parent Spell model
     --------------------------------------------- */
    updateSpell("potency", pot);
    updateSpell("cost", cost);

    /**
     * This spell does not generate TTT.
     * Always explicitly reset to avoid stale state.
     */
    updateSpell("ttt", 0);
  }, [active, selectedPotency, ParentMastery, updateSpell]);

  /* =========================================================
   5. RUNTIME DERIVED DATA
   ========================================================= */

  return (
    <>
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-200 shadow-lg">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
        {/*
Element Selector UI
*/}

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
            cursor-pointer
            rounded-lg
            border
            p-4
            transition
            ${
              selectedElement === element
                ? "border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/20"
                : "border-gray-700 bg-gray-800 hover:border-cyan-500"
            }
          `}
                >
                  <input
                    type="radio"
                    name="element"
                    value={element}
                    checked={selectedElement === element}
                    onChange={() => setSelectedElement(element)}
                    className="sr-only"
                  />

                  <Icon
                    className={`
    h-6 w-6 transition
    ${isSelected ? theme.base : "text-gray-500"}
  `}
                  />
                  <span
                    className={`
    text-sm font-semibold transition
    ${isSelected ? theme.base : "text-gray-200"}
  `}
                  >
                    {element}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5">
          <h3 className="mb-4 text-xl font-bold text-cyan-300">
            {selectedElement}
          </h3>

          <div className="space-y-3">
            <div className="flex">
              <span className="w-28 font-semibold text-orange-400">Damage</span>
              <span>{selectedData.damage}</span>
            </div>

            <div className="flex">
              <span className="w-28 font-semibold text-orange-400">Range</span>
              <span>{selectedData.range}</span>
            </div>

            <div className="flex">
              <span className="w-28 font-semibold text-orange-400">
                Emanates
              </span>
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
    </>
  );
};

export default ConjureElement;
