import React, { useState, useEffect } from "react";
import { Mastery, Potency, Spell } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

const LifeBringer = ({
  ParentMastery,
  active,
  updateSpell,
}: {
  ParentMastery: Mastery;
  active: boolean;
  updateSpell: <K extends keyof Spell>(field: K, value: Spell[K]) => void;
}) => {
  const [conversion, setConversion] = useState<"DTL" | "LTD">("DTL");

  const [selectedPotency, setSelectedPotency] = useState<
    "MINOR" | "MAJOR" | "EXTREME"
  >("MINOR");

  const [ratio, setRatio] = useState(15);
  const [amount, setAmount] = useState(0);

  const potencyOptions =
    conversion === "DTL"
      ? [
          {
            value: "MINOR" as const,
            label: "Minor",
            description: "40 • 15:1",
          },
          {
            value: "MAJOR" as const,
            label: "Major",
            description: "80 • 10:1",
          },
          {
            value: "EXTREME" as const,
            label: "Extreme",
            description: "120 • 5:1",
          },
        ]
      : [
          {
            value: "MINOR" as const,
            label: "Minor",
            description: "20 • 1:5",
          },
          {
            value: "MAJOR" as const,
            label: "Major",
            description: "40 • 1:10",
          },
          {
            value: "EXTREME" as const,
            label: "Extreme",
            description: "60 • 1:20",
          },
        ];

  const conversionOptions = [
    {
      value: "DTL" as const,
      label: "Durability → Life Force",
      description: "Convert Durability into Life Force.",
    },
    {
      value: "LTD" as const,
      label: "Life Force → Durability",
      description: "Convert Life Force into Durability.",
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

    let currentCost = 40;
    let currentRatio = 15;

    switch (selectedPotency) {
      case "MINOR":
        spellPotency.minor();

        if (conversion === "DTL") {
          currentCost = 40;
          currentRatio = 15;
        } else {
          currentCost = 20;
          currentRatio = 5;
        }
        break;

      case "MAJOR":
        spellPotency.major();

        if (conversion === "DTL") {
          currentCost = 80;
          currentRatio = 10;
        } else {
          currentCost = 40;
          currentRatio = 10;
        }
        break;

      case "EXTREME":
        spellPotency.extreme();

        if (conversion === "DTL") {
          currentCost = 120;
          currentRatio = 5;
        } else {
          currentCost = 60;
          currentRatio = 20;
        }
        break;
    }

    setRatio(currentRatio);

    updateSpell("cost", currentCost);
    updateSpell("potency", spellPotency);
  }, [active, conversion, selectedPotency, updateSpell]);

  return (
    <>
      <h2 className="mb-6 text-center text-3xl font-bold text-cyan-400">
        Life Bringer
      </h2>

      {/* Conversion */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Conversion
        </h3>

        <div className="space-y-3">
          {conversionOptions.map((option) => (
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
                name="conversion"
                checked={conversion === option.value}
                onChange={() => setConversion(option.value)}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Potency */}
      <div className="mt-6">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={selectedPotency}
          setSelectedPotency={setSelectedPotency}
        />
      </div>

      {/* Conversion Amount */}
      <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5 shadow-md">
        <h3 className="mb-3 border-b border-gray-700 pb-2 text-lg font-semibold text-orange-400">
          Conversion Calculator
        </h3>

        <input
          type="number"
          min={0}
          step={ratio}
          value={amount}
          onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
        />

        <div className="mt-4 flex justify-between border-t border-gray-700 pt-3">
          <span className="text-gray-300">Result</span>

          <span className="font-semibold text-cyan-400">
            {conversion === "DTL" ? Math.floor(amount / ratio) : amount * ratio}
          </span>
        </div>

        <p className="mt-2 text-xs text-gray-400">
          This calculator is for player reference only and does not change the
          spell cost.
        </p>
      </div>
    </>
  );
};

export default LifeBringer;
