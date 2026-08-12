import React, { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const InveighEthereal = ({
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

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "40",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "60",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "80",
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
        cost = 40;
        break;

      case "MAJOR":
        spellPotency.major();
        cost = 60;
        break;

      case "EXTREME":
        spellPotency.extreme();
        cost = 80;
        break;
    }

    updateSpell("cost", cost);
    updateSpell("potency", spellPotency);
  }, [active, selectedPotency, updateSpell]);

  // ==================================================
  // UI
  // ==================================================

  return (
    <>
      {/* ==================================================
          Spell Properties
          ================================================== */}

      <h2 className="mb-6 text-center text-3xl font-bold text-cyan-400">
        Inveigh Ethereal
      </h2>

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Spell Properties
        </h3>

        <div className="space-y-2 text-gray-300">
          <p>Potency Based</p>
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

          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span>Cost</span>

            <span className="font-semibold text-cyan-400">
              {selectedPotency === "MINOR"
                ? 40
                : selectedPotency === "MAJOR"
                  ? 60
                  : 80}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default InveighEthereal;
