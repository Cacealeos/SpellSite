import { useState } from "react";

import { Mastery } from "@/app/models";
import PotencySelector from "@/app/PotencyDisplay";

type SpiritSoulLimiterProps = {
  ParentMastery: Mastery;
  active: boolean;
};

type PotencyType = "MINOR" | "MAJOR" | "EXTREME";
type DrainTarget = "SPIRIT" | "SOUL" | "BOTH";

export default function SpiritSoulLimiter({
  ParentMastery,
  active,
}: SpiritSoulLimiterProps) {
  const [potency, setPotency] = useState<PotencyType>("MINOR");
  const [target, setTarget] = useState<DrainTarget>("SPIRIT");
  const [currentIncrement, setCurrentIncrement] = useState(0);
  const [strength, setStrength] = useState(0);

  if (!active) return null;

  const potencyData = {
    MINOR: {
      maxIncrement: 5,
      maxStrength: 50,
    },
    MAJOR: {
      maxIncrement: 8,
      maxStrength: 80,
    },
    EXTREME: {
      maxIncrement: 11,
      maxStrength: 100,
    },
  };

  const { maxIncrement: baseMaxIncrement, maxStrength } = potencyData[potency];

  const maxIncrement =
    target === "BOTH" ? baseMaxIncrement / 2 : baseMaxIncrement;

  const potencyOptions = [
    {
      value: "MINOR" as const,
      label: "Minor",
      description: "Maximum increment: 5 • Maximum strength: 50",
    },
    {
      value: "MAJOR" as const,
      label: "Major",
      description: "Maximum increment: 8 • Maximum strength: 80",
    },
    {
      value: "EXTREME" as const,
      label: "Extreme",
      description: "Maximum increment: 11 • Maximum strength: 100",
    },
  ];

  const handlePotencyChange = (value: PotencyType) => {
    setPotency(value);

    const newMaxIncrement =
      target === "BOTH"
        ? potencyData[value].maxIncrement / 2
        : potencyData[value].maxIncrement;

    setCurrentIncrement((current) => Math.min(current, newMaxIncrement));

    setStrength((current) => Math.min(current, potencyData[value].maxStrength));
  };

  const handleTargetChange = (value: DrainTarget) => {
    setTarget(value);

    const newMaxIncrement =
      value === "BOTH" ? baseMaxIncrement / 2 : baseMaxIncrement;

    setCurrentIncrement((current) => Math.min(current, newMaxIncrement));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-100">
          Spirit or Soul Limiter
        </h1>
        <p className="mt-1 text-sm text-gray-400">DIRECT DAMAGE</p>
      </div>

      {/* Potency */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <PotencySelector
          options={potencyOptions}
          selectedPotency={potency}
          setSelectedPotency={handlePotencyChange}
        />
      </section>

      {/* Drain Target */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Drain Target
        </h2>

        <div className="space-y-2">
          {[
            { value: "SPIRIT" as const, label: "Spirit" },
            { value: "SOUL" as const, label: "Soul" },
            { value: "BOTH" as const, label: "Both" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-700 bg-gray-900/60 px-3 py-2 transition hover:border-gray-600"
            >
              <input
                type="radio"
                name="drain-target"
                value={option.value}
                checked={target === option.value}
                onChange={() => handleTargetChange(option.value)}
                className="accent-blue-500"
              />

              <span className="text-sm text-gray-200">{option.label}</span>
            </label>
          ))}
        </div>

        {target === "BOTH" && (
          <p className="mt-3 text-xs text-gray-500">
            Maximum drain increment is reduced by half when draining both Spirit
            and Soul.
          </p>
        )}
      </section>

      {/* Seal Values */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Set Seal Values
        </h2>

        <div className="space-y-5">
          {/* Seal Strength */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Seal Strength
            </label>

            <input
              type="number"
              min={0}
              max={maxStrength}
              step={1}
              value={strength}
              onChange={(e) =>
                setStrength(Math.min(Number(e.target.value), maxStrength))
              }
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-blue-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              Maximum strength: {maxStrength}
            </p>
          </div>

          {/* Drain Increment */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Drain Increment
            </label>

            <input
              type="number"
              min={0}
              max={maxIncrement}
              step={0.5}
              value={currentIncrement}
              onChange={(e) =>
                setCurrentIncrement(
                  Math.min(Number(e.target.value), maxIncrement),
                )
              }
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none transition focus:border-blue-500"
            />

            <p className="mt-2 text-sm text-gray-400">
              {target === "BOTH"
                ? "Spirit and Soul will drain until a maximum of"
                : `${target === "SPIRIT" ? "Spirit" : "Soul"} will drain until a maximum of`}{" "}
              <span className="font-medium text-gray-200">{strength}</span> is
              depleted.
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Maximum increment: {maxIncrement}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
