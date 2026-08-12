import React, { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const UsherEthereal = ({
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

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "150 / 100 / 50",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "300 / 250 / 200",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "450 / 400 / 350",
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

    const spellPotency = new Potency();
    let cost = 0;

    switch (selectedPotency) {
      case "MINOR":
        spellPotency.minor();

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 150;
            break;
          case "INTERMEDIATE":
            cost = 100;
            break;
          case "MASTERED":
            cost = 50;
            break;
        }
        break;

      case "MAJOR":
        spellPotency.major();

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 300;
            break;
          case "INTERMEDIATE":
            cost = 250;
            break;
          case "MASTERED":
            cost = 200;
            break;
        }
        break;

      case "EXTREME":
        spellPotency.extreme();

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 450;
            break;
          case "INTERMEDIATE":
            cost = 400;
            break;
          case "MASTERED":
            cost = 350;
            break;
        }
        break;
    }

    updateSpell("cost", cost);
    updateSpell("potency", spellPotency);
  }, [active, ParentMastery, selectedPotency, updateSpell]);

  // ==================================================
  // UI
  // ==================================================

  return (
    <>
      {/* ==================================================
          Spell Properties
          ================================================== */}

      <h2 className="mb-6 text-center text-3xl font-bold text-cyan-400">
        Usher Ethereal
      </h2>

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Properties
        </h3>

        <div className="space-y-2 text-gray-300">
          <p>ETHEREAL</p>
          <p>RANGE - RADIAL</p>
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
          Final Spell Statistics
          ================================================== */}

      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Final Spell Statistics
        </h3>

        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Potency</span>

            <span className="font-semibold text-cyan-400">
              {selectedPotency.charAt(0) +
                selectedPotency.slice(1).toLowerCase()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Mastery</span>

            <span className="font-semibold text-cyan-400">
              {ParentMastery.getType()}
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Cost</span>

            <span className="font-semibold text-cyan-400">
              {/* Cost is calculated by the spell logic above */}
              {(() => {
                const mastery = ParentMastery.getType();

                const costs = {
                  NOVICE: {
                    MINOR: 150,
                    MAJOR: 300,
                    EXTREME: 450,
                  },
                  INTERMEDIATE: {
                    MINOR: 100,
                    MAJOR: 250,
                    EXTREME: 400,
                  },
                  MASTERED: {
                    MINOR: 50,
                    MAJOR: 200,
                    EXTREME: 350,
                  },
                };

                return (
                  costs[mastery as keyof typeof costs]?.[selectedPotency] ?? 0
                );
              })()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsherEthereal;
