import { useState } from "react";

import { Mastery } from "@/app/models";

type ActionLimiterProps = {
  ParentMastery: Mastery;
  active: boolean;
};

type ActionLimiterTarget = "LIMB" | "BODY" | "PERIPHERAL";

export default function ActionLimiter({
  ParentMastery,
  active,
}: ActionLimiterProps) {
  const [target, setTarget] = useState<ActionLimiterTarget>("LIMB");
  const [description, setDescription] = useState("");

  if (!active) return null;

  const targetOptions = [
    {
      value: "LIMB" as const,
      label: "Limb",
      description: "Limits an individual limb.",
    },
    {
      value: "BODY" as const,
      label: "Body",
      description: "Limits the entire body.",
    },
    {
      value: "PERIPHERAL" as const,
      label: "Peripheral",
      description: "Limits peripheral body functions.",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-100">Action Limiter</h1>

      {/* Target */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Target
        </h2>

        <div className="space-y-2">
          {targetOptions.map((option) => (
            <label
              key={option.value}
              className={`block cursor-pointer rounded-md border p-3 transition ${
                target === option.value
                  ? "border-blue-500 bg-gray-700"
                  : "border-gray-700 bg-gray-900 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="action-limiter-target"
                  value={option.value}
                  checked={target === option.value}
                  onChange={() => setTarget(option.value)}
                  className="h-4 w-4"
                />

                <span className="font-medium text-gray-100">
                  {option.label}
                </span>
              </div>

              <p className="mt-1 pl-7 text-sm text-gray-400">
                {option.description}
              </p>
            </label>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300">
          Description
        </h2>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the action limitation..."
          rows={5}
          className="w-full resize-y rounded-md border border-gray-700 bg-gray-900 p-3 text-sm text-gray-100 placeholder-gray-500 outline-none transition focus:border-blue-500"
        />
      </section>
    </div>
  );
}
