import { useEffect, useState } from "react";

import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const Dispell = ({
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
  const [intelligence, setIntelligence] = useState(0);
  const [baseCheck, setBaseCheck] = useState(5);

  // ==================================================
  // Potency Options
  // ==================================================

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "35 / 25 / 15",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "65 / 55 / 45",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "95 / 85 / 75",
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
    let base = 5;

    switch (selectedPotency) {
      case "MINOR":
        spellPotency.minor();
        base = 5;

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 35;
            break;
          case "INTERMEDIATE":
            cost = 25;
            break;
          case "MASTERED":
            cost = 15;
            break;
        }
        break;

      case "MAJOR":
        spellPotency.major();
        base = 6;

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 65;
            break;
          case "INTERMEDIATE":
            cost = 55;
            break;
          case "MASTERED":
            cost = 45;
            break;
        }
        break;

      case "EXTREME":
        spellPotency.extreme();
        base = 7;

        switch (ParentMastery.getType()) {
          case "NOVICE":
            cost = 95;
            break;
          case "INTERMEDIATE":
            cost = 85;
            break;
          case "MASTERED":
            cost = 75;
            break;
        }
        break;
    }

    setBaseCheck(base);

    updateSpell("cost", cost);
    updateSpell("potency", spellPotency);
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

      {/* Intelligence */}
      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-cyan-400">
          Resistance Check
        </h3>

        <label className="mb-2 block text-sm text-gray-300">
          Intelligence (Optional)
        </label>

        <input
          type="number"
          min={0}
          max={10}
          step={1}
          value={intelligence}
          onChange={(e) =>
            setIntelligence(
              Math.min(
                10,
                Math.max(0, Math.trunc(Number(e.target.value) || 0)),
              ),
            )
          }
          className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none"
        />

        <div className="mt-4 rounded-md border border-gray-700 bg-gray-900 p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Base</span>
            <span className="font-semibold text-cyan-400">{baseCheck}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">INT Bonus</span>
            <span className="font-semibold text-cyan-400">
              {Math.floor(intelligence / 2)}
            </span>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <p className="text-center text-sm text-gray-400">
              Formula: Base + INT ÷ 2
            </p>

            <p className="mt-2 text-center text-lg font-bold text-cyan-400">
              {baseCheck} + {Math.floor(intelligence / 2)} ={" "}
              {baseCheck + Math.floor(intelligence / 2)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dispell;
