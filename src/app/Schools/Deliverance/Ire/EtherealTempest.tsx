import React, { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const EtherealTempest = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [largeAOE, setLargeAOE] = useState(false);

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "200 / 150 / 100",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "320 / 240 / 160",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "440 / 330 / 220",
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
    const spellPotency = new Potency();

    let baseCost = 0;

    switch (selectedPotency) {
      case "MINOR":
        spellPotency.minor();

        if (mastery === "NOVICE") baseCost = 200;
        if (mastery === "INTERMEDIATE") baseCost = 150;
        if (mastery === "MASTERED") baseCost = 100;
        break;

      case "MAJOR":
        spellPotency.major();

        if (mastery === "NOVICE") baseCost = 320;
        if (mastery === "INTERMEDIATE") baseCost = 240;
        if (mastery === "MASTERED") baseCost = 160;
        break;

      case "EXTREME":
        spellPotency.extreme();

        if (mastery === "NOVICE") baseCost = 440;
        if (mastery === "INTERMEDIATE") baseCost = 330;
        if (mastery === "MASTERED") baseCost = 220;
        break;
    }

    const finalCost = baseCost * (largeAOE ? 1.5 : 1);

    updateSpell("cost", finalCost);
    updateSpell("potency", spellPotency);
  }, [active, ParentMastery, selectedPotency, largeAOE, updateSpell]);

  // ==================================================
  // UI
  // ==================================================

  return (
    <>
      <h2 className="mb-6 text-center text-3xl font-bold text-cyan-400">
        Ethereal Tempest
      </h2>

      {/* ==================================================
          Spell Properties
          ================================================== */}

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Properties
        </h3>

        <div className="space-y-2 text-gray-300">
          <p>KINETIC - DAMAGE</p>
          <p>RANGE - RADIAL</p>
          <p>Power: 7</p>
          <p>Scaling: 0 / 20%</p>
        </div>
      </div>

      {/* ==================================================
          Potency
          ================================================== */}

      <div className="mt-6">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* ==================================================
          Range
          ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Range
        </h3>

        <label className="flex cursor-pointer items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-4 py-3">
          <div>
            <p className="font-medium text-gray-100">Large AOE</p>

            <p className="text-sm text-gray-400">
              Increase range from Moderate AOE to Large AOE. Cost × 1.5
            </p>
          </div>

          <input
            type="checkbox"
            checked={largeAOE}
            onChange={(e) => setLargeAOE(e.target.checked)}
            className="h-5 w-5 accent-orange-500"
          />
        </label>
      </div>

      {/* ==================================================
          Final Statistics
          ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h3>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">
              {selectedPotency}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Range</span>

            <span className="font-semibold text-cyan-400">
              {largeAOE ? "Large AOE" : "Moderate AOE"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Power</span>

            <span className="font-semibold text-cyan-400">7</span>
          </div>

          <div className="flex justify-between">
            <span>Scaling</span>

            <span className="font-semibold text-cyan-400">0 / 20%</span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Cost</span>

            <span className="font-semibold text-cyan-400">
              {/* Cost is maintained by Spell through updateSpell */}
              {/* The UI can display the selected potency/range here if
                  cost is also exposed from the parent. */}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default EtherealTempest;
