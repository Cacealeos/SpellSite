import { useState, useEffect } from "react";
import { Mastery, Spell, Potency } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const Coherence = ({
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
      description: "30 / 25 / 20",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "45 / 40 / 35",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "60 / 55 / 50",
    },
  ];

  let cost = 0;

  switch (ParentMastery.getType()) {
    case "NOVICE":
      switch (selectedPotency) {
        case "MINOR":
          cost = 30;
          break;
        case "MAJOR":
          cost = 45;
          break;
        case "EXTREME":
          cost = 60;
          break;
      }
      break;

    case "INTERMEDIATE":
      switch (selectedPotency) {
        case "MINOR":
          cost = 25;
          break;
        case "MAJOR":
          cost = 40;
          break;
        case "EXTREME":
          cost = 55;
          break;
      }
      break;

    case "MASTERED":
      switch (selectedPotency) {
        case "MINOR":
          cost = 20;
          break;
        case "MAJOR":
          cost = 35;
          break;
        case "EXTREME":
          cost = 50;
          break;
      }
      break;
  }

  /* =========================
     RESET WHEN INACTIVE
  ========================= */
  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
    }
  }, [active, updateSpell]);

  /* =========================
     SYNC TO PARENT SPELL
  ========================= */
  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    updateSpell("cost", cost);
  }, [active, cost, updateSpell]);

  return (
    <>
      <div>
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
        <br />
        <p className="text-sm text-gray-400">
          {" "}
          Info: Allows the wearer of armor to audibly or mentally communicate
          with wearers of other pieces of equipment that have the same
          enchantment. The number of targets that can communicate on the same
          channel scales with potency and environment. |GMD|
        </p>
      </div>
    </>
  );
};

export default Coherence;
