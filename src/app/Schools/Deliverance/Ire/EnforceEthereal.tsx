import React, { useEffect, useState } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const EnforceEthereal = ({
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
      description: "900 / 600 / 300",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "5400 / 3600 / 1800",
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

    let cost = 0;

    switch (selectedPotency) {
      case "MINOR":
        spellPotency.minor();

        if (mastery === "NOVICE") cost = 150;
        if (mastery === "INTERMEDIATE") cost = 100;
        if (mastery === "MASTERED") cost = 50;
        break;

      case "MAJOR":
        spellPotency.major();

        if (mastery === "NOVICE") cost = 900;
        if (mastery === "INTERMEDIATE") cost = 600;
        if (mastery === "MASTERED") cost = 300;
        break;

      case "EXTREME":
        spellPotency.extreme();

        if (mastery === "NOVICE") cost = 5400;
        if (mastery === "INTERMEDIATE") cost = 3600;
        if (mastery === "MASTERED") cost = 1800;
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
      <h2 className="mb-6 text-center text-3xl font-bold text-cyan-400">
        Enforce Ethereal
      </h2>

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
          Information
          ================================================== */}

      <div className="mt-6 space-y-4 text-gray-300">
        <p>
          Reinforces an ethereal target, with the potency determining the
          strength and base manna cost of the effect.
        </p>
      </div>
    </>
  );
};

export default EnforceEthereal;
