import { useEffect, useState } from "react";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const ScrambleSig = ({
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

  const [selectedAOE, setSelectedAOE] = useState<
    "MODERATE" | "LARGE" | "MASSIVE"
  >("LARGE");

  const [hyperSpell, setHyperSpell] = useState(false);

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "150 / 120 / 100",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "300 / 240 / 180",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "600 / 480 / 360",
    },
  ];

  // ==================================================
  // AOE Modifiers
  // ==================================================

  const aoeOptions = [
    {
      value: "MODERATE" as const,
      label: "Moderate AOE",
      description: "Cost -50%",
    },
    {
      value: "LARGE" as const,
      label: "Large AOE",
      description: "No cost modifier",
    },
    {
      value: "MASSIVE" as const,
      label: "Massive AOE",
      description: "Cost +200%",
    },
  ];

  // ==================================================
  // Spell Calculation
  // ==================================================

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    const mastery = ParentMastery.getType();

    const costs = {
      MINOR: {
        NOVICE: 150,
        INTERMEDIATE: 120,
        MASTERED: 100,
      },
      MAJOR: {
        NOVICE: 300,
        INTERMEDIATE: 240,
        MASTERED: 180,
      },
      EXTREME: {
        NOVICE: 600,
        INTERMEDIATE: 480,
        MASTERED: 360,
      },
    };

    const aoeMultipliers = {
      MODERATE: 0.5,
      LARGE: 1,
      MASSIVE: 3,
    };

    const baseCost =
      costs[selectedPotency][mastery as "NOVICE" | "INTERMEDIATE" | "MASTERED"];

    const cost = Math.round(baseCost * aoeMultipliers[selectedAOE]);

    updateSpell("cost", cost);

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
  }, [active, ParentMastery, selectedPotency, selectedAOE, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      {/* ================================================== */}
      {/* Potency */}
      {/* ================================================== */}

      <PotencySelector
        options={potencyOptions}
        selectedPotency={selectedPotency}
        setSelectedPotency={setSelectedPotency}
      />

      {/* ================================================== */}
      {/* Area of Effect */}
      {/* ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <div className="mb-3 flex items-center justify-between border-b border-gray-700 pb-2">
          <h3 className="text-lg font-semibold text-orange-400">
            Area of Effect
          </h3>

          {/* Hyper Spell */}
          <button
            type="button"
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

        <div className="space-y-3">
          {aoeOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-4 py-3 hover:border-orange-500"
            >
              <div>
                <p className="font-medium text-gray-100">{option.label}</p>
                <p className="text-sm text-gray-400">{option.description}</p>
              </div>

              <input
                type="radio"
                name="aoe"
                checked={selectedAOE === option.value}
                onChange={() => setSelectedAOE(option.value)}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          ))}
        </div>

        {/* Hyper Spell Effect */}
        {hyperSpell && (
          <p className="mt-4 border-t border-gray-700 pt-3 text-sm text-purple-300">
            Applies <span className="font-semibold">SELECTIVE AOE</span> in
            addition to the selected AOE.
          </p>
        )}
      </div>

      {/* ================================================== */}
      {/* Description */}
      {/* ================================================== */}

      <div className="mt-6 space-y-4 text-gray-300">
        <p>
          Damages and terminates all transmissions through Resonance and
          manna-based mental communication within the selected area until
          repaired.
        </p>

        <p>Potency scales with the extent of disruption caused.</p>
      </div>
    </>
  );
};

export default ScrambleSig;
