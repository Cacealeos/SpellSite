import { useEffect, useState } from "react";
import { Mastery, Spell } from "@/app/models";

const loreOptions = [
  {
    value: "CRAFT" as const,
    label: "Craft",
    description: "×1 Cost",
    multiplier: 1,
  },
  {
    value: "RACE" as const,
    label: "Race",
    description: "×2 Cost",
    multiplier: 2,
  },
  {
    value: "THEOLOGY" as const,
    label: "Theology",
    description: "×5 Cost",
    multiplier: 5,
  },
];

const LoreBringer = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [selectedLore, setSelectedLore] = useState<
    "CRAFT" | "RACE" | "THEOLOGY"
  >("CRAFT");

  useEffect(() => {
    if (!active) {
      updateSpell("cost", 0);
      return;
    }

    let baseCost = 0;

    switch (ParentMastery.getType()) {
      case "NOVICE":
        baseCost = 300;
        break;

      case "INTERMEDIATE":
        baseCost = 200;
        break;

      case "MASTERED":
        baseCost = 100;
        break;
    }

    const multiplier =
      loreOptions.find((option) => option.value === selectedLore)?.multiplier ??
      1;

    updateSpell("cost", baseCost * multiplier);
  }, [active, ParentMastery, selectedLore, updateSpell]);

  return (
    <>
      <h2 className="mb-6 text-center text-3xl font-bold text-cyan-400">
        Lore Bringer
      </h2>

      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Lore Type
        </h3>

        <div className="space-y-3">
          {loreOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-4 py-3 hover:border-orange-500"
            >
              <div>
                <p className="font-medium text-gray-100">{option.label}</p>
                <p className="text-sm text-gray-400">{option.description}</p>
              </div>

              <input
                type="radio"
                name="lore"
                checked={selectedLore === option.value}
                onChange={() => setSelectedLore(option.value)}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3 text-gray-300">
        <p>
          Lore Bringer draws upon a chosen field of knowledge to determine the
          breadth of information recalled.
        </p>

        <p>
          Craft represents practical knowledge, Race represents cultural and
          historical knowledge, and Theology represents divine or spiritual
          knowledge.
        </p>
      </div>
    </>
  );
};

export default LoreBringer;
