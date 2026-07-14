import React, { useEffect, useState } from "react";
import { Mastery } from "@/app/models/Mastery";
import { Potency } from "@/app/models/Potency";
import { Spell } from "@/app/models/Spell";
import PotencySelector from "@/app/PotencyDisplay";
type PotencyType = "MINOR" | "MAJOR" | "EXTREME" | "CATACLYSMIC";

type AbsorbEnergyProps = {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
};

const potencyOptions = [
  {
    value: "MINOR" as const,
    label: "Minor",
    description: "10% – 9 / 6 / 3",
  },
  {
    value: "MAJOR" as const,
    label: "Major",
    description: "20% – 15 / 12 / 9",
  },
  {
    value: "EXTREME" as const,
    label: "Extreme",
    description: "30% – 21 / 18 / 15",
  },
];

export default function AbsorbEnergy({
  ParentMastery,
  active,
  updateSpell,
}: AbsorbEnergyProps) {
  const [selectedPotency, setSelectedPotency] = useState<PotencyType>("MINOR");

  useEffect(() => {
    if (!active) return;

    const mastery = new Mastery();
    const potency = new Potency();

    let ttt = 0;

    switch (selectedPotency) {
      case "MINOR":
        potency.minor();
        if (ParentMastery.getType() === mastery.novice(true)) ttt = 9;
        if (ParentMastery.getType() === mastery.intermediate(true)) ttt = 6;
        if (ParentMastery.getType() === mastery.mastered(true)) ttt = 3;
        break;

      case "MAJOR":
        potency.major();
        if (ParentMastery.getType() === mastery.novice(true)) ttt = 15;
        if (ParentMastery.getType() === mastery.intermediate(true)) ttt = 12;
        if (ParentMastery.getType() === mastery.mastered(true)) ttt = 9;
        break;

      case "EXTREME":
        potency.extreme();
        if (ParentMastery.getType() === mastery.novice(true)) ttt = 21;
        if (ParentMastery.getType() === mastery.intermediate(true)) ttt = 18;
        if (ParentMastery.getType() === mastery.mastered(true)) ttt = 15;
        break;
    }

    updateSpell("potency", potency);
    updateSpell("ttt", ttt);
  }, [selectedPotency, ParentMastery, active, updateSpell]);

  return (
    <div>
      <h1>Absorb Energy</h1>

      <PotencySelector
        options={potencyOptions}
        selectedPotency={selectedPotency}
        setSelectedPotency={setSelectedPotency}
      />

      <p>
        Target recovers a portion of the manna expended in the attack against
        them.
      </p>
    </div>
  );
}
