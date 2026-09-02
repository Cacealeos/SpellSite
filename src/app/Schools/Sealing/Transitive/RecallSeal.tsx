import { useEffect, useState } from "react";

import { Mastery, Spell } from "@/app/models";
import { Potency } from "@/app/models/Potency";
import PotencySelector from "@/app/PotencyDisplay";

type RecallSealProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

export default function RecallSeal({
  ParentMastery,
  active,
  updateSpell,
}: RecallSealProps) {
  const [pot, setPot] = useState<Potency>(new Potency());

  const mastery = ParentMastery.getType();

  const potencyCosts = {
    MINOR: mastery === "NOVICE" ? 40 : mastery === "INTERMEDIATE" ? 30 : 20,
    MAJOR: mastery === "NOVICE" ? 70 : mastery === "INTERMEDIATE" ? 60 : 50,
    EXTREME: mastery === "NOVICE" ? 100 : mastery === "INTERMEDIATE" ? 90 : 80,
  };

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: `Cost: ${potencyCosts.MINOR} • Power: 1`,
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: `Cost: ${potencyCosts.MAJOR} • Power: 1`,
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: `Cost: ${potencyCosts.EXTREME} • Power: 1`,
    },
  ];

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      setPot(new Potency());
    }
  }, [active, updateSpell]);

  useEffect(() => {
    if (!active) return;

    let cost = 0;

    switch (pot.getType()) {
      case "MINOR":
        cost = potencyCosts.MINOR;
        break;
      case "MAJOR":
        cost = potencyCosts.MAJOR;
        break;
      case "EXTREME":
        cost = potencyCosts.EXTREME;
        break;
    }

    updateSpell("cost", cost);
  }, [
    active,
    pot,
    potencyCosts.MINOR,
    potencyCosts.MAJOR,
    potencyCosts.EXTREME,
    updateSpell,
  ]);

  const handlePotencyChange = (
    value: Potency["getType"] extends () => infer T ? T : never,
  ) => {
    const newPotency = new Potency();

    switch (value) {
      case "MINOR":
        newPotency.minor();
        break;
      case "MAJOR":
        newPotency.major();
        break;
      case "EXTREME":
        newPotency.extreme();
        break;
    }

    setPot(newPotency);
  };

  return (
    <div>
      <h1>Recall Seal</h1>

      <div className="mt-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={pot.getType()}
          setSelectedPotency={handlePotencyChange}
        />
      </div>
    </div>
  );
}
