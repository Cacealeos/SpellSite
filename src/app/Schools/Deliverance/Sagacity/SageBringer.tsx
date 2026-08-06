import { useEffect, useState } from "react";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const SageBringer = ({
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
      description: "+1 | 90 / 60 / 30",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "+2 | 180 / 150 / 120",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "+3 | 270 / 240 / 210",
    },
  ];

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
            cost = 90;
            break;
          case "INTERMEDIATE":
            cost = 60;
            break;
          case "MASTERED":
            cost = 30;
            break;
        }
        break;

      case "MAJOR":
        spellPotency.major();

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 180;
            break;
          case "INTERMEDIATE":
            cost = 150;
            break;
          case "MASTERED":
            cost = 120;
            break;
        }
        break;

      case "EXTREME":
        spellPotency.extreme();

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 270;
            break;
          case "INTERMEDIATE":
            cost = 240;
            break;
          case "MASTERED":
            cost = 210;
            break;
        }
        break;
    }

    updateSpell("cost", cost);
    updateSpell("potency", spellPotency);
  }, [active, ParentMastery, selectedPotency, updateSpell]);

  return (
    <>
      <h2 className="mb-2 text-center text-3xl font-bold text-cyan-400">
        Sage Bringer
      </h2>

      <p className="mb-6 text-center text-sm text-gray-400">
        This spell lasts for three turns.
      </p>

      <PotencySelector
        options={potencyOptions}
        selectedPotency={selectedPotency}
        setSelectedPotency={setSelectedPotency}
      />

      <div className="mt-6 space-y-4 text-gray-300">
        <p>
          Sage Bringer enhances the caster's capabilities based on the selected
          potency.
        </p>

        <p>The effect remains active for three turns after casting.</p>
      </div>
    </>
  );
};

export default SageBringer;
