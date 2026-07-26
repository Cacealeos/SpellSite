import { useEffect, useState } from "react";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const ResonateSpell = ({
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

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "35 / 20 / 5",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "100 / 75 / 50",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "200 / 160 / 120",
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
        NOVICE: 35,
        INTERMEDIATE: 20,
        MASTERED: 5,
      },
      MAJOR: {
        NOVICE: 100,
        INTERMEDIATE: 75,
        MASTERED: 50,
      },
      EXTREME: {
        NOVICE: 200,
        INTERMEDIATE: 160,
        MASTERED: 120,
      },
    };

    const cost =
      costs[selectedPotency][mastery as "NOVICE" | "INTERMEDIATE" | "MASTERED"];

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
  }, [active, ParentMastery, selectedPotency, updateSpell]);

  // ==================================================
  // Render
  // ==================================================

  return (
    <>
      <PotencySelector
        options={potencyOptions}
        selectedPotency={selectedPotency}
        setSelectedPotency={setSelectedPotency}
      />

      <div className="mt-6 space-y-4 text-gray-300">
        <p>Sends transmissions as manna fluctuations across large distances.</p>

        <p>
          Sending a signal reveals the caster's position if receivers are
          present to intercept it.
        </p>

        <p>
          Potency scales with signal strength and resilience. Stronger signals
          are easier to detect, while resilient signals resist scrambling.
        </p>
      </div>
    </>
  );
};

export default ResonateSpell;
